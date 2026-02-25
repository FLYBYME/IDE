/**
 * WorkerFileSystemProvider - Implements FileSystemProvider using a Web Worker.
 *
 * All file system state lives in the worker to keep the main thread unblocked.
 * Each method sends a message to the worker and returns a Promise that resolves
 * when the worker replies (using a request-id correlation pattern).
 */

import { FileSystemProvider, FileChangeEvent, FileStat } from './FileSystemProvider';

// Re-export types used by external consumers (e.g., the INIT tree payload)
export interface VirtualFile {
    name: string;
    type: 'file';
    content: string;
    language: string;
}

export interface VirtualFolder {
    name: string;
    type: 'folder';
    children: (VirtualFile | VirtualFolder)[];
    expanded?: boolean;
}

export type VirtualNode = VirtualFile | VirtualFolder;

interface WorkerRequest {
    id: number;
    type: string;
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

export class WorkerFileSystemProvider implements FileSystemProvider {
    private worker: Worker;
    private nextRequestId = 1;
    private pendingRequests = new Map<number, { resolve: (data: any) => void; reject: (err: Error) => void }>();
    private changeListeners: ((event: FileChangeEvent) => void)[] = [];

    constructor() {
        // Webpack 5 native worker syntax
        this.worker = new Worker(new URL('./vfs.worker.ts', import.meta.url));

        this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const { id, type, data, error } = e.data;

            // Handle broadcast events (no specific request)
            if (type === 'FILE_CHANGED') {
                for (const listener of this.changeListeners) {
                    listener(data as FileChangeEvent);
                }
                return;
            }

            // Resolve the pending promise for this request
            const pending = this.pendingRequests.get(id);
            if (pending) {
                this.pendingRequests.delete(id);
                if (error) {
                    pending.reject(new Error(error));
                } else {
                    pending.resolve(data);
                }
            }
        };

        this.worker.onerror = (err) => {
            console.error('VFS Worker error:', err);
        };
    }

    /**
     * Send a message to the worker and return a Promise for the response.
     */
    private sendRequest<T = any>(type: string, payload: Partial<WorkerRequest> = {}): Promise<T> {
        const id = this.nextRequestId++;
        return new Promise<T>((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });
            this.worker.postMessage({ id, type, ...payload });
        });
    }

    /**
     * Initialize the VFS with a tree of virtual files/folders.
     */
    public async initialize(tree: VirtualFolder): Promise<void> {
        await this.sendRequest('INIT', { tree });
        console.log('📁 VFS Worker initialized');
    }

    /**
     * Configure the worker with API credentials and workspace ID.
     */
    public async configure(config: { token: string | null; baseUrl: string; workspaceId: string | null; rootName?: string }): Promise<void> {
        await this.sendRequest('SET_CONFIG', { config });
        console.log('📁 VFS Worker configured');
    }

    // ------ FileSystemProvider interface ------

    public async readFile(path: string): Promise<string> {
        return this.sendRequest<string>('READ_FILE', { path });
    }

    public async writeFile(path: string, content: string): Promise<void> {
        await this.sendRequest('WRITE_FILE', { path, content });
    }

    public async delete(path: string): Promise<void> {
        await this.sendRequest('DELETE', { path });
    }

    /**
     * Updates the local VFS state from a server event WITHOUT triggering a recursive backend save.
     */
    public async syncFromServer(action: 'WRITE' | 'DELETE' | 'RENAME', path: string, payload?: any): Promise<void> {
        if (action === 'WRITE') {
            await this.sendRequest('WRITE_FILE', { path, content: payload, isRemoteSync: true });
        } else if (action === 'DELETE') {
            await this.sendRequest('DELETE', { path, isRemoteSync: true });
        } else if (action === 'RENAME') {
            await this.sendRequest('RENAME', { path, newPath: payload, isRemoteSync: true });
        }
    }

    public async rename(oldPath: string, newPath: string): Promise<void> {
        await this.sendRequest('RENAME', { path: oldPath, newPath });
    }

    public async readDirectory(path: string): Promise<string[]> {
        return this.sendRequest<string[]>('READ_DIRECTORY', { path });
    }

    public async stat(path: string): Promise<FileStat> {
        return this.sendRequest<FileStat>('STAT', { path });
    }

    public onDidChangeFile(callback: (event: FileChangeEvent) => void): void {
        this.changeListeners.push(callback);
    }

    /**
     * Terminate the worker.
     */
    public dispose(): void {
        this.worker.terminate();
        this.pendingRequests.clear();
        this.changeListeners = [];
    }
}

