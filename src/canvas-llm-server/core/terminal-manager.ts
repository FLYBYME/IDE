import { WebSocketServer, WebSocket } from 'ws';
import { createServer, Server } from 'http';
import Docker from 'dockerode';
import { ConsoleLogger } from 'tool-ms';
import { config } from '../config';
import { verifyToken } from '../utils/token.helper';

/**
 * TerminalManager – Handles bidirectional interactive terminal sessions via WebSockets.
 * Connects directly to the Docker exec instance for each workspace.
 */
export class TerminalManager {
    private static instance: TerminalManager;
    private wss: WebSocketServer | null = null;
    private server: Server | null = null;
    private docker = new Docker();
    private logger = new ConsoleLogger();

    private constructor() { }

    public static getInstance(): TerminalManager {
        if (!TerminalManager.instance) {
            TerminalManager.instance = new TerminalManager();
        }
        return TerminalManager.instance;
    }

    /**
     * Initialize and start the standalone Terminal WebSocket server
     */
    public async init(port: number): Promise<void> {
        if (this.wss) return;

        this.server = createServer();
        this.wss = new WebSocketServer({ server: this.server });

        this.wss.on('connection', async (ws: WebSocket, req) => {
            const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
            const workspaceId = url.searchParams.get('workspaceId');
            const token = url.searchParams.get('token');

            if (!workspaceId || !token) {
                ws.close(1008, 'Missing workspaceId or token');
                return;
            }

            try {
                verifyToken(token);
            } catch (err) {
                ws.close(1008, 'Invalid authentication token');
                return;
            }

            this.logger.info(`🖥️ Terminal connection attempt for workspace: ${workspaceId}`);

            try {
                // Find the container by label
                const containers = await this.docker.listContainers({
                    filters: { label: [`canvas-workspace-id=${workspaceId}`] }
                });

                if (containers.length === 0) {
                    ws.close(1011, 'Workspace container not found');
                    return;
                }

                const containerInfo = containers[0];
                const container = this.docker.getContainer(containerInfo.Id);

                // Create exec instance
                const exec = await container.exec({
                    Cmd: ['/bin/sh', '-l'],
                    AttachStdin: true,
                    AttachStdout: true,
                    AttachStderr: true,
                    Tty: true,
                    Env: ['TERM=xterm-256color']
                });

                const stream = await exec.start({
                    stdin: true,
                    hijack: true
                });

                this.logger.info(`✅ Terminal session started for workspace: ${workspaceId}`);

                // Bind streams
                stream.on('data', (chunk) => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(chunk);
                    }
                });

                ws.on('message', (message) => {
                    try {
                        const data = message.toString();
                        if (data.startsWith('{"resize":')) {
                            const { cols, rows } = JSON.parse(data).resize;
                            exec.resize({ w: cols, h: rows }).catch(err => {
                                this.logger.error('Failed to resize terminal:', err);
                            });
                        } else {
                            stream.write(message);
                        }
                    } catch (err) {
                        stream.write(message);
                    }
                });

                stream.on('end', () => {
                    this.logger.info(`🔌 Terminal stream ended for ${workspaceId}`);
                    ws.close();
                });

                ws.on('close', () => {
                    this.logger.info(`🔌 Terminal WebSocket closed for ${workspaceId}`);
                    stream.end();
                });

                ws.on('error', (err) => {
                    this.logger.error(`Terminal WebSocket error for ${workspaceId}:`, err);
                    stream.end();
                });

            } catch (err) {
                this.logger.error(`Failed to start terminal for ${workspaceId}:`, err);
                ws.close(1011, 'Internal Server Error starting terminal');
            }
        });

        return new Promise((resolve) => {
            this.server?.listen(port, () => {
                this.logger.info(`⌨️  Terminal Server listening on port ${port}`);
                resolve();
            });
        });
    }

    public async stop(): Promise<void> {
        return new Promise((resolve) => {
            if (this.wss) {
                this.wss.close(() => {
                    this.server?.close(() => {
                        this.wss = null;
                        this.server = null;
                        resolve();
                    });
                });
            } else {
                resolve();
            }
        });
    }
}

export const terminalManager = TerminalManager.getInstance();
