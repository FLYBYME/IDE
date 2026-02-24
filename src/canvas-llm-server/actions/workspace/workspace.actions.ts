import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import * as crypto from 'crypto';
import {
    WorkspaceCreateInput,
    WorkspaceUpdateInput,
    WorkspaceIdInput,
    WorkspaceListInput,
    WorkspaceDeleteInput,
    SuccessOutput,
} from '../../models/schemas';
import { vfsManager } from '../../core/vfs-manager';

// ── In-memory workspace store ────────────────────────
interface WorkspaceRecord {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

const workspaces: Map<string, WorkspaceRecord> = new Map();

function getWorkspacesByUser(userId: string): WorkspaceRecord[] {
    return [...workspaces.values()].filter((w) => w.ownerId === userId);
}

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
        workspaces: z.array(z.any()),
    }),
    handler: async (ctx) => {
        const userId = ctx.headers['x-user-id'];
        const { limit, offset, sort } = ctx.params as z.infer<typeof WorkspaceListInput>;
        let list = getWorkspacesByUser(userId);

        if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
        else if (sort === 'updated') list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

        const paged = list.slice(offset ?? 0, (offset ?? 0) + (limit ?? 20));
        return {
            total: list.length,
            workspaces: paged.map((w) => ({
                id: w.id,
                name: w.name,
                description: w.description,
                owner: w.ownerId,
                created: w.createdAt,
                updated: w.updatedAt,
                files: 0,
                size: 0,
            })),
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
        const userId = ctx.headers['x-user-id'];
        const { name, description, template, isPublic } = ctx.params as z.infer<typeof WorkspaceCreateInput>;
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        workspaces.set(id, {
            id,
            name,
            description: description ?? undefined,
            ownerId: userId,
            isPublic: isPublic ?? false,
            createdAt: now,
            updatedAt: now,
        });

        // Initialise VFS for this workspace
        await vfsManager.getVFS(id);

        return { id, name, description: description ?? undefined, owner: userId, created: now, template: template ?? 'empty' };
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
        const ws = workspaces.get(id);
        if (!ws) throw new Error('Workspace not found');

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
                lastModified: ws.updatedAt,
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
        const ws = workspaces.get(id);
        if (!ws) throw new Error('Workspace not found');

        if (name !== undefined && name !== null) ws.name = name;
        if (description !== undefined && description !== null) ws.description = description;
        if (isPublic !== undefined && isPublic !== null) ws.isPublic = isPublic;
        ws.updatedAt = new Date().toISOString();

        return { id: ws.id, updated: ws.updatedAt };
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
        const ws = workspaces.get(id);
        if (!ws) throw new Error('Workspace not found');

        await vfsManager.removeWorkspace(id);
        workspaces.delete(id);

        return { success: true, message: 'Workspace deleted' };
    },
};

export default [
    listWorkspacesAction,
    createWorkspaceAction,
    getWorkspaceAction,
    updateWorkspaceAction,
    deleteWorkspaceAction,
];
