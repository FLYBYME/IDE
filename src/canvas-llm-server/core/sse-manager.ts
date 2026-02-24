import { ServerResponse, createServer, Server } from 'http';
import { ConsoleLogger } from 'tool-ms';

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

            // 2. Route Check
            if (req.url === '/api/events' || req.url === '/events') {
                this.addClient(res);
            } else {
                res.writeHead(404);
                res.end('Not Found');
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

        // Remove client on connection close
        res.on('close', () => {
            this.clients.delete(res);
        });
    }

    /**
     * Broadcast an event to all connected clients
     */
    public broadcast(event: string, data?: any): void {
        const payload = data ? `data: ${JSON.stringify(data)}\n\n` : '';
        const message = `event: ${event}\n${payload}`;

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
