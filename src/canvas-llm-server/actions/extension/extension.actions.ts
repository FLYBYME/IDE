import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import { ExtensionSubmitInput, ExtensionBuildStatusOutput, SuccessOutput } from '../../models/schemas';
import { prisma } from '../../core/prisma';
import { extensionBuilderService } from '../../services/ExtensionBuilderService';

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

export default [
    submitExtensionAction,
    getBuildStatusAction,
];

