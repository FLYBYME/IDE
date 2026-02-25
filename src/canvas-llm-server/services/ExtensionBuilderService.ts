import * as fs from 'fs/promises';
import * as path from 'path';
import crypto from 'crypto';
import { vfsManager } from '../core/vfs-manager';
import { workspaceContainerManager } from '../core/WorkspaceContainerManager';
import { prisma } from '../core/prisma';
import { ConsoleLogger } from 'tool-ms';

export class ExtensionBuilderService {
    private logger = new ConsoleLogger();

    /**
     * Orchestrates the complete secure build pipeline.
     */
    public async build(versionId: string): Promise<void> {
        const logEntries: string[] = [];
        const log = (msg: string) => {
            const entry = `[${new Date().toISOString()}] ${msg}`;
            this.logger.info(`[BUILD ${versionId}] ${msg}`);
            logEntries.push(entry);
            // Throttle database logging or append at end? Let's append at end for simplicity.
        };

        try {
            // 1. Fetch record
            const version = await prisma.extensionVersion.findUnique({
                where: { id: versionId },
                include: { extension: true }
            });

            if (!version) throw new Error(`ExtensionVersion ${versionId} not found`);

            log(`Starting build for ${version.extension.name}@${version.version}`);
            await this.updateStatus(versionId, 'CLONING', logEntries);

            // Step 1: Initialize VFS & Containerized Cloning
            const vfs = await vfsManager.getVFS(versionId);

            log(`Cloning repository: ${version.gitUrl} (branch: ${version.gitBranch})`);
            const cloneId = crypto.randomUUID();
            const cloneExitCode = await workspaceContainerManager.executeCommandAndWait(
                versionId,
                ['git', 'clone', '--branch', version.gitBranch, '--single-branch', version.gitUrl, '.'],
                cloneId
            );

            if (cloneExitCode !== 0) throw new Error(`Git clone failed with code ${cloneExitCode}`);
            log("Clone successful.");

            // Step 2: Manifest Validation
            const pkgFile = vfs.read('package.json');
            if (!pkgFile) throw new Error("package.json not found in repository root");

            const pkg = JSON.parse(pkgFile.content);
            if (!pkg.name || !pkg.version) throw new Error("Invalid package.json: missing name or version");
            log(`Validated manifest for ${pkg.name}@${pkg.version}`);

            // Step 3: Secure Dependency Installation
            log("Installing dependencies...");
            await this.updateStatus(versionId, 'INSTALLING', logEntries);
            const installId = crypto.randomUUID();
            const installExitCode = await workspaceContainerManager.executeCommandAndWait(
                versionId,
                ['npm', 'install', '--ignore-scripts'],
                installId
            );

            if (installExitCode !== 0) throw new Error(`npm install failed with code ${installExitCode}`);
            log("Dependencies installed.");

            // Step 4: Secure Compilation & Bundling
            log("Building extension...");
            await this.updateStatus(versionId, 'BUILDING', logEntries);

            const buildScript = `
import * as esbuild from 'esbuild';
try {
    await esbuild.build({
        entryPoints: ['src/index.ts', 'src/index.js'],
        bundle: true,
        outfile: 'dist/bundle.js',
        platform: 'browser',
        format: 'esm',
        minify: true,
        sourcemap: true,
        external: ['canvas-ide-core', 'monaco-editor', 'react', 'react-dom'],
    });
    console.log('Build successful');
} catch (e) {
    console.error('Build failed', e);
    process.exit(1);
}
`;
            vfs.write('canvas-build.mjs', buildScript);
            await workspaceContainerManager.syncFileToHost(versionId, 'canvas-build.mjs', buildScript);

            const buildId = crypto.randomUUID();
            const bundleExitCode = await workspaceContainerManager.executeCommandAndWait(
                versionId,
                ['npx', 'esbuild', '--version'], // check esbuild
                'check-esbuild'
            );

            // Actually run our build script
            const runBuildId = crypto.randomUUID();
            const buildExitCode = await workspaceContainerManager.executeCommandAndWait(
                versionId,
                ['node', 'canvas-build.mjs'],
                runBuildId
            );

            if (buildExitCode !== 0) throw new Error(`Bundling failed with code ${buildExitCode}`);
            log("Build successful.");

            // Step 5: Extraction & Storage
            const bundleFile = vfs.read('dist/bundle.js');
            if (!bundleFile) throw new Error("dist/bundle.js not found after build");

            const storageDir = path.resolve(process.cwd(), 'public/extensions', version.extensionId, version.version);
            await fs.mkdir(storageDir, { recursive: true });
            await fs.writeFile(path.join(storageDir, 'bundle.js'), bundleFile.content);

            const entryPointUrl = `/public/extensions/${version.extensionId}/${version.version}/bundle.js`;
            await prisma.extensionVersion.update({
                where: { id: versionId },
                data: {
                    status: 'READY',
                    entryPointUrl,
                    buildLogs: logEntries.join('\n')
                }
            });
            log(`Extension ready at ${entryPointUrl}`);

        } catch (err: any) {
            const errorMsg = err.message || String(err);
            log(`ERROR: ${errorMsg}`);
            await prisma.extensionVersion.update({
                where: { id: versionId },
                data: {
                    status: 'FAILED',
                    buildLogs: logEntries.join('\n')
                }
            }).catch((e: any) => this.logger.error("Failed to update error status in DB", e));

        } finally {
            // Step 6: Teardown
            log("Cleaning up build environment...");
            await workspaceContainerManager.stopWorkspace(versionId).catch((e: any) => this.logger.error("Teardown container failed", e));
            await vfsManager.removeWorkspace(versionId).catch((e: any) => this.logger.error("Teardown VFS failed", e));

        }
    }

    private async updateStatus(id: string, status: string, logs: string[]): Promise<void> {
        await prisma.extensionVersion.update({
            where: { id },
            data: {
                status,
                buildLogs: logs.join('\n')
            }
        });
    }
}

export const extensionBuilderService = new ExtensionBuilderService();
