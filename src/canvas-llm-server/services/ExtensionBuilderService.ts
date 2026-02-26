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
    public async build(versionId: string, manifestPath: string = '/package.json'): Promise<void> {
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

            // Wait for VFS to sync
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Step 2: Manifest Validation
            const normalizedManifestPath = manifestPath.startsWith('/') ? manifestPath.substring(1) : manifestPath;
            const buildDir = path.dirname(normalizedManifestPath);

            const pkgFile = vfs.read(normalizedManifestPath);
            if (!pkgFile) throw new Error(`${normalizedManifestPath} not found in repository`);

            const pkg = JSON.parse(pkgFile.content);
            if (!pkg.name || !pkg.version) throw new Error(`Invalid ${normalizedManifestPath}: missing name or version`);
            log(`Validated manifest for ${pkg.name}@${pkg.version}`);

            // Update package version
            await prisma.extensionVersion.update({
                where: { id: versionId },
                data: { version: pkg.version }
            });

            // Step 3: Secure Dependency Installation
            log(`Installing dependencies in ${buildDir}...`);
            await this.updateStatus(versionId, 'INSTALLING', logEntries);
            const installId = crypto.randomUUID();
            const installCmd = buildDir === '.' ? 'npm install --ignore-scripts' : `cd ${buildDir} && npm install --ignore-scripts`;
            const installExitCode = await workspaceContainerManager.executeCommandAndWait(
                versionId,
                ['sh', '-c', installCmd],
                installId
            );

            if (installExitCode !== 0) throw new Error(`npm install failed with code ${installExitCode}`);
            log("Dependencies installed.");

            // Step 4: Secure Compilation & Bundling
            log("Building extension...");
            await this.updateStatus(versionId, 'BUILDING', logEntries);

            const buildScript = `
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const buildDir = '${buildDir}';
const srcIndexTs = path.join(buildDir, 'src/index.ts');
const srcIndexJs = path.join(buildDir, 'src/index.js');
const entryPoints = [];
if (fs.existsSync(srcIndexTs)) entryPoints.push(srcIndexTs);
if (fs.existsSync(srcIndexJs)) entryPoints.push(srcIndexJs);

if (entryPoints.length === 0) {
    console.error('No entry points found (src/index.ts or src/index.js) in ' + buildDir);
    process.exit(1);
}

try {
    await esbuild.build({
        entryPoints,
        bundle: true,
        outfile: path.join(buildDir, 'dist/bundle.js'),
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
            const bridgeDir = path.resolve('/tmp/canvas-workspaces', versionId);
            const bundleHostPath = path.join(bridgeDir, buildDir, 'dist/bundle.js');

            // Try buildDir README first, fallback to root README
            let readmeHostPath = path.join(bridgeDir, buildDir, 'README.md');

            let bundleContent: string;
            try {
                bundleContent = await fs.readFile(bundleHostPath, 'utf-8');
            } catch (e) {
                throw new Error("dist/bundle.js not found after build");
            }

            let readmeContent: string | null = null;
            try {
                readmeContent = await fs.readFile(readmeHostPath, 'utf-8');
            } catch (e) {
                try {
                    // Fallback to repository root
                    readmeContent = await fs.readFile(path.join(bridgeDir, 'README.md'), 'utf-8');
                } catch (e2) {
                    // Ignore if not present at all
                }
            }
            const baseDir = path.resolve(process.cwd(), 'public/extensions');
            const storageDir = path.resolve(baseDir, version.extensionId, versionId);

            if (!storageDir.startsWith(baseDir)) {
                throw new Error("Security Violation: Invalid extension ID or version format.");
            }

            await fs.mkdir(storageDir, { recursive: true });
            await fs.writeFile(path.join(storageDir, 'bundle.js'), bundleContent);
            await fs.writeFile(path.join(storageDir, 'package.json'), pkgFile.content);
            if (readmeContent) {
                await fs.writeFile(path.join(storageDir, 'README.md'), readmeContent);
            }

            const entryPointUrl = `/public/extensions/${version.extensionId}/${versionId}/bundle.js`;
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
