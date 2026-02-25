import Docker from 'dockerode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FSWatcher, watch } from 'chokidar';
import { VirtualFileSystem } from 'vfs';
import { sseManager } from './sse-manager';
import { config } from '../config';
import { ConsoleLogger } from 'tool-ms';

export interface WorkspaceContainer {
    container: Docker.Container;
    watcher: FSWatcher;
    bridgeDir: string;
}


export class WorkspaceContainerManager {
    private docker = new Docker();
    private activeContainers: Map<string, WorkspaceContainer> = new Map();
    private logger = new ConsoleLogger();

    /**
     * Starts a dedicated container for a workspace with bidirectional file sync.
     */
    public async startWorkspace(workspaceId: string, vfs: VirtualFileSystem): Promise<void> {
        if (this.activeContainers.has(workspaceId)) {
            this.logger.warn(`Workspace container already running for ${workspaceId}`);
            return;
        }

        const bridgeDir = path.resolve('/tmp/canvas-workspaces', workspaceId);

        try {
            // 1. Prepare bridge directory
            await fs.mkdir(bridgeDir, { recursive: true });

            // 2. Initial Sync: VFS -> Host
            const files = vfs.getAllFiles();
            for (const file of files) {
                const hostPath = path.join(bridgeDir, file.path);
                await fs.mkdir(path.dirname(hostPath), { recursive: true });
                await fs.writeFile(hostPath, file.content);
            }

            // 3. Start persistent Docker container
            const container = await this.docker.createContainer({
                Image: 'node:25-alpine',
                Cmd: ['tail', '-f', '/dev/null'],
                HostConfig: {
                    Binds: [`${bridgeDir}:/workspace:rw`],
                },
                WorkingDir: '/workspace',
                Labels: { 'canvas-workspace-id': workspaceId }
            });

            await container.start();
            this.logger.info(`🚀 Started container ${container.id} for workspace ${workspaceId}`);

            // 4. Initialize Host Watcher (Container -> VFS)
            const watcher = watch(bridgeDir, {
                ignoreInitial: true,
                persistent: true,
            });

            watcher.on('all', async (event: string, filePath: string) => {

                const relativePath = path.relative(bridgeDir, filePath);
                if (relativePath.startsWith('.git') || relativePath.includes('node_modules')) return;

                try {
                    if (event === 'add' || event === 'change') {
                        const content = await fs.readFile(filePath, 'utf-8');
                        vfs.write(relativePath, content);
                        this.logger.debug(`Synced to VFS: ${relativePath} (${event})`);
                    } else if (event === 'unlink' || event === 'unlinkDir') {
                        vfs.delete(relativePath);
                        this.logger.debug(`Deleted from VFS: ${relativePath}`);
                    }
                } catch (err) {
                    this.logger.error(`Failed to sync host change to VFS: ${relativePath}`, err);
                }
            });

            this.activeContainers.set(workspaceId, { container, watcher, bridgeDir });

        } catch (err) {
            this.logger.error(`Failed to start workspace container for ${workspaceId}`, err);
            throw err;
        }
    }

    /**
     * Executes a command inside the workspace container and streams output via SSE.
     */
    public async executeCommand(workspaceId: string, command: string[], executionId: string): Promise<void> {
        const ws = this.activeContainers.get(workspaceId);
        if (!ws) {
            throw new Error(`No active container for workspace ${workspaceId}`);
        }

        const exec = await ws.container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true,
            Tty: false
        });

        const stream = await exec.start({});

        sseManager.broadcast('workspace.exec.start', {
            workspaceId,
            executionId,
            command
        });

        // Use dockerode's internal modem to demux the stream correctly
        ws.container.modem.demuxStream(stream, {
            write: (chunk: Buffer) => {
                sseManager.broadcast('workspace.exec.output', {
                    workspaceId,
                    executionId,
                    stream: 'stdout',
                    data: chunk.toString()
                });
            }
        } as any, {
            write: (chunk: Buffer) => {
                sseManager.broadcast('workspace.exec.output', {
                    workspaceId,
                    executionId,
                    stream: 'stderr',
                    data: chunk.toString()
                });
            }
        } as any);

        stream.on('end', async () => {
            try {
                const result = await exec.inspect();
                const exitCode = result.ExitCode ?? 0;
                sseManager.broadcast('workspace.exec.exit', {
                    workspaceId,
                    executionId,
                    exitCode
                });
            } catch (err) {
                this.logger.error(`Failed to inspect exec ${executionId}:`, err);
                sseManager.broadcast('workspace.exec.exit', {
                    workspaceId,
                    executionId,
                    exitCode: 1
                });
            }
        });
    }
    /**
     * Executes a command inside the workspace container and waits for completion.
     * Returns the exit code.
     */
    public async executeCommandAndWait(workspaceId: string, command: string[], executionId: string): Promise<number> {
        const ws = this.activeContainers.get(workspaceId);
        if (!ws) {
            throw new Error(`No active container for workspace ${workspaceId}`);
        }

        const exec = await ws.container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true,
            Tty: false
        });

        const stream = await exec.start({});

        ws.container.modem.demuxStream(stream, {
            write: (chunk: Buffer) => {
                sseManager.broadcast('workspace.exec.output', {
                    workspaceId,
                    executionId,
                    stream: 'stdout',
                    data: chunk.toString()
                });
            }
        } as any, {
            write: (chunk: Buffer) => {
                sseManager.broadcast('workspace.exec.output', {
                    workspaceId,
                    executionId,
                    stream: 'stderr',
                    data: chunk.toString()
                });
            }
        } as any);

        return new Promise((resolve, reject) => {
            stream.on('end', async () => {
                try {
                    const result = await exec.inspect();
                    const exitCode = result.ExitCode ?? 0;
                    sseManager.broadcast('workspace.exec.exit', {
                        workspaceId,
                        executionId,
                        exitCode
                    });
                    resolve(exitCode);
                } catch (err) {
                    reject(err);
                }
            });
            stream.on('error', (err) => reject(err));
        });
    }

    /**
     * Stops the container and cleans up resources.
     */
    public async stopWorkspace(workspaceId: string): Promise<void> {
        const ws = this.activeContainers.get(workspaceId);
        if (!ws) return;

        try {
            await ws.watcher.close();
            await ws.container.stop();
            await ws.container.remove();
            await fs.rm(ws.bridgeDir, { recursive: true, force: true });

            this.activeContainers.delete(workspaceId);
            this.logger.info(`🛑 Stopped workspace container for ${workspaceId}`);
        } catch (err) {
            this.logger.error(`Error stopping workspace container for ${workspaceId}`, err);
        }
    }

    /**
     * Helper to update host file from VFS write (VFS -> Host)
     */
    public async syncFileToHost(workspaceId: string, filePath: string, content: string): Promise<void> {
        const ws = this.activeContainers.get(workspaceId);
        if (!ws) return;

        const hostPath = path.join(ws.bridgeDir, filePath);
        await fs.mkdir(path.dirname(hostPath), { recursive: true });
        await fs.writeFile(hostPath, content);
    }
}

export const workspaceContainerManager = new WorkspaceContainerManager();
