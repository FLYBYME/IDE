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
    type: 'INIT' | 'READ_FILE' | 'WRITE_FILE' | 'READ_DIRECTORY' | 'STAT' | 'RENAME' | 'DELETE';
    path?: string;
    newPath?: string;
    content?: string;
    tree?: VirtualFolder;
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
 * Ensure all parent directories of a path are recorded.
 */
function ensureParentDirectories(filePath: string): void {
    const parts = filePath.split('/');
    for (let i = 1; i < parts.length; i++) {
        directories.add(parts.slice(0, i).join('/'));
    }
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
                files.set(path!, content!);
                ensureParentDirectories(path!);

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
