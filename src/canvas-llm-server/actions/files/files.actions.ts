import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import {
    FileListTreeInput,
    FileGetInput,
    FileCreateInput,
    FileSaveInput,
    FileDeleteInput,
    FileRenameInput,
    FileCopyInput,
    FileSearchInput,
    SuccessOutput,
    FileInfoOutput,
} from '../../models/schemas';
import { vfsManager } from '../../core/vfs-manager';
import { gatewayManager } from '../../core/gateway-manager';
import { workspaceContainerManager } from '../../core/WorkspaceContainerManager';
import { checkWorkspaceAccess } from '../workspace/workspace.actions';


// ── file.listTree ────────────────────────────────────
export const listTreeAction: ServiceAction = {
    name: 'file.listTree',
    version: 1,
    description: 'List all files/folders in workspace (tree structure)',
    domain: 'files',
    tags: ['files', 'list', 'tree'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/files' },
    auth: { required: true },
    input: FileListTreeInput,
    output: z.object({ path: z.string(), entries: z.array(FileInfoOutput) }),
    handler: async (ctx) => {
        const { workspaceId, path: dirPath, recursive } = ctx.params;

        const userId = ctx.metadata.user.id;
        await checkWorkspaceAccess(workspaceId, userId);

        const vfs = await vfsManager.getVFS(workspaceId);

        const names = vfs.readdir(dirPath || '/', { recursive: recursive ?? false });
        const entries = names.map((name) => {
            const fullPath = dirPath === '/' ? `/${name}` : `${dirPath}/${name}`;
            const file = vfs.read(fullPath);
            if (file) {
                return {
                    name,
                    type: 'file' as const,
                    path: fullPath,
                    size: file.content.length,
                    modified: new Date().toISOString(),
                };
            }
            return {
                name,
                type: 'folder' as const,
                path: fullPath,
                modified: new Date().toISOString(),
            };
        });

        return { path: dirPath || '/', entries };
    },
};

// ── file.get ─────────────────────────────────────────
export const getFileAction: ServiceAction = {
    name: 'file.get',
    version: 1,
    description: 'Get file content',
    domain: 'files',
    tags: ['files', 'read'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/files/:path' },
    auth: { required: true },
    input: FileGetInput,
    output: z.object({
        path: z.string(),
        type: z.literal('file'),
        content: z.any(),
        encoding: z.string(),
        size: z.number(),
        language: z.string(),
        modified: z.string(),
    }),
    handler: async (ctx) => {
        const { workspaceId, path: filePath } = ctx.params as z.infer<typeof FileGetInput>;

        const userId = ctx.metadata.user.id;
        await checkWorkspaceAccess(workspaceId, userId);

        const vfs = await vfsManager.getVFS(workspaceId);

        const file = vfs.read(filePath);
        if (!file) throw new Error(`File not found: ${filePath}`);

        gatewayManager.broadcast('system', 'file.opened', { workspaceId, path: filePath });

        return {
            path: file.path.replace(vfs.rootDir, ''),
            type: 'file' as const,
            content: file.content,
            encoding: 'utf8',
            size: file.content.length,
            language: file.context?.language || 'text',
            modified: new Date().toISOString(),
        };
    },
};

// ── file.create ──────────────────────────────────────
export const createFileAction: ServiceAction = {
    name: 'file.create',
    version: 1,
    description: 'Create new file or folder',
    domain: 'files',
    tags: ['files', 'create'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/files' },
    auth: { required: true },
    input: FileCreateInput,
    output: z.object({ path: z.string(), type: z.string(), created: z.string() }),
    handler: async (ctx) => {
        const { workspaceId, path: filePath, type, content } = ctx.params as z.infer<typeof FileCreateInput>;

        const userId = ctx.metadata.user.id;
        await checkWorkspaceAccess(workspaceId, userId);

        const vfs = await vfsManager.getVFS(workspaceId);


        if (type === 'file') {
            vfs.write(filePath, content ?? '');
            await workspaceContainerManager.syncFileToHost(workspaceId, filePath, content ?? '');
        } else {
            // Create a folder by writing a placeholder — VFS infers directories from paths
            vfs.write(`${filePath}/.keep`, '');
            await workspaceContainerManager.syncFileToHost(workspaceId, `${filePath}/.keep`, '');
        }

        // Broadcast event
        gatewayManager.broadcast('vfs', 'file.created', { workspaceId, path: filePath, type });

        return { path: filePath, type, created: new Date().toISOString() };
    },
};

// ── file.save ────────────────────────────────────────
export const saveFileAction: ServiceAction = {
    name: 'file.save',
    version: 1,
    description: 'Save/update file content',
    domain: 'files',
    tags: ['files', 'save', 'update'],
    rest: { method: 'PUT', path: '/workspaces/:workspaceId/files/:path' },
    auth: { required: true },
    input: FileSaveInput,
    output: z.object({
        path: z.string(),
        size: z.number(),
        modified: z.string(),
    }),
    handler: async (ctx) => {
        const { workspaceId, path: filePath, content } = ctx.params as z.infer<typeof FileSaveInput>;

        const userId = ctx.metadata.user.id;
        await checkWorkspaceAccess(workspaceId, userId);

        const vfs = await vfsManager.getVFS(workspaceId);

        vfs.write(filePath, content);
        await workspaceContainerManager.syncFileToHost(workspaceId, filePath, content);

        // Auto-persist snapshot
        await vfsManager.persistSnapshot(workspaceId);

        // Broadcast event
        gatewayManager.broadcast('vfs', 'file.saved', { workspaceId, path: filePath, size: content.length, content });

        return {
            path: filePath,
            size: content.length,
            modified: new Date().toISOString(),
        };
    },
};

// ── file.delete ──────────────────────────────────────
export const deleteFileAction: ServiceAction = {
    name: 'file.delete',
    version: 1,
    description: 'Delete file or folder',
    domain: 'files',
    tags: ['files', 'delete'],
    rest: { method: 'DELETE', path: '/workspaces/:workspaceId/files/:path' },
    auth: { required: true },
    input: FileDeleteInput,
    output: z.object({ success: z.boolean(), deleted: z.number() }),
    handler: async (ctx) => {
        const { workspaceId, path: filePath, recursive } = ctx.params as z.infer<typeof FileDeleteInput>;

        const userId = ctx.metadata.user.id;
        await checkWorkspaceAccess(workspaceId, userId);

        const vfs = await vfsManager.getVFS(workspaceId);


        if (recursive) {
            const entries = vfs.readdir(filePath, { recursive: true });
            let count = 0;
            for (const entry of entries) {
                const fullPath = `${filePath}/${entry}`;
                if (vfs.read(fullPath)) {
                    vfs.delete(fullPath);
                    count++;
                }
            }
            vfs.delete(filePath);
            // Broadcast event for folder deletion (with recursive flag)
            gatewayManager.broadcast('vfs', 'file.deleted', { workspaceId, path: filePath, recursive: true });
            return { success: true, deleted: count };
        }

        vfs.delete(filePath);
        // Broadcast event
        gatewayManager.broadcast('vfs', 'file.deleted', { workspaceId, path: filePath, recursive: false });
        return { success: true, deleted: 1 };
    },
};

// ── file.rename ──────────────────────────────────────
export const renameFileAction: ServiceAction = {
    name: 'file.rename',
    version: 1,
    description: 'Rename or move file/folder',
    domain: 'files',
    tags: ['files', 'rename', 'move'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/files/rename' },
    auth: { required: true },
    input: FileRenameInput,
    output: z.object({ oldPath: z.string(), newPath: z.string(), moved: z.string() }),
    handler: async (ctx) => {
        const { workspaceId, oldPath, newPath } = ctx.params as z.infer<typeof FileRenameInput>;

        const userId = ctx.metadata.user.id;
        await checkWorkspaceAccess(workspaceId, userId);

        const vfs = await vfsManager.getVFS(workspaceId);


        const file = vfs.read(oldPath);
        if (!file) throw new Error(`File not found: ${oldPath}`);

        vfs.write(newPath, file.content);
        vfs.delete(oldPath);
        await workspaceContainerManager.syncFileToHost(workspaceId, newPath, file.content);
        // Note: For deletion of oldPath on host, we should probably add a deleteFromHost helper
        // but for now I'll just sync the new file.


        // Broadcast event
        gatewayManager.broadcast('vfs', 'file.renamed', { workspaceId, oldPath, newPath });

        return { oldPath, newPath, moved: new Date().toISOString() };
    },
};

// ── file.copy ────────────────────────────────────────
export const copyFileAction: ServiceAction = {
    name: 'file.copy',
    version: 1,
    description: 'Duplicate file or folder',
    domain: 'files',
    tags: ['files', 'copy'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/files/copy' },
    auth: { required: true },
    input: FileCopyInput,
    output: z.object({ original: z.string(), copy: z.string(), created: z.string() }),
    handler: async (ctx) => {
        const { workspaceId, path: filePath, destinationPath } = ctx.params as z.infer<typeof FileCopyInput>;

        const userId = ctx.metadata.user.id;
        await checkWorkspaceAccess(workspaceId, userId);

        const vfs = await vfsManager.getVFS(workspaceId);


        const file = vfs.read(filePath);
        if (!file) throw new Error(`File not found: ${filePath}`);

        const copyPath = destinationPath ?? `${filePath} (copy)`;
        vfs.write(copyPath, file.content);

        return { original: filePath, copy: copyPath, created: new Date().toISOString() };
    },
};

// ── file.search ──────────────────────────────────────
export const searchFilesAction: ServiceAction = {
    name: 'file.search',
    version: 1,
    description: 'Search files by name or content',
    domain: 'files',
    tags: ['files', 'search'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/files/search' },
    auth: { required: true },
    input: FileSearchInput,
    output: z.object({
        total: z.number(),
        results: z.array(z.object({
            path: z.string(),
            matches: z.array(z.object({
                line: z.number().optional().nullable(),
                column: z.number().optional().nullable(),
                snippet: z.string().optional().nullable(),
            })),
        })),
    }),
    handler: async (ctx) => {
        const { workspaceId, query, type, caseSensitive, limit } = ctx.params as z.infer<typeof FileSearchInput>;

        const userId = ctx.metadata.user.id;
        await checkWorkspaceAccess(workspaceId, userId);

        const vfs = await vfsManager.getVFS(workspaceId);

        const allFiles = vfs.getAllFiles(); // Object refs are cheap
        const searchType = type ?? 'both';
        const maxResults = limit ?? 100;

        const results: Array<{ path: string; matches: Array<{ line?: number; column?: number; snippet?: string }> }> = [];
        const q = caseSensitive ? query : query.toLowerCase();

        const IGNORED_PATHS = ['node_modules/', '.git/', 'dist/', 'build/'];
        const MAX_SEARCH_FILE_SIZE = 500 * 1024; // 500KB

        let filesProcessed = 0;

        for (const file of allFiles) {
            // Yield to event loop every 20 files to prevent server freeze
            if (++filesProcessed % 20 === 0) {
                await new Promise(resolve => setImmediate(resolve));
            }

            // Skip heavy directories
            if (IGNORED_PATHS.some(ignored => file.path.includes(ignored))) continue;

            const matches: Array<{ line?: number; column?: number; snippet?: string }> = [];
            const normalizedPath = caseSensitive ? file.path : file.path.toLowerCase();

            // 1. Name Search
            if ((searchType === 'name' || searchType === 'both') && normalizedPath.includes(q)) {
                matches.push({ snippet: file.path.replace(vfs.rootDir, '') });
            }

            // 2. Content Search (Memory efficient, no .split())
            if ((searchType === 'content' || searchType === 'both') && file.content.length <= MAX_SEARCH_FILE_SIZE) {
                const searchContent = caseSensitive ? file.content : file.content.toLowerCase();
                let startIndex = 0;
                let matchIndex;
                let currentLine = 1;
                let lastNewLineIndex = -1;

                while ((matchIndex = searchContent.indexOf(q, startIndex)) !== -1) {
                    // Count lines between last search and current match
                    for (let i = startIndex; i < matchIndex; i++) {
                        if (searchContent[i] === '\n') {
                            currentLine++;
                            lastNewLineIndex = i;
                        }
                    }

                    const column = matchIndex - lastNewLineIndex;

                    // Extract snippet safely
                    const lineEndIndex = file.content.indexOf('\n', matchIndex);
                    const actualEnd = lineEndIndex === -1 ? file.content.length : lineEndIndex;
                    const snippet = file.content.slice(lastNewLineIndex + 1, actualEnd).trim().substring(0, 120);

                    matches.push({ line: currentLine, column, snippet });

                    startIndex = matchIndex + q.length;

                    // Cap matches per file to avoid huge payloads
                    if (matches.length > 50) break;
                }
            }

            if (matches.length > 0) {
                results.push({ path: file.path.replace(vfs.rootDir, ''), matches });
            }

            if (results.length >= maxResults) break;
        }

        return { total: results.length, results };
    },
};

export default [
    searchFilesAction,
    listTreeAction,
    getFileAction,
    createFileAction,
    saveFileAction,
    deleteFileAction,
    renameFileAction,
    copyFileAction,
];
