import { VirtualFileSystem } from 'vfs';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config';
import { workspaceContainerManager } from './WorkspaceContainerManager';


export interface WorkspaceVFS {
    vfs: VirtualFileSystem;
    workspaceId: string;
    lastAccessed: number;
}

/**
 * VFSManager maintains a cache of active VirtualFileSystem instances,
 * keyed by workspaceId. It handles lazy-loading from snapshot files
 * and periodic eviction of idle workspaces.
 */
export class VFSManager {
    private instances: Map<string, WorkspaceVFS> = new Map();
    private evictionIntervalMs = 5 * 60 * 1000; // 5 minutes
    private maxIdleMs = 15 * 60 * 1000; // 15 minutes idle = evict
    private evictionTimer: ReturnType<typeof setInterval> | null = null;

    constructor() {
        // Ensure snapshot directory exists
        const dir = path.resolve(config.snapshotDir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    /**
     * Start the eviction timer.
     */
    start(): void {
        this.evictionTimer = setInterval(() => this.evictIdle(), this.evictionIntervalMs);
    }

    /**
     * Stop eviction and persist all active workspaces.
     */
    async stop(): Promise<void> {
        if (this.evictionTimer) clearInterval(this.evictionTimer);
        for (const entry of this.instances.values()) {
            await this.persistSnapshot(entry.workspaceId, entry.vfs);
        }
        this.instances.clear();
    }

    /**
     * Get or load a VFS instance for a workspace.
     */
    async getVFS(workspaceId: string): Promise<VirtualFileSystem> {
        let entry = this.instances.get(workspaceId);
        if (entry) {
            entry.lastAccessed = Date.now();
            return entry.vfs;
        }

        // Load from snapshot if available, otherwise create fresh
        const vfs = new VirtualFileSystem(`/workspace/${workspaceId}`);
        const snapshotPath = this.getSnapshotPath(workspaceId);
        if (fs.existsSync(snapshotPath)) {
            await vfs.loadFromDisk(snapshotPath);
        }

        this.instances.set(workspaceId, {
            vfs,
            workspaceId,
            lastAccessed: Date.now(),
        });

        // Ensure container is started when VFS is active
        await workspaceContainerManager.startWorkspace(workspaceId, vfs);

        return vfs;
    }

    /**
     * Persist a workspace VFS snapshot to disk.
     */
    async persistSnapshot(workspaceId: string, vfs?: VirtualFileSystem): Promise<void> {
        const instance = vfs ?? this.instances.get(workspaceId)?.vfs;
        if (!instance) return;
        await instance.saveToDisk(this.getSnapshotPath(workspaceId));
    }

    /**
     * Remove a workspace VFS instance and delete its snapshot.
     */
    async removeWorkspace(workspaceId: string): Promise<void> {
        const entry = this.instances.get(workspaceId);
        if (entry) {
            this.instances.delete(workspaceId);
        }
        const snapshotPath = this.getSnapshotPath(workspaceId);
        if (fs.existsSync(snapshotPath)) {
            fs.unlinkSync(snapshotPath);
        }
    }

    /**
     * Evict idle VFS instances, saving their snapshots first.
     */
    private async evictIdle(): Promise<void> {
        const now = Date.now();
        for (const [id, entry] of this.instances) {
            if (now - entry.lastAccessed > this.maxIdleMs) {
                await this.persistSnapshot(id, entry.vfs);
                await workspaceContainerManager.stopWorkspace(id);
                this.instances.delete(id);
            }
        }
    }

    private getSnapshotPath(workspaceId: string): string {
        return path.resolve(config.snapshotDir, `${workspaceId}.json`);
    }
}

// Singleton instance
export const vfsManager = new VFSManager();
