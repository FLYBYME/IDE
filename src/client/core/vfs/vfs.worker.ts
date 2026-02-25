/**
 * VFS Web Worker - Holds the in-memory file system state.
 *
 * Communicates with the main thread via postMessage.
 * The file system is stored as a flat Map<string, string> (path → content).
 * Directory structure is inferred from the paths.
 */

// ---------------------------------------------------------------
// Types for worker messages
// ---------------------------------------------------------------
import { ApiService } from '../ApiService';

let api: ApiService | null = null;
let currentWorkspaceId: string | null = null;
let configBaseUrl: string = 'http://localhost:3001/api';
let workspaceRootName: string | null = null;
let sseSource: EventSource | null = null;
let sseSseUrl: string | null = null;
interface VirtualFile {
    name: string;
    type: 'file';
    content: string;
    language: string;
}

interface VirtualFolder {
    name: string;
    type: 'folder';
    children: (VirtualFile | VirtualFolder)[];
    expanded?: boolean;
}

type VirtualNode = VirtualFile | VirtualFolder;

interface WorkerRequest {
    id: number;
    type: 'INIT' | 'READ_FILE' | 'WRITE_FILE' | 'READ_DIRECTORY' | 'STAT' | 'RENAME' | 'DELETE' | 'SET_CONFIG';
    path?: string;
    newPath?: string;
    content?: string;
    tree?: VirtualFolder;
    config?: { token: string | null; baseUrl: string; workspaceId: string | null; rootName?: string };
    isRemoteSync?: boolean;
}

interface WorkerResponse {
    id: number;
    type: string;
    data?: any;
    error?: string;
}

// ---------------------------------------------------------------
// In-memory file system
// ---------------------------------------------------------------
const files = new Map<string, string>();
const directories = new Set<string>();

/**
 * Recursively flatten a VirtualFolder tree into the flat file map.
 */
function flattenTree(node: VirtualNode, parentPath: string): void {
    const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;

    if (node.type === 'folder') {
        directories.add(fullPath);
        const folder = node as VirtualFolder;
        if (folder.children) {
            for (const child of folder.children) {
                flattenTree(child, fullPath);
            }
        }
    } else {
        const file = node as VirtualFile;
        files.set(fullPath, file.content);
    }
}

/**
 * Strips the workspace root name from the path to get a relative path for the API.
 * e.g. "my-project/src/main.ts" -> "/src/main.ts"
 */
function toRelPath(fullPath: string): string {
    if (!workspaceRootName || !fullPath.startsWith(workspaceRootName)) {
        return fullPath.startsWith('/') ? fullPath : '/' + fullPath;
    }
    const rel = fullPath.substring(workspaceRootName.length);
    return rel.startsWith('/') ? rel : '/' + rel;
}

/**
 * Ensure all parent directories of a path are recorded.
 */
function ensureParentDirectories(filePath: string): void {
    const parts = filePath.split('/');
    for (let i = 1; i < parts.length; i++) {
        directories.add(parts.slice(0, i).join('/'));
    }
}

// ---------------------------------------------------------------
// SSE connection (owned by the worker)
// ---------------------------------------------------------------
function connectSSE(sseUrl: string, workspaceId: string): void {
    const source = new EventSource(sseUrl);
    sseSource = source;

    source.onopen = () => {
        console.log('[VFS Worker] SSE connected');
    };

    source.onerror = () => {
        console.warn('[VFS Worker] SSE error — will retry in 3s');
        source.close();
        sseSource = null;
        setTimeout(() => {
            if (sseSseUrl && currentWorkspaceId) {
                connectSSE(sseSseUrl, currentWorkspaceId);
            }
        }, 3000);
    };

    // file.saved ─ update in-memory content & notify main thread
    source.addEventListener('file.saved', (event: MessageEvent) => {
        try {
            const data: { workspaceId: string; path: string; content: string } = JSON.parse(event.data);
            // Filter to the workspace we care about
            if (data.workspaceId !== workspaceId) return;

            // Build the worker-internal path: workspaceRootName + apiPath
            const localPath = workspaceRootName
                ? `${workspaceRootName}${data.path.startsWith('/') ? data.path : '/' + data.path}`
                : data.path;

            const existing = files.get(localPath);
            // Prevent echo: if content is identical, skip
            if (existing === data.content) return;

            files.set(localPath, data.content);
            ensureParentDirectories(localPath);

            (self as any).postMessage({
                id: -1,
                type: 'FILE_CHANGED',
                data: { type: 'change', path: localPath, content: data.content, remoteSync: true }
            });
        } catch (err) {
            console.error('[VFS Worker] Error handling file.saved SSE:', err);
        }
    });

    // file.deleted ─ remove from memory & notify
    source.addEventListener('file.deleted', (event: MessageEvent) => {
        try {
            const data: { workspaceId: string; path: string } = JSON.parse(event.data);
            if (data.workspaceId !== workspaceId) return;

            const localPath = workspaceRootName
                ? `${workspaceRootName}${data.path.startsWith('/') ? data.path : '/' + data.path}`
                : data.path;

            files.delete(localPath);
            directories.delete(localPath);

            (self as any).postMessage({
                id: -1,
                type: 'FILE_CHANGED',
                data: { type: 'delete', path: localPath, remoteSync: true }
            });
        } catch (err) {
            console.error('[VFS Worker] Error handling file.deleted SSE:', err);
        }
    });

    // file.renamed ─ move key in memory & notify
    source.addEventListener('file.renamed', (event: MessageEvent) => {
        try {
            const data: { workspaceId: string; oldPath: string; newPath: string } = JSON.parse(event.data);
            if (data.workspaceId !== workspaceId) return;

            const prefix = workspaceRootName ? workspaceRootName : '';
            const makeLocal = (p: string) => prefix ? `${prefix}${p.startsWith('/') ? p : '/' + p}` : p;

            const oldLocal = makeLocal(data.oldPath);
            const newLocal = makeLocal(data.newPath);

            if (files.has(oldLocal)) {
                const content = files.get(oldLocal)!;
                files.delete(oldLocal);
                files.set(newLocal, content);
                ensureParentDirectories(newLocal);
            }

            (self as any).postMessage({
                id: -1,
                type: 'FILE_CHANGED',
                data: { type: 'rename', path: newLocal, oldPath: oldLocal, remoteSync: true }
            });
        } catch (err) {
            console.error('[VFS Worker] Error handling file.renamed SSE:', err);
        }
    });
}

// ---------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------
self.onmessage = (e: MessageEvent<WorkerRequest>) => {
    const { id, type, path, newPath, content, tree } = e.data;

    try {
        switch (type) {
            case 'INIT': {
                files.clear();
                directories.clear();
                if (tree) {
                    // Add the root
                    directories.add(tree.name);
                    if (tree.children) {
                        for (const child of tree.children) {
                            flattenTree(child, tree.name);
                        }
                    }
                }
                (self as any).postMessage({ id, type: 'INIT_DONE', data: { fileCount: files.size } } as WorkerResponse);
                break;
            }

            case 'SET_CONFIG': {
                const { config } = e.data;
                if (config) {
                    configBaseUrl = config.baseUrl;
                    currentWorkspaceId = config.workspaceId;
                    workspaceRootName = config.rootName || null;
                    api = new ApiService(configBaseUrl);
                    api.setToken(config.token);

                    // Connect to the SSE server directly from the worker
                    if (sseSource) {
                        sseSource.close();
                        sseSource = null;
                    }
                    if (config.token && config.workspaceId) {
                        const sseBase = configBaseUrl.replace(/:3001\/api$/, ':3002');
                        sseSseUrl = `${sseBase}/events?token=${encodeURIComponent(config.token)}`;
                        connectSSE(sseSseUrl, config.workspaceId);
                    }
                }
                (self as any).postMessage({ id, type: 'SET_CONFIG_DONE' } as WorkerResponse);
                break;
            }

            case 'READ_FILE': {
                const fileContent = files.get(path!);
                if (fileContent === undefined) {
                    (self as any).postMessage({ id, type: 'READ_FILE_DONE', error: `File not found: ${path}` } as WorkerResponse);
                } else {
                    (self as any).postMessage({ id, type: 'READ_FILE_DONE', data: fileContent } as WorkerResponse);
                }
                break;
            }

            case 'WRITE_FILE': {
                console.log(`VFS Worker: Writing file ${path}`);
                files.set(path!, content!);
                ensureParentDirectories(path!);

                // Persist to backend if workspace is active and not a silent remote sync
                if (!e.data.isRemoteSync && api && currentWorkspaceId) {
                    const relPath = toRelPath(path!);
                    api.saveFile(currentWorkspaceId, relPath, content!).catch(err => {
                        console.error(`VFS Worker: Failed to save ${relPath} to API:`, err);
                    });
                }

                (self as any).postMessage({ id, type: 'WRITE_FILE_DONE' } as WorkerResponse);

                // Notify the main thread that a file changed
                (self as any).postMessage({ id: -1, type: 'FILE_CHANGED', data: { type: 'change', path: path!, content: content! } } as WorkerResponse);
                break;
            }

            case 'DELETE': {
                const isDir = directories.has(path!);
                const isFile = files.has(path!);
                if (!isDir && !isFile) {
                    (self as any).postMessage({ id, type: 'DELETE_DONE', error: `Path not found: ${path}` } as WorkerResponse);
                    break;
                }

                if (isFile) {
                    files.delete(path!);
                }

                if (isDir) {
                    directories.delete(path!);
                    const prefix = path! + '/';
                    for (const key of files.keys()) {
                        if (key.startsWith(prefix)) {
                            files.delete(key);
                        }
                    }
                    for (const key of directories.values()) {
                        if (key.startsWith(prefix)) {
                            directories.delete(key);
                        }
                    }
                }

                // Persist to backend if workspace is active and not a silent remote sync
                if (!e.data.isRemoteSync && api && currentWorkspaceId) {
                    const relPath = toRelPath(path!);
                    api.deleteFile(currentWorkspaceId, relPath).catch(err => {
                        console.error(`VFS Worker: Failed to delete ${relPath} from API:`, err);
                    });
                }

                (self as any).postMessage({ id, type: 'DELETE_DONE' } as WorkerResponse);
                (self as any).postMessage({ id: -1, type: 'FILE_CHANGED', data: { type: 'delete', path: path! } } as WorkerResponse);
                break;
            }

            case 'RENAME': {
                const oldPath = path!;
                const isDir = directories.has(oldPath);
                const isFile = files.has(oldPath);

                if (!isDir && !isFile) {
                    (self as any).postMessage({ id, type: 'RENAME_DONE', error: `Path not found: ${oldPath}` } as WorkerResponse);
                    break;
                }

                if (isFile) {
                    const fileContent = files.get(oldPath)!;
                    files.delete(oldPath);
                    files.set(newPath!, fileContent);
                    ensureParentDirectories(newPath!);
                }

                if (isDir) {
                    directories.delete(oldPath);
                    directories.add(newPath!);
                    ensureParentDirectories(newPath!);

                    const prefix = oldPath + '/';
                    const newPrefix = newPath! + '/';

                    const filesToMove: { oldKey: string, newKey: string, text: string }[] = [];
                    for (const [key, text] of files.entries()) {
                        if (key.startsWith(prefix)) {
                            filesToMove.push({ oldKey: key, text, newKey: newPrefix + key.substring(prefix.length) });
                        }
                    }
                    for (const file of filesToMove) {
                        files.delete(file.oldKey);
                        files.set(file.newKey, file.text);
                    }

                    const dirsToMove: { oldKey: string, newKey: string }[] = [];
                    for (const key of directories.values()) {
                        if (key.startsWith(prefix)) {
                            dirsToMove.push({ oldKey: key, newKey: newPrefix + key.substring(prefix.length) });
                        }
                    }
                    for (const dir of dirsToMove) {
                        directories.delete(dir.oldKey);
                        directories.add(dir.newKey);
                    }
                }

                // Persist to backend if workspace is active and not a silent remote sync
                if (!e.data.isRemoteSync && api && currentWorkspaceId) {
                    const relOld = toRelPath(oldPath);
                    const relNew = toRelPath(newPath!);
                    api.renameFile(currentWorkspaceId, relOld, relNew).catch(err => {
                        console.error(`VFS Worker: Failed to rename ${relOld} to ${relNew} on API:`, err);
                    });
                }

                (self as any).postMessage({ id, type: 'RENAME_DONE' } as WorkerResponse);
                (self as any).postMessage({ id: -1, type: 'FILE_CHANGED', data: { type: 'rename', path: newPath!, oldPath } } as WorkerResponse);
                break;
            }

            case 'READ_DIRECTORY': {
                const dirPath = path!;
                const result: string[] = [];

                for (const filePath of files.keys()) {
                    if (filePath.startsWith(dirPath + '/') || dirPath === '') {
                        result.push(filePath);
                    }
                }

                (self as any).postMessage({ id, type: 'READ_DIRECTORY_DONE', data: result } as WorkerResponse);
                break;
            }

            case 'STAT': {
                if (files.has(path!)) {
                    (self as any).postMessage({ id, type: 'STAT_DONE', data: { type: 'file' } } as WorkerResponse);
                } else if (directories.has(path!)) {
                    (self as any).postMessage({ id, type: 'STAT_DONE', data: { type: 'directory' } } as WorkerResponse);
                } else {
                    (self as any).postMessage({ id, type: 'STAT_DONE', error: `Path not found: ${path}` } as WorkerResponse);
                }
                break;
            }

            default:
                (self as any).postMessage({ id, type: 'ERROR', error: `Unknown message type: ${type}` } as WorkerResponse);
        }
    } catch (err) {
        (self as any).postMessage({ id, type: 'ERROR', error: String(err) } as WorkerResponse);
    }
};
