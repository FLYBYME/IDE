import Docker from 'dockerode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FSWatcher, watch } from 'chokidar';
import { VirtualFileSystem } from 'vfs';
import { gatewayManager } from './gateway-manager';
import { config } from '../config';
import { ConsoleLogger } from 'tool-ms';

export interface WorkspaceContainer {
    container: Docker.Container;
    watcher: FSWatcher;
    bridgeDir: string;
    activeExecs: Map<string, { executionId: string, command: string[], startTime: number }>;
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
                Image: config.workspaceImage,
                Cmd: ['tail', '-f', '/dev/null'],
                HostConfig: {
                    Binds: [`${bridgeDir}:/workspace:rw`],
                },
                WorkingDir: '/workspace',
                Labels: { 'canvas-workspace-id': workspaceId }
            });

            await container.start();
            this.logger.info(`🚀 Started container ${container.id} for workspace ${workspaceId} using image ${config.workspaceImage}`);

            // 4. Initialize Host Watcher (Container -> VFS)
            const watcher = watch(bridgeDir, {
                ignoreInitial: true,
                persistent: true,
                ignored: [/(^|[\/\\])\../, '**/node_modules/**'], // Ignore dotfiles/directories (like .git) and node_modules
            });

            watcher.on('all', async (event: string, filePath: string) => {

                const relativePath = path.relative(bridgeDir, filePath);
                if (relativePath.startsWith('.git') || relativePath.includes('node_modules')) return;

                try {
                    if (event === 'add' || event === 'change') {
                        const content = await fs.readFile(filePath, 'utf-8');
                        // Ensure it's prefixed with a slash for frontend
                        const vfsPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;

                        vfs.write(relativePath, content);

                        // Emit to frontend via UCB
                        gatewayManager.broadcast('vfs', 'file.saved', {
                            workspaceId,
                            path: vfsPath,
                            content
                        });

                        this.logger.debug(`Synced to VFS & Frontend: ${relativePath} (${event})`);
                    } else if (event === 'unlink' || event === 'unlinkDir') {
                        // Ensure it's prefixed with a slash for frontend
                        const vfsPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;

                        vfs.delete(relativePath);

                        // Emit to frontend via UCB
                        gatewayManager.broadcast('vfs', 'file.deleted', {
                            workspaceId,
                            path: vfsPath
                        });

                        this.logger.debug(`Deleted from VFS & Frontend: ${relativePath}`);
                    }
                } catch (err) {
                    this.logger.error(`Failed to sync host change to VFS/Frontend: ${relativePath}`, err);
                }
            });


            this.activeContainers.set(workspaceId, {
                container,
                watcher,
                bridgeDir,
                activeExecs: new Map()
            });

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

        gatewayManager.broadcast('terminal', 'workspace.exec.start', {
            workspaceId,
            executionId,
            command
        }, workspaceId);

        // Track process
        ws.activeExecs.set(executionId, {
            executionId,
            command,
            startTime: Date.now()
        });

        // Use dockerode's internal modem to demux the stream correctly
        ws.container.modem.demuxStream(stream, {
            write: (chunk: Buffer) => {
                gatewayManager.broadcast('terminal', 'workspace.exec.output', {
                    workspaceId,
                    executionId,
                    stream: 'stdout',
                    data: chunk.toString()
                }, workspaceId);
            }
        } as any, {
            write: (chunk: Buffer) => {
                gatewayManager.broadcast('terminal', 'workspace.exec.output', {
                    workspaceId,
                    executionId,
                    stream: 'stderr',
                    data: chunk.toString()
                }, workspaceId);
            }
        } as any);

        stream.on('end', async () => {
            try {
                const result = await exec.inspect();
                const exitCode = result.ExitCode ?? 0;
                gatewayManager.broadcast('terminal', 'workspace.exec.exit', {
                    workspaceId,
                    executionId,
                    exitCode
                }, workspaceId);
            } catch (err) {
                this.logger.error(`Failed to inspect exec ${executionId}:`, err);
                gatewayManager.broadcast('terminal', 'workspace.exec.exit', {
                    workspaceId,
                    executionId,
                    exitCode: 1
                }, workspaceId);
            } finally {
                ws.activeExecs.delete(executionId);
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

        // Track process
        ws.activeExecs.set(executionId, {
            executionId,
            command,
            startTime: Date.now()
        });

        ws.container.modem.demuxStream(stream, {
            write: (chunk: Buffer) => {
                gatewayManager.broadcast('terminal', 'workspace.exec.output', {
                    workspaceId,
                    executionId,
                    stream: 'stdout',
                    data: chunk.toString()
                }, workspaceId);
            }
        } as any, {
            write: (chunk: Buffer) => {
                gatewayManager.broadcast('terminal', 'workspace.exec.output', {
                    workspaceId,
                    executionId,
                    stream: 'stderr',
                    data: chunk.toString()
                }, workspaceId);
            }
        } as any);

        return new Promise((resolve, reject) => {
            stream.on('end', async () => {
                try {
                    const result = await exec.inspect();
                    const exitCode = result.ExitCode ?? 0;
                    gatewayManager.broadcast('terminal', 'workspace.exec.exit', {
                        workspaceId,
                        executionId,
                        exitCode
                    }, workspaceId);
                    resolve(exitCode);
                } catch (err) {
                    reject(err);
                } finally {
                    ws.activeExecs.delete(executionId);
                }
            });
            stream.on('error', (err) => {
                ws.activeExecs.delete(executionId);
                reject(err);
            });
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

            // Clear directory contents as root in container before stopping to prevent host EACCES
            try {
                const exec = await ws.container.exec({ Cmd: ['sh', '-c', 'rm -rf /workspace/* /workspace/.* 2>/dev/null || true'] });
                const stream = await exec.start({});
                await new Promise((resolve) => stream.on('end', resolve));
            } catch (cleanupErr) {
                // Ignore cleanup errors
            }

            await ws.container.stop();
            await ws.container.remove();
            await fs.rm(ws.bridgeDir, { recursive: true, force: true }).catch(() => { });

            this.activeContainers.delete(workspaceId);
            this.logger.info(`🛑 Stopped workspace container for ${workspaceId}`);
        } catch (err) {
            this.logger.error(`Error stopping workspace container for ${workspaceId}`, err);
        }
    }

    /**
     * Retrieves the active workspace container if it exists.
     */
    public getWorkspace(workspaceId: string): WorkspaceContainer | undefined {
        return this.activeContainers.get(workspaceId);
    }

    /**
     * Retrieves the currently active processes for a given workspace.
     */
    public getActiveProcesses(workspaceId: string): any[] {
        const ws = this.activeContainers.get(workspaceId);
        if (!ws) return [];

        return Array.from(ws.activeExecs.values());
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
