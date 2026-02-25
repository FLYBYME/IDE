import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import { ExtensionSubmitInput, ExtensionBuildStatusOutput, SuccessOutput } from '../../models/schemas';
import { prisma } from '../../core/prisma';
import { extensionBuilderService } from '../../services/ExtensionBuilderService';

// In-memory store for active extensions for prototype
const activeExtensions = new Set<string>();

// ── extensions.submit ────────────────────────────────
export const submitExtensionAction: ServiceAction = {
    name: 'extensions.submit',
    version: 1,
    description: 'Submit an extension for building and publication',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'build'],
    rest: { method: 'POST', path: '/extensions/submit', middleware: ['requireAuth'] },
    auth: { required: true },
    input: ExtensionSubmitInput,
    output: z.object({ buildId: z.string() }),
    handler: async (ctx) => {
        const { gitUrl, gitBranch, manifestPath } = ctx.params as z.infer<typeof ExtensionSubmitInput>;
        const userId = ctx.headers['x-user-id'] as string;

        // 1. Determine a placeholder name from git URL

        const repoName = gitUrl.split('/').pop()?.replace('.git', '') || 'unknown-extension';

        // 2. Create/Find Extension and Create Version record
        const extension = await prisma.extension.upsert({
            where: { name: repoName }, // Temporary until validated
            update: {},
            create: {
                name: repoName,
                authorId: userId,
                description: 'Build in progress...',
            },
        });

        const version = await prisma.extensionVersion.create({
            data: {
                extensionId: extension.id,
                version: 'pending', // Temporary until validated
                gitUrl,
                gitBranch,
                status: 'PENDING',
            },
        });

        // 3. Initiate build asynchronously (floating promise)
        extensionBuilderService.build(version.id).catch((err) => {
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
    rest: { method: 'GET', path: '/extensions/builds/:buildId', middleware: ['requireAuth'] },
    auth: { required: true },
    input: z.object({ buildId: z.string().uuid() }),
    output: ExtensionBuildStatusOutput,
    handler: async (ctx) => {
        const { buildId } = ctx.params as any;
        const version = await prisma.extensionVersion.findUnique({
            where: { id: buildId },
        });

        if (!version) {
            throw new Error(`Build ${buildId} not found`);
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

// ── extensions.listVersions ──────────────────────────
export const listExtensionVersionsAction: ServiceAction = {
    name: 'extensions.listVersions',
    version: 1,
    description: 'Returns a list of all extension builds/versions',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'listVersions', 'builds'],
    rest: { method: 'GET', path: '/extensions/versions', middleware: ['requireAuth'] },
    auth: { required: true },
    input: z.object({}),
    output: z.object({ versions: z.array(z.any()) }), // Define generic array schema for now
    handler: async () => {
        const versions = await prisma.extensionVersion.findMany({
            include: { extension: true },
            orderBy: { createdAt: 'desc' } // Return newest first
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

// ── extensions.list ──────────────────────────────────
export const listExtensionsAction: ServiceAction = {
    name: 'extensions.list',
    version: 1,
    description: 'Returns a list of all available extensions and their current status',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'list'],
    rest: { method: 'GET', path: '/extensions', middleware: ['requireAuth'] },
    auth: { required: true },
    input: z.object({}),
    output: z.object({ extensions: z.array(z.any()) }),
    handler: async (ctx) => {
        const dbExtensions = await prisma.extension.findMany({
            include: { author: true, versions: true }
        });

        const extensions = dbExtensions.map(ext => ({
            id: ext.id,
            name: ext.name,
            description: ext.description,
            author: ext.author.username,
            active: activeExtensions.has(ext.id)
        }));

        if (extensions.length === 0) {
            extensions.push(
                { id: 'ext-dummy-1', name: 'Python Support', description: 'IntelliSense, linting, and debugging for Python.', author: 'tool-ms', active: activeExtensions.has('ext-dummy-1') },
                { id: 'ext-dummy-2', name: 'Docker Explorer', description: 'Manage Docker containers, images, and registries.', author: 'tool-ms', active: activeExtensions.has('ext-dummy-2') },
                { id: 'ext-dummy-3', name: 'GitLens Preview', description: 'Supercharge Git within the IDE.', author: 'tool-ms', active: activeExtensions.has('ext-dummy-3') }
            );
        }

        return { extensions };
    },
};

// ── extensions.toggle ─────────────────────────────────
export const toggleExtensionAction: ServiceAction = {
    name: 'extensions.toggle',
    version: 1,
    description: 'Enable or disable a specific extension by ID',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'toggle'],
    rest: { method: 'POST', path: '/extensions/:id/toggle', middleware: ['requireAuth'] },
    auth: { required: true },
    input: z.object({ id: z.string(), enabled: z.boolean() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id } = ctx.params as any;
        const { enabled } = ctx.params as { enabled: boolean };

        if (enabled) {
            activeExtensions.add(id);
        } else {
            activeExtensions.delete(id);
        }

        return { success: true };
    },
};

// ── extensions.install ────────────────────────────────
export const installExtensionAction: ServiceAction = {
    name: 'extensions.install',
    version: 1,
    description: 'Handles the logic for adding new extension bundles to the server',
    domain: 'extension',
    tags: ['extension', 'marketplace', 'install'],
    rest: { method: 'POST', path: '/extensions/install', middleware: ['requireAuth'] },
    auth: { required: true },
    input: z.object({ id: z.string() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };
        activeExtensions.add(id);
        return { success: true };
    },
};

export default [
    submitExtensionAction,
    getBuildStatusAction,
    listExtensionVersionsAction,
    listExtensionsAction,
    toggleExtensionAction,
    installExtensionAction,
];

