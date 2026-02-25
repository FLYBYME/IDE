import { ServerResponse, createServer, Server } from 'http';
import { ConsoleLogger } from 'tool-ms';
import { config } from '../config';
import { verifyToken } from '../utils/token.helper';
import { URL } from 'url';

/**
 * SseManager – handles real-time Server-Sent Events (SSE).
 * Maintains a set of active connections and provides broadcasting capabilities.
 */
export class SseManager {
    private static instance: SseManager;
    private clients: Set<ServerResponse> = new Set();
    private server: Server | null = null;
    private logger = new ConsoleLogger();

    private constructor() {
        // Heartbeat timer is started in init()
    }

    public static getInstance(): SseManager {
        if (!SseManager.instance) {
            SseManager.instance = new SseManager();
        }
        return SseManager.instance;
    }

    /**
     * Initialize and start the standalone SSE server
     */
    public async init(port: number): Promise<void> {
        if (this.server) return;

        this.server = createServer((req, res) => {
            // 1. CORS Headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            // 2. Route Check & Authentication
            try {
                // Use a dummy base since req.url is just the path
                const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);

                if (parsedUrl.pathname === '/api/events' || parsedUrl.pathname === '/events') {
                    // Extract token from query parameters
                    const token = parsedUrl.searchParams.get('token');

                    if (!token) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Missing authentication token' }));
                        return;
                    }

                    // Verify the JWT token
                    try {
                        verifyToken(token);
                    } catch (err) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid or expired token' }));
                        return;
                    }

                    this.addClient(res);
                } else {
                    res.writeHead(404);
                    res.end('Not Found');
                }
            } catch (err) {
                this.logger.error('Error handling SSE request:', err);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });

        return new Promise((resolve) => {
            this.server?.listen(port, () => {
                this.logger.info(`📡 SSE Server listening on port ${port}`);

                // Start heartbeats
                setInterval(() => {
                    this.broadcastRaw(': heartbeat\n\n');
                }, 30000);

                resolve();
            });
        });
    }

    /**
     * Add a new SSE client connection
     */
    public addClient(res: ServerResponse): void {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        // Send initial connection success event
        res.write('event: connected\ndata: {"status": "ok"}\n\n');

        this.clients.add(res);
        this.logger.info(`🔌 SSE Client connected. Total clients: ${this.clients.size}`);

        // Remove client on connection close
        res.on('close', () => {
            this.clients.delete(res);
            this.logger.info(`🔌 SSE Client disconnected. Total clients: ${this.clients.size}`);
        });
    }

    /**
     * Broadcast an event to all connected clients
     */
    public broadcast(event: string, data?: any): void {
        const payload = data ? `data: ${JSON.stringify(data)}\n\n` : '';
        const message = `event: ${event}\n${payload}`;

        if (config.debug) {
            this.logger.info(`📡 Broadcasting event: ${event}`, data);
        }

        for (const client of this.clients) {
            try {
                client.write(message);
            } catch (err) {
                this.clients.delete(client);
            }
        }
    }

    /**
     * Send raw message to all clients
     */
    private broadcastRaw(message: string): void {
        if (config.debug) {
            this.logger.info(`📡 Broadcasting raw message: ${message.trim()}`);
        }
        for (const client of this.clients) {
            try {
                client.write(message);
            } catch (err) {
                this.clients.delete(client);
            }
        }
    }

    /**
     * Stop the SSE server
     */
    public async stop(): Promise<void> {
        if (!this.server) return;

        return new Promise((resolve, reject) => {
            this.server?.close((err) => {
                if (err) reject(err);
                else {
                    this.server = null;
                    resolve();
                }
            });
        });
    }
}

export const sseManager = SseManager.getInstance();
