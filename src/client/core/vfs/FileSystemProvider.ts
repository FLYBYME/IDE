/**
 * FileSystemProvider - The contract interface for all VFS backends.
 * UI and Monaco should only talk to this interface, making it easy
 * to swap between Web Worker, IndexedDB, WebSocket, etc.
 */

export interface FileChangeEvent {
    type: 'change' | 'delete' | 'rename';
    path: string;
    content?: string;     // For 'change'
    oldPath?: string;     // For 'rename'
    remoteSync?: boolean; // True when the change originated from a server SSE event
}

export interface FileStat {
    type: 'file' | 'directory';
}

export interface FileSystemProvider {
    /**
     * Read the contents of a file.
     */
    readFile(path: string): Promise<string>;

    /**
     * Write content to a file (create or overwrite).
     */
    writeFile(path: string, content: string): Promise<void>;

    /**
     * Delete a file or directory.
     */
    delete(path: string): Promise<void>;

    /**
     * Rename a file or directory.
     */
    rename(oldPath: string, newPath: string): Promise<void>;

    /**
     * Recursively list all file paths under a directory.
     */
    readDirectory(path: string): Promise<string[]>;

    /**
     * Check if a path is a file or directory.
     */
    stat(path: string): Promise<FileStat>;

    /**
     * Register a callback for file change events.
     */
    onDidChangeFile(callback: (event: FileChangeEvent) => void): void;
}
