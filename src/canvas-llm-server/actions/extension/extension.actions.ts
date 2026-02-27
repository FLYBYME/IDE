import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import { ExtensionSubmitInput, ExtensionBuildStatusOutput, SuccessOutput } from '../../models/schemas';
import { prisma } from '../../core/prisma';
import { extensionBuilderService } from '../../services/ExtensionBuilderService';
import * as fs from 'fs/promises';
import * as path from 'path';

// ============================================================================
// I. Marketplace Discovery & Usage (USER or ADMIN)
// ============================================================================

// ── extensions.list ──────────────────────────────────
export const listExtensionsAction: ServiceAction = {
    name: 'extensions.list',
    version: 1,
    description: 'Returns a list of all available extensions and their current status',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'list'],
    rest: { method: 'GET', path: '/extensions' },
    auth: { required: true },
    input: z.object({}),
    output: z.object({ extensions: z.array(z.any()) }),
    handler: async (ctx) => {
        const userId = ctx.metadata.user.id;
        const dbExtensions = await prisma.extension.findMany({
            where: { active: true }, // Only show globally active extensions in the main list
            include: { author: true, versions: true, installations: { where: { userId } } }
        });

        const extensions = dbExtensions.map(ext => {
            const userInst = ext.installations[0];
            return {
                id: ext.id,
                name: ext.name,
                description: ext.description,
                author: ext.author.username,
                active: userInst ? userInst.active : false,
                installedVersionId: userInst ? userInst.installedVersionId : null,
                versions: ext.versions
            };
        });

        if (extensions.length === 0) {
            extensions.push(
                { id: 'ext-dummy-1', name: 'Python Support', description: 'IntelliSense, linting, and debugging for Python.', author: 'tool-ms', active: false, installedVersionId: null, versions: [] },
                { id: 'ext-dummy-2', name: 'Docker Explorer', description: 'Manage Docker containers, images, and registries.', author: 'tool-ms', active: false, installedVersionId: null, versions: [] },
                { id: 'ext-dummy-3', name: 'GitLens Preview', description: 'Supercharge Git within the IDE.', author: 'tool-ms', active: false, installedVersionId: null, versions: [] }
            );
        }

        return { extensions };
    },
};

// ── extensions.search ────────────────────────────────
export const searchExtensionsAction: ServiceAction = {
    name: 'extensions.search',
    version: 1,
    description: 'Search and filter extensions',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'search'],
    rest: { method: 'GET', path: '/extensions/search' },
    auth: { required: true },
    input: z.object({
        q: z.string().optional(),
        author: z.string().optional(),
        sort: z.string().optional()
    }),
    output: z.object({ extensions: z.array(z.any()) }),
    handler: async (ctx) => {
        const { q, author, sort } = ctx.params as { q?: string, author?: string, sort?: string };
        const userId = ctx.metadata.user.id;

        let whereClause: any = { active: true }; // Only search globally active extensions

        if (q) {
            whereClause.OR = [
                { name: { contains: q } },
                { description: { contains: q } }
            ];
        }

        if (author) {
            whereClause.author = {
                username: author
            };
        }

        let orderByClause: any = { createdAt: 'desc' };

        const dbExtensions = await prisma.extension.findMany({
            where: whereClause,
            include: { author: true, versions: true, installations: { where: { userId } } },
            orderBy: orderByClause
        });

        const extensions = dbExtensions.map(ext => {
            const userInst = ext.installations[0];
            return {
                id: ext.id,
                name: ext.name,
                description: ext.description,
                author: ext.author.username,
                active: userInst ? userInst.active : false,
                installedVersionId: userInst ? userInst.installedVersionId : null,
                versions: ext.versions
            };
        });

        return { extensions };
    },
};

// ── extensions.get ───────────────────────────────────
export const getExtensionAction: ServiceAction = {
    name: 'extensions.get',
    version: 1,
    description: 'Get details of a single extension',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'get'],
    rest: { method: 'GET', path: '/extensions/:id' },
    auth: { required: true },
    input: z.object({ id: z.string() }),
    output: z.any(),
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };
        const userId = ctx.metadata.user.id;

        let extension = await prisma.extension.findUnique({
            where: { id },
            include: { author: true, versions: { orderBy: { createdAt: 'desc' } }, installations: { where: { userId } } }
        });

        if (!extension) {
            const extensionsByName = await prisma.extension.findMany({
                where: { name: id },
                include: { author: true, versions: { orderBy: { createdAt: 'desc' } }, installations: { where: { userId } } }
            });
            if (extensionsByName.length > 0) {
                extension = extensionsByName[0];
            } else {
                throw new Error(`Extension ${id} not found`);
            }
        }

        let readme = null;
        const latestReady = extension.versions.find(v => v.status === 'READY');
        if (latestReady) {
            try {
                const storageDir = path.resolve(process.cwd(), 'public/extensions', extension.id, latestReady.version);
                const readmePath = path.join(storageDir, 'README.md');
                readme = await fs.readFile(readmePath, 'utf-8');
            } catch (e) {
                // Ignore if not present
            }
        }

        const userInst = extension.installations[0];

        return {
            id: extension.id,
            name: extension.name,
            description: extension.description,
            author: extension.author.username,
            authorId: extension.authorId,
            gitUrl: extension.gitUrl,
            versions: extension.versions,
            readme,
            active: userInst ? userInst.active : false,
            isInstalled: !!userInst,
            installedVersionId: userInst?.installedVersionId
        };
    },
};

// ── extensions.getManifest ───────────────────────────
export const getManifestAction: ServiceAction = {
    name: 'extensions.getManifest',
    version: 1,
    description: 'Returns the extension manifest (package.json)',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'manifest'],
    rest: { method: 'GET', path: '/extensions/:id/manifest' },
    auth: { required: true },
    input: z.object({ id: z.string() }),
    output: z.any(),
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };

        const extension = await prisma.extension.findUnique({
            where: { id },
            include: { versions: { orderBy: { createdAt: 'desc' } } }
        });

        if (!extension) {
            throw new Error(`Extension ${id} not found`);
        }

        const latestReady = extension.versions.find(v => v.status === 'READY');
        if (!latestReady) {
            throw new Error(`Extension ${id} has no ready versions`);
        }

        try {
            const storageDir = path.resolve(process.cwd(), 'public/extensions', extension.id, latestReady.version);
            const packageJsonPath = path.join(storageDir, 'package.json');
            const data = await fs.readFile(packageJsonPath, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            throw new Error(`Manifest not found for extension ${id}`);
        }
    },
};

// ── extensions.install ────────────────────────────────
export const installExtensionAction: ServiceAction = {
    name: 'extensions.install',
    version: 1,
    description: 'Handles the logic for installing a specific extension version for a user',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'install'],
    rest: { method: 'POST', path: '/extensions/install' },
    auth: { required: true },
    input: z.object({ versionId: z.string() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { versionId } = ctx.params as { versionId: string };
        const userId = ctx.metadata.user.id;

        const version = await prisma.extensionVersion.findUnique({
            where: { id: versionId }
        });

        if (!version) {
            throw new Error(`ExtensionVersion ${versionId} not found`);
        }

        await prisma.userExtension.upsert({
            where: { userId_extensionId: { userId, extensionId: version.extensionId } },
            create: {
                userId,
                extensionId: version.extensionId,
                installedVersionId: version.id,
                active: true
            },
            update: {
                installedVersionId: version.id,
                active: true
            }
        });

        return { success: true };
    },
};

// ── extensions.uninstall ──────────────────────────────
export const uninstallExtensionAction: ServiceAction = {
    name: 'extensions.uninstall',
    version: 1,
    description: 'Uninstalls an extension for the active user',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'uninstall'],
    rest: { method: 'POST', path: '/extensions/:id/uninstall' },
    auth: { required: true },
    input: z.object({ id: z.string() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };
        const userId = ctx.metadata.user.id;

        const extension = await prisma.extension.findUnique({
            where: { id }
        });

        if (!extension) throw new Error(`Extension ${id} not found`);

        await prisma.userExtension.delete({
            where: {
                userId_extensionId: { userId, extensionId: id }
            }
        });

        return { success: true };
    },
};

// ── extensions.toggle ─────────────────────────────────
export const toggleExtensionAction: ServiceAction = {
    name: 'extensions.toggle',
    version: 1,
    description: 'Enable or disable a specific extension by ID for a user',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'toggle'],
    rest: { method: 'POST', path: '/extensions/:id/toggle' },
    auth: { required: true },
    input: z.object({ id: z.string(), enabled: z.boolean() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id, enabled } = ctx.params as { id: string, enabled: boolean };
        const userId = ctx.metadata.user.id;

        await prisma.userExtension.update({
            where: { userId_extensionId: { userId, extensionId: id } },
            data: { active: enabled }
        });

        return { success: true };
    },
};

// ============================================================================
// II. Extension Developer Operations (Ownership or ADMIN Bypass)
// ============================================================================

// ── extensions.submit ────────────────────────────────
export const submitExtensionAction: ServiceAction = {
    name: 'extensions.submit',
    version: 1,
    description: 'Submit an extension for building and publication',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'build'],
    rest: { method: 'POST', path: '/extensions/submit' },
    auth: { required: true },
    input: ExtensionSubmitInput,
    output: z.object({ buildId: z.string() }),
    handler: async (ctx) => {
        const { gitUrl, gitBranch, manifestPath } = ctx.params as z.infer<typeof ExtensionSubmitInput>;
        const userId = ctx.metadata.user.id;

        const repoName = gitUrl.split('/').pop()?.replace('.git', '') || 'unknown-extension';

        const extension = await prisma.extension.upsert({
            where: { name: repoName },
            update: {},
            create: {
                name: repoName,
                authorId: userId,
                description: 'Build in progress...',
                gitUrl,
                gitBranch,
                active: false // Requires admin approval or manual toggle depending on business logic
            },
        });

        const version = await prisma.extensionVersion.create({
            data: {
                extensionId: extension.id,
                version: 'pending',
                gitUrl,
                gitBranch,
                status: 'PENDING',
            },
        });

        extensionBuilderService.build(version.id, manifestPath).catch((err) => {
            console.error(`Background build failed for ${version.id}:`, err);
        });

        return { buildId: version.id };
    },
};

// ── extensions.getBuildStatus ────────────────────────
export const getBuildStatusAction: ServiceAction = {
    name: 'extensions.getBuildStatus',
    version: 1,
    description: 'Get the status of an extension build',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'status'],
    rest: { method: 'GET', path: '/extensions/builds/:buildId' },
    auth: { required: true },
    input: z.object({ buildId: z.string().uuid() }),
    output: ExtensionBuildStatusOutput,
    handler: async (ctx) => {
        const { buildId } = ctx.params as { buildId: string };
        const userId = ctx.metadata.user.id;
        const userRole = ctx.metadata.user.role;

        const version = await prisma.extensionVersion.findUnique({
            where: { id: buildId },
            include: { extension: true }
        });

        if (!version) throw new Error(`Build ${buildId} not found`);

        if (version.extension.authorId !== userId && userRole !== 'ADMIN') {
            throw new Error("Unauthorized: You do not have permission to view these build logs.");
        }

        return {
            id: version.id,
            extensionId: version.extensionId,
            status: version.status as any,
            buildLogs: version.buildLogs,
            entryPointUrl: version.entryPointUrl,
        };
    },
};

// ── extensions.update ─────────────────────────────────
export const updateExtensionAction: ServiceAction = {
    name: 'extensions.update',
    version: 1,
    description: 'Update an extension metadata',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'update'],
    rest: { method: 'PATCH', path: '/extensions/:id' },
    auth: { required: true },
    input: z.object({ id: z.string(), description: z.string().optional() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id, description } = ctx.params as { id: string, description?: string };
        const userId = ctx.metadata.user.id;
        const userRole = ctx.metadata.user.role;

        const extension = await prisma.extension.findUnique({ where: { id } });
        if (!extension) throw new Error(`Extension ${id} not found`);

        if (extension.authorId !== userId && userRole !== 'ADMIN') {
            throw new Error("Unauthorized: You are not the author of this extension.");
        }

        await prisma.extension.update({
            where: { id },
            data: {
                ...(description !== undefined && { description })
            }
        });

        return { success: true };
    },
};

// ── extensions.rebuild ────────────────────────────────
export const rebuildExtensionAction: ServiceAction = {
    name: 'extensions.rebuild',
    version: 1,
    description: 'Trigger a rebuild of the latest version of an extension',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'build'],
    rest: { method: 'POST', path: '/extensions/:id/rebuild' },
    auth: { required: true },
    input: z.object({ id: z.string().uuid() }),
    output: z.object({ buildId: z.string() }),
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };
        const userId = ctx.metadata.user.id;
        const userRole = ctx.metadata.user.role;

        const extension = await prisma.extension.findUnique({
            where: { id },
            include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });

        if (!extension) throw new Error(`Extension ${id} not found`);

        if (extension.authorId !== userId && userRole !== 'ADMIN') {
            throw new Error("Unauthorized: You are not the author of this extension.");
        }

        const latestVersion = extension.versions[0];
        if (!latestVersion) throw new Error("No previous versions found to rebuild from.");

        const newVersion = await prisma.extensionVersion.create({
            data: {
                extensionId: extension.id,
                version: 'pending',
                gitUrl: latestVersion.gitUrl,
                gitBranch: latestVersion.gitBranch,
                status: 'PENDING',
            },
        });

        extensionBuilderService.build(newVersion.id, '/package.json').catch((err) => {
            console.error(`Background rebuild failed for ${newVersion.id}:`, err);
        });

        return { buildId: newVersion.id };
    }
};

// ── extensions.deleteVersion ─────────────────────────
export const deleteExtensionVersionAction: ServiceAction = {
    name: 'extensions.deleteVersion',
    version: 1,
    description: 'Deletes a specific extension version and cleans up its assets from the filesystem.',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'deleteVersion'],
    rest: { method: 'DELETE', path: '/extensions/versions/:id' },
    auth: { required: true },
    input: z.object({ id: z.string().uuid() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };
        const userId = ctx.metadata.user.id;
        const userRole = ctx.metadata.user.role;

        const version = await prisma.extensionVersion.findUnique({
            where: { id },
            include: { extension: true }
        });

        if (!version) throw new Error(`ExtensionVersion ${id} not found`);

        if (version.extension.authorId !== userId && userRole !== 'ADMIN') {
            throw new Error("Unauthorized: You are not the author of this extension.");
        }

        const storageDir = path.resolve(process.cwd(), 'public/extensions', version.extensionId, version.id);
        const baseDir = path.resolve(process.cwd(), 'public/extensions');
        if (storageDir.startsWith(baseDir)) {
            try {
                await fs.rm(storageDir, { recursive: true, force: true });
            } catch (err) {
                console.warn(`Could not remove storage dir ${storageDir}`, err);
            }
        }

        await prisma.extensionVersion.delete({ where: { id } });

        return { success: true };
    }
};

// ── extensions.delete ─────────────────────────────────
export const deleteExtensionAction: ServiceAction = {
    name: 'extensions.delete',
    version: 1,
    description: 'Deletes an extension and all its versions',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'delete'],
    rest: { method: 'DELETE', path: '/extensions/:id' },
    auth: { required: true },
    input: z.object({ id: z.string() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };
        const userId = ctx.metadata.user.id;
        const userRole = ctx.metadata.user.role;

        const extension = await prisma.extension.findUnique({ where: { id } });

        if (!extension) throw new Error(`Extension ${id} not found`);

        if (extension.authorId !== userId && userRole !== 'ADMIN') {
            throw new Error("Unauthorized: You are not the author of this extension.");
        }

        await prisma.extension.delete({ where: { id } });

        try {
            const storageDir = path.resolve(process.cwd(), 'public/extensions', extension.id);
            await fs.rm(storageDir, { recursive: true, force: true });
        } catch (e) { }

        return { success: true };
    },
};

// ============================================================================
// III. Admin Moderation (Requires ADMIN Role)
// ============================================================================

// ── admin.extensions.listVersions ────────────────────
export const adminListExtensionVersionsAction: ServiceAction = {
    name: 'admin.extensions.listVersions',
    version: 1,
    description: 'Returns a list of all extension builds/versions globally',
    domain: 'admin',
    tags: ['admin', 'extension', 'listVersions', 'builds'],
    rest: { method: 'GET', path: '/admin/extensions/versions' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({}),
    output: z.object({ versions: z.array(z.any()) }),
    handler: async () => {
        const versions = await prisma.extensionVersion.findMany({
            include: { extension: true },
            orderBy: { createdAt: 'desc' }
        });

        const formattedVersions = versions.map(v => ({
            id: v.id,
            extensionId: v.extensionId,
            extensionName: v.extension.name,
            version: v.version,
            gitUrl: v.gitUrl,
            status: v.status as any,
            createdAt: v.createdAt,
            hasLogs: !!v.buildLogs,
        }));

        return { versions: formattedVersions };
    },
};

// ── admin.extensions.toggleStatus ────────────────────
export const adminToggleExtensionStatusAction: ServiceAction = {
    name: 'admin.extensions.toggleStatus',
    version: 1,
    description: 'Toggle global active/approved status of an extension',
    domain: 'admin',
    tags: ['admin', 'extension', 'status'],
    rest: { method: 'PATCH', path: '/admin/extensions/:id/status' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({ id: z.string().uuid(), isActive: z.boolean() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id, isActive } = ctx.params as { id: string, isActive: boolean };

        const extension = await prisma.extension.findUnique({ where: { id } });
        if (!extension) throw new Error(`Extension ${id} not found`);

        await prisma.extension.update({
            where: { id },
            data: { active: isActive }
        });

        return { success: true, message: `Extension ${id} status updated to ${isActive}` };
    }
};

// ── admin.extensions.delete ──────────────────────────
export const adminDeleteExtensionAction: ServiceAction = {
    name: 'admin.extensions.delete',
    version: 1,
    description: 'Force-delete any extension from the system',
    domain: 'admin',
    tags: ['admin', 'extension', 'delete'],
    rest: { method: 'DELETE', path: '/admin/extensions/:id' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({ id: z.string().uuid() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };

        const extension = await prisma.extension.findUnique({ where: { id } });
        if (!extension) throw new Error(`Extension ${id} not found`);

        // Cascade delete via Prisma handles the DB mapping
        await prisma.extension.delete({ where: { id } });

        // Cleanup associated physical files
        try {
            const storageDir = path.resolve(process.cwd(), 'public/extensions', extension.id);
            await fs.rm(storageDir, { recursive: true, force: true });
        } catch (e) { }

        return { success: true, message: 'Extension force-deleted successfully' };
    }
};

export default [
    listExtensionsAction,
    searchExtensionsAction,
    getExtensionAction,
    getManifestAction,
    installExtensionAction,
    uninstallExtensionAction,
    toggleExtensionAction,
    submitExtensionAction,
    getBuildStatusAction,
    updateExtensionAction,
    rebuildExtensionAction,
    deleteExtensionVersionAction,
    deleteExtensionAction,
    adminListExtensionVersionsAction,
    adminToggleExtensionStatusAction,
    adminDeleteExtensionAction
];