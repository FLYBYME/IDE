import { Server, createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { ConsoleLogger } from 'tool-ms';
import { config } from '../config';
import { verifyToken } from '../utils/token.helper';
import { URL } from 'url';
import { workspaceContainerManager } from './WorkspaceContainerManager';

export interface UCBFrame<T = any> {
    channel: 'vfs' | 'terminal' | 'system' | 'ai' | string;
    type: string;
    streamId?: string;
    payload: T;
    timestamp: number;
}

export class GatewayManager {
    private static instance: GatewayManager;
    private clients: Set<WebSocket> = new Set();
    private terminalStreams: Map<WebSocket, Map<string, any>> = new Map();
    private server: Server | null = null;
    private wss: WebSocketServer | null = null;
    private logger = new ConsoleLogger();
    private heartbeatTimer: NodeJS.Timeout | null = null;

    private constructor() { }

    public static getInstance(): GatewayManager {
        if (!GatewayManager.instance) {
            GatewayManager.instance = new GatewayManager();
        }
        return GatewayManager.instance;
    }

    public async init(port: number): Promise<void> {
        if (this.server) return;

        this.server = createServer();
        this.wss = new WebSocketServer({ server: this.server });

        this.wss.on('connection', (ws: WebSocket, req) => {
            try {
                const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);

                if (parsedUrl.pathname === '/gateway') {
                    // Authenticate using Sec-WebSocket-Protocol token or query parameters
                    const protocols = req.headers['sec-websocket-protocol']?.split(',').map(p => p.trim()) || [];
                    const ucbProtocol = protocols.find(p => p !== 'ucb' && p.length > 20); // Basic heuristic for JWT
                    let token = ucbProtocol || parsedUrl.searchParams.get('token') || undefined;

                    if (!token) {
                        ws.close(1008, 'Missing authentication token');
                        return;
                    }

                    try {
                        verifyToken(token);
                    } catch (err) {
                        ws.close(1008, 'Invalid or expired token');
                        return;
                    }

                    this.addClient(ws);
                } else {
                    ws.close(1008, 'Not Found');
                }
            } catch (err) {
                this.logger.error('Error handling WebSocket request:', err);
                ws.close(1011, 'Internal Server Error');
            }
        });

        return new Promise((resolve) => {
            this.server?.listen(port, () => {
                this.logger.info(`🌐 UCB Gateway Server listening on port ${port}`);

                this.heartbeatTimer = setInterval(() => {
                    this.broadcastFrame('system', 'heartbeat', {});
                }, 30000);

                resolve();
            });
        });
    }

    public addClient(ws: WebSocket): void {
        this.clients.add(ws);
        this.logger.info(`🔌 UCB Client connected. Total clients: ${this.clients.size}`);

        this.sendFrameToClient(ws, 'system', 'connected', { status: 'ok' });

        ws.on('message', async (message) => {
            try {
                const frame: UCBFrame = JSON.parse(message.toString());
                await this.handleFrame(ws, frame);
            } catch (err) {
                // Not a valid JSON or internal error
            }
        });

        ws.on('close', () => {
            this.cleanupClient(ws);
        });

        ws.on('error', (err) => {
            this.logger.error(`UCB Client error:`, err);
            this.cleanupClient(ws);
            ws.close();
        });
    }

    private cleanupClient(ws: WebSocket) {
        const clientStreams = this.terminalStreams.get(ws);
        if (clientStreams) {
            for (const [id, session] of clientStreams.entries()) {
                if (session.stream) session.stream.end();
            }
            this.terminalStreams.delete(ws);
        }
        this.clients.delete(ws);
        this.logger.info(`🔌 UCB Client disconnected. Total clients: ${this.clients.size}`);
    }

    private async handleFrame(ws: WebSocket, frame: UCBFrame) {
        if (frame.channel === 'terminal') {
            if (!frame.streamId) return;

            const workspaceId = frame.streamId;
            const clientStreams = this.terminalStreams.get(ws) || new Map();
            if (!this.terminalStreams.has(ws)) this.terminalStreams.set(ws, clientStreams);

            if (frame.type === 'start') {
                const workspace = workspaceContainerManager.getWorkspace(workspaceId);
                if (!workspace) {
                    this.sendFrameToClient(ws, 'terminal', 'error', 'Workspace container not found', workspaceId);
                    return;
                }

                try {
                    const containerInfo = await workspace.container.inspect();
                    const containerEnv = containerInfo.Config.Env || [];

                    const exec = await workspace.container.exec({
                        Cmd: ['/bin/sh', '-l'],
                        AttachStdin: true,
                        AttachStdout: true,
                        AttachStderr: true,
                        Tty: true,
                        Env: [...containerEnv, 'TERM=xterm-256color']
                    });

                    const stream = await exec.start({ stdin: true, hijack: true });
                    clientStreams.set(workspaceId, { exec, stream });

                    this.logger.info(`✅ Terminal session started via UCB for workspace: ${workspaceId}`);

                    stream.on('data', (chunk: Buffer) => {
                        if (ws.readyState === WebSocket.OPEN) {
                            this.sendFrameToClient(ws, 'terminal', 'data', chunk.toString('utf-8'), workspaceId);
                        }
                    });

                    stream.on('end', () => {
                        this.logger.info(`🔌 Terminal stream ended for ${workspaceId}`);
                        clientStreams.delete(workspaceId);
                        if (ws.readyState === WebSocket.OPEN) {
                            this.sendFrameToClient(ws, 'terminal', 'end', {}, workspaceId);
                        }
                    });
                } catch (err) {
                    this.logger.error(`Failed to start terminal for ${workspaceId}:`, err);
                }
            } else if (frame.type === 'data') {
                const session = clientStreams.get(workspaceId);
                if (session && session.stream) {
                    session.stream.write(frame.payload);
                }
            } else if (frame.type === 'resize') {
                const session = clientStreams.get(workspaceId);
                if (session && session.exec) {
                    const { cols, rows } = frame.payload;
                    session.exec.resize({ w: cols, h: rows }).catch((err: any) => {
                        this.logger.error('Failed to resize terminal:', err);
                    });
                }
            } else if (frame.type === 'stop') {
                const session = clientStreams.get(workspaceId);
                if (session && session.stream) {
                    session.stream.end();
                }
                clientStreams.delete(workspaceId);
            }
        }
    }

    public sendFrameToClient(ws: WebSocket, channel: string, type: string, payload: any, streamId?: string): void {
        const frame: UCBFrame = {
            channel,
            type,
            payload,
            streamId,
            timestamp: Date.now()
        };
        try {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(frame));
            }
        } catch (err) {
            this.clients.delete(ws);
        }
    }

    public broadcast(channel: string, type: string, payload?: any, streamId?: string): void {
        const frame: UCBFrame = {
            channel,
            type,
            payload,
            streamId,
            timestamp: Date.now()
        };
        const message = JSON.stringify(frame);

        for (const client of this.clients) {
            try {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            } catch (err) {
                this.clients.delete(client);
            }
        }
    }

    public broadcastFrame(channel: string, type: string, payload: any, streamId?: string): void {
        this.broadcast(channel, type, payload, streamId);
    }

    public async stop(): Promise<void> {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }

        for (const client of this.clients) {
            this.cleanupClient(client);
            try {
                client.close();
            } catch (err) { }
        }
        this.clients.clear();

        return new Promise((resolve, reject) => {
            if (this.wss) {
                this.wss.close(() => {
                    this.server?.close((err) => {
                        if (err) reject(err);
                        else {
                            this.server = null;
                            this.wss = null;
                            resolve();
                        }
                    });
                });
            } else {
                resolve();
            }
        });
    }
}

export const gatewayManager = GatewayManager.getInstance();
