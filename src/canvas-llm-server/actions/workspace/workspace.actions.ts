import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import * as crypto from 'crypto';
import {
    WorkspaceCreateInput,
    WorkspaceUpdateInput,
    WorkspaceIdInput,
    WorkspaceListInput,
    WorkspaceDeleteInput,
    WorkspaceExecuteInput,
    WorkspaceOutput,
    SuccessOutput,
} from '../../models/schemas';


import { vfsManager } from '../../core/vfs-manager';
import { prisma } from '../../core/prisma';
import { workspaceContainerManager } from '../../core/WorkspaceContainerManager';
import { WorkspaceModel } from '../../../../prisma/generated/prisma/models';


// ── workspace.list ───────────────────────────────────
export const listWorkspacesAction: ServiceAction = {
    name: 'workspace.list',
    version: 1,
    description: 'List all workspaces for authenticated user',
    domain: 'workspace',
    tags: ['workspace', 'list', 'user'],
    rest: { method: 'GET', path: '/workspaces', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceListInput,
    output: z.object({
        total: z.number(),
        workspaces: z.array(WorkspaceOutput),
    }),
    handler: async (ctx) => {
        const userId = ctx.metadata.user.id;;
        const { limit, offset, sort } = ctx.params as z.infer<typeof WorkspaceListInput>;

        let orderBy: any = undefined;
        if (sort === 'name') orderBy = { name: 'asc' };
        else if (sort === 'updated') orderBy = { updatedAt: 'desc' };

        const take = limit ?? 20;
        const skip = offset ?? 0;

        const total = await prisma.workspace.count({ where: { ownerId: userId } });
        const list = (await prisma.workspace.findMany({
            where: { ownerId: userId },
            orderBy,
            take,
            skip,
        })) as WorkspaceModel[];

        const mapped = list.map((w: WorkspaceModel) => ({
            id: w.id,
            name: w.name,
            description: w.description,
            ownerId: w.ownerId,
            isPublic: w.isPublic,
            createdAt: w.createdAt.toISOString(),
            updatedAt: w.updatedAt.toISOString(),
        }));

        return {
            total,
            workspaces: mapped,
        };
    },
};

// ── workspace.create ─────────────────────────────────
export const createWorkspaceAction: ServiceAction = {
    name: 'workspace.create',
    version: 1,
    description: 'Create a new workspace',
    domain: 'workspace',
    tags: ['workspace', 'create'],
    rest: { method: 'POST', path: '/workspaces', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceCreateInput,
    output: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional().nullable(),
        owner: z.string(),
        created: z.string(),
        template: z.string(),
    }),
    handler: async (ctx) => {
        const userId = ctx.metadata.user.id;
        const { name, description, template, isPublic } = ctx.params as z.infer<typeof WorkspaceCreateInput>;
        const id = crypto.randomUUID();

        const newWs = await prisma.workspace.create({
            data: {
                id,
                name,
                description: description ?? undefined,
                ownerId: userId,
                isPublic: isPublic ?? false,
            },
        });

        // Initialise VFS for this workspace
        await vfsManager.getVFS(newWs.id);

        return {
            id: newWs.id,
            name: newWs.name,
            description: newWs.description,
            owner: userId,
            created: newWs.createdAt.toISOString(),
            template: template ?? 'empty',
        };
    },
};

// ── workspace.get ────────────────────────────────────
export const getWorkspaceAction: ServiceAction = {
    name: 'workspace.get',
    version: 1,
    description: 'Get workspace details',
    domain: 'workspace',
    tags: ['workspace', 'read'],
    rest: { method: 'GET', path: '/workspaces/:id', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceIdInput,
    output: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional().nullable(),
        owner: z.string(),
        stats: z.object({
            fileCount: z.number(),
            totalSize: z.number(),
            lastModified: z.string(),
        }),
    }),
    handler: async (ctx) => {
        const { id } = ctx.params as z.infer<typeof WorkspaceIdInput>;
        const userId = ctx.metadata.user.id;

        const ws = await prisma.workspace.findUnique({ where: { id } });
        if (!ws) throw new Error('Workspace not found');
        if (ws.ownerId !== userId && !ws.isPublic) throw new Error('Unauthorized');

        const vfs = await vfsManager.getVFS(id);
        const files = vfs.getAllFiles();

        return {
            id: ws.id,
            name: ws.name,
            description: ws.description,
            owner: ws.ownerId,
            stats: {
                fileCount: files.length,
                totalSize: files.reduce((acc, f) => acc + f.content.length, 0),
                lastModified: ws.updatedAt.toISOString(),
            },
        };
    },
};

// ── workspace.update ─────────────────────────────────
export const updateWorkspaceAction: ServiceAction = {
    name: 'workspace.update',
    version: 1,
    description: 'Update workspace metadata',
    domain: 'workspace',
    tags: ['workspace', 'update'],
    rest: { method: 'PATCH', path: '/workspaces/:id', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceUpdateInput,
    output: z.object({ id: z.string(), updated: z.string() }),
    handler: async (ctx) => {
        const { id, name, description, isPublic } = ctx.params as z.infer<typeof WorkspaceUpdateInput>;
        const userId = ctx.metadata.user.id;

        let ws = await prisma.workspace.findUnique({ where: { id } });
        if (!ws) throw new Error('Workspace not found');
        if (ws.ownerId !== userId) throw new Error('Unauthorized');

        ws = await prisma.workspace.update({
            where: { id },
            data: {
                name: name ?? undefined,
                description: description ?? undefined,
                isPublic: isPublic ?? undefined,
            },
        });

        return { id: ws.id, updated: ws.updatedAt.toISOString() };
    },
};

// ── workspace.delete ─────────────────────────────────
export const deleteWorkspaceAction: ServiceAction = {
    name: 'workspace.delete',
    version: 1,
    description: 'Delete a workspace',
    domain: 'workspace',
    tags: ['workspace', 'delete'],
    rest: { method: 'DELETE', path: '/workspaces/:id', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceDeleteInput,
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id } = ctx.params as z.infer<typeof WorkspaceDeleteInput>;
        const userId = ctx.metadata.user.id;

        const ws = await prisma.workspace.findUnique({ where: { id } });
        if (!ws) throw new Error('Workspace not found');
        if (ws.ownerId !== userId) throw new Error('Unauthorized');

        await prisma.workspace.delete({ where: { id } });
        await vfsManager.removeWorkspace(id);
        await workspaceContainerManager.stopWorkspace(id).catch(e => console.error(`Failed to stop container for workspace ${id}:`, e));

        return { success: true, message: 'Workspace deleted' };
    },
};

// ── workspace.execute ────────────────────────────────
export const executeCommandAction: ServiceAction = {
    name: 'workspace.execute',
    version: 1,
    description: 'Execute a command in the workspace container',
    domain: 'workspace',
    tags: ['workspace', 'execute', 'docker'],
    rest: { method: 'POST', path: '/workspaces/:id/execute', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceExecuteInput,
    output: z.object({ executionId: z.string() }),
    handler: async (ctx) => {
        const { id, command } = ctx.params as z.infer<typeof WorkspaceExecuteInput>;
        const userId = ctx.metadata.user.id;

        const ws = await prisma.workspace.findUnique({ where: { id } });
        if (!ws) throw new Error('Workspace not found');
        if (ws.ownerId !== userId) throw new Error('Unauthorized');

        const executionId = crypto.randomUUID();

        // Ensure VFS (and thus container) is loaded
        await vfsManager.getVFS(id);

        // Start execution in background (SSE will stream output)
        workspaceContainerManager.executeCommand(id, command, executionId).catch((err: any) => {
            console.error(`Command execution failed for ${id}:`, err);
        });


        return { executionId };
    },
};

// ── workspace.processes ──────────────────────────────
export const listWorkspaceProcessesAction: ServiceAction = {
    name: 'workspace.processes',
    version: 1,
    description: 'List active processes in the workspace container',
    domain: 'workspace',
    tags: ['workspace', 'process', 'execute'],
    rest: { method: 'GET', path: '/workspaces/:id/processes', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceIdInput,
    output: z.object({
        processes: z.array(z.object({
            executionId: z.string(),
            command: z.array(z.string()),
            startTime: z.number()
        }))
    }),
    handler: async (ctx) => {
        const { id } = ctx.params as z.infer<typeof WorkspaceIdInput>;
        const userId = ctx.metadata.user.id;

        const ws = await prisma.workspace.findUnique({ where: { id } });
        if (!ws) throw new Error('Workspace not found');
        if (ws.ownerId !== userId) throw new Error('Unauthorized');

        // Ensure VFS is loaded, though it should be if container is running
        await vfsManager.getVFS(id);

        const processes = workspaceContainerManager.getActiveProcesses(id);
        return { processes };
    }
};

export default [
    listWorkspacesAction,
    createWorkspaceAction,
    getWorkspaceAction,
    updateWorkspaceAction,
    deleteWorkspaceAction,
    executeCommandAction,
    listWorkspaceProcessesAction,
];

