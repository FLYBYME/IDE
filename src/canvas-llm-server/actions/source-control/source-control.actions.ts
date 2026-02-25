import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import {
    SourceControlWorkspaceInput,
    SourceControlCommitInput,
    SourceControlBranchInput,
    SourceControlCheckoutInput,
    SourceControlMergeInput,
} from '../../models/schemas';
import { vfsManager } from '../../core/vfs-manager';
import { gatewayManager } from '../../core/gateway-manager';

// ── source-control.status ────────────────────────────
export const statusAction: ServiceAction = {
    name: 'source-control.status',
    version: 1,
    description: 'Get uncommitted changes compared to HEAD',
    domain: 'source-control',
    tags: ['source-control', 'status'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/source-control/status', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SourceControlWorkspaceInput,
    output: z.object({
        modified: z.array(z.string()),
        new: z.array(z.string()),
        deleted: z.array(z.string()),
    }),
    handler: async (ctx) => {
        const { workspaceId } = ctx.params as z.infer<typeof SourceControlWorkspaceInput>;
        const vfs = await vfsManager.getVFS(workspaceId);
        const result = await vfs.status();
        return {
            modified: result.modified,
            new: result.new,
            deleted: result.deleted,
        };
    },
};

// ── source-control.log ───────────────────────────────
export const logAction: ServiceAction = {
    name: 'source-control.log',
    version: 1,
    description: 'Get linear commit history from HEAD backwards',
    domain: 'source-control',
    tags: ['source-control', 'log', 'history'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/source-control/log', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SourceControlWorkspaceInput,
    output: z.array(z.object({
        hash: z.string(),
        message: z.string(),
        author: z.string(),
        timestamp: z.number(),
        parents: z.array(z.string()),
    })),
    handler: async (ctx) => {
        const { workspaceId } = ctx.params as z.infer<typeof SourceControlWorkspaceInput>;
        const vfs = await vfsManager.getVFS(workspaceId);
        const history = await vfs.log();
        return history.map((c) => ({
            hash: c.hash,
            message: c.message,
            author: c.author,
            timestamp: c.timestamp,
            parents: c.parents,
        }));
    },
};

// ── source-control.commit ────────────────────────────
export const commitAction: ServiceAction = {
    name: 'source-control.commit',
    version: 1,
    description: 'Create an immutable snapshot of the current working directory',
    domain: 'source-control',
    tags: ['source-control', 'commit'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/source-control/commit', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SourceControlCommitInput,
    output: z.object({ hash: z.string() }),
    handler: async (ctx) => {
        const { workspaceId, message } = ctx.params as z.infer<typeof SourceControlCommitInput>;
        const vfs = await vfsManager.getVFS(workspaceId);

        // Extract author from authenticated user headers
        const authorId = (ctx as any).headers?.['x-user-id'] || 'unknown';
        const hash = await vfs.commit(message, authorId);

        // Persist snapshot to disk after committing
        await vfsManager.persistSnapshot(workspaceId);

        gatewayManager.broadcast('system', 'source-control.committed', { workspaceId, hash, message });

        return { hash };
    },
};

// ── source-control.listBranches ──────────────────────
export const listBranchesAction: ServiceAction = {
    name: 'source-control.listBranches',
    version: 1,
    description: 'List all branches and the current HEAD reference',
    domain: 'source-control',
    tags: ['source-control', 'branches'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/source-control/branches', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SourceControlWorkspaceInput,
    output: z.object({
        branches: z.array(z.object({
            name: z.string(),
            commitHash: z.string(),
            isCurrent: z.boolean(),
        })),
        head: z.string(),
    }),
    handler: async (ctx) => {
        const { workspaceId } = ctx.params as z.infer<typeof SourceControlWorkspaceInput>;
        const vfs = await vfsManager.getVFS(workspaceId);
        const dump = await vfs.getDatabaseDump();

        const branches = dump.refs
            .filter(([ref]) => ref.startsWith('refs/heads/'))
            .map(([ref, hash]) => ({
                name: ref.replace('refs/heads/', ''),
                commitHash: hash,
                isCurrent: dump.HEAD === ref,
            }));

        return { branches, head: dump.HEAD };
    },
};

// ── source-control.createBranch ──────────────────────
export const createBranchAction: ServiceAction = {
    name: 'source-control.createBranch',
    version: 1,
    description: 'Create a new branch pointing to the current HEAD',
    domain: 'source-control',
    tags: ['source-control', 'branches', 'create'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/source-control/branches', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SourceControlBranchInput,
    output: z.object({ name: z.string(), created: z.boolean() }),
    handler: async (ctx) => {
        const { workspaceId, name } = ctx.params as z.infer<typeof SourceControlBranchInput>;
        const vfs = await vfsManager.getVFS(workspaceId);
        await vfs.createBranch(name);
        return { name, created: true };
    },
};

// ── source-control.deleteBranch ──────────────────────
export const deleteBranchAction: ServiceAction = {
    name: 'source-control.deleteBranch',
    version: 1,
    description: 'Delete a branch reference',
    domain: 'source-control',
    tags: ['source-control', 'branches', 'delete'],
    rest: { method: 'DELETE', path: '/workspaces/:workspaceId/source-control/branches/:name', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SourceControlBranchInput,
    output: z.object({ name: z.string(), deleted: z.boolean() }),
    handler: async (ctx) => {
        const { workspaceId, name } = ctx.params as z.infer<typeof SourceControlBranchInput>;
        const vfs = await vfsManager.getVFS(workspaceId);

        try {
            vfs.deleteBranch(name);
        } catch (err: any) {
            if (err.message?.includes('checked out')) {
                throw Object.assign(new Error(`Cannot delete branch "${name}": it is currently checked out.`), { statusCode: 400 });
            }
            throw err;
        }

        return { name, deleted: true };
    },
};

// ── source-control.checkout ──────────────────────────
export const checkoutAction: ServiceAction = {
    name: 'source-control.checkout',
    version: 1,
    description: 'Restore the working directory to a specific branch or commit',
    domain: 'source-control',
    tags: ['source-control', 'checkout'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/source-control/checkout', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SourceControlCheckoutInput,
    output: z.object({ ref: z.string(), success: z.boolean() }),
    handler: async (ctx) => {
        const { workspaceId, ref } = ctx.params as z.infer<typeof SourceControlCheckoutInput>;
        const vfs = await vfsManager.getVFS(workspaceId);

        // Check for uncommitted changes — warn before destructive operation
        const status = await vfs.status();
        const hasChanges = status.modified.length > 0 || status.new.length > 0 || status.deleted.length > 0;
        if (hasChanges) {
            throw Object.assign(
                new Error(`Uncommitted changes detected (${status.modified.length} modified, ${status.new.length} new, ${status.deleted.length} deleted). Commit or discard changes before checkout.`),
                { statusCode: 409 }
            );
        }

        await vfs.checkout(ref);
        await vfsManager.persistSnapshot(workspaceId);

        // Broadcast so connected clients reload their VFS
        gatewayManager.broadcast('vfs', 'workspace.checked_out', { workspaceId, ref });

        return { ref, success: true };
    },
};

// ── source-control.merge ─────────────────────────────
export const mergeAction: ServiceAction = {
    name: 'source-control.merge',
    version: 1,
    description: 'Merge a branch into the current branch',
    domain: 'source-control',
    tags: ['source-control', 'merge'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/source-control/merge', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SourceControlMergeInput,
    output: z.object({ result: z.string(), success: z.boolean() }),
    handler: async (ctx) => {
        const { workspaceId, branchName } = ctx.params as z.infer<typeof SourceControlMergeInput>;
        const vfs = await vfsManager.getVFS(workspaceId);

        let result: string;
        try {
            result = await vfs.merge(branchName);
        } catch (err: any) {
            if (err.message?.includes('Merge conflict')) {
                throw Object.assign(
                    new Error(err.message),
                    { statusCode: 409 }
                );
            }
            throw err;
        }

        await vfsManager.persistSnapshot(workspaceId);

        // Broadcast so connected clients reload their VFS
        gatewayManager.broadcast('vfs', 'workspace.checked_out', { workspaceId, branchName, result });

        return { result, success: true };
    },
};

export default [
    statusAction,
    logAction,
    commitAction,
    listBranchesAction,
    createBranchAction,
    deleteBranchAction,
    checkoutAction,
    mergeAction,
];
