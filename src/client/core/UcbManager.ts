import { ApiService } from './ApiService';

export interface UCBFrame<T = any> {
    channel: 'vfs' | 'terminal' | 'system' | 'ai' | string;
    type: string;
    streamId?: string;
    payload: T;
    timestamp: number;
}

export type UcbEventHandler = (frame: UCBFrame) => void;

export class UcbManager {
    private ws: WebSocket | null = null;
    private listeners: Map<string, Set<UcbEventHandler>> = new Map();
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private connected: boolean = false;
    private api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    public connect(): void {
        if (typeof WebSocket === 'undefined') return;
        if (this.ws) return;

        const token = (this.api as any).token; // fallback
        if (!token) {
            console.warn('📡 UCB: Cannot connect without token');
            return;
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = 3002;
        const wsUrl = `${protocol}//${host}:${port}/gateway`;

        console.log('📡 UCB: Connecting to', wsUrl);

        this.ws = new WebSocket(wsUrl, ['ucb', token]);
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = () => {
            this.connected = true;
            console.log('📡 UCB: Connected');

            // Dispatch to system listeners that we connected
            this.dispatch({ channel: 'system', type: 'connected', payload: { status: 'reconnected' }, timestamp: Date.now() });
        };

        this.ws.onmessage = (event) => {
            try {
                let text = '';
                if (event.data instanceof ArrayBuffer) {
                    text = new TextDecoder().decode(event.data);
                } else {
                    text = event.data;
                }
                const frame: UCBFrame = JSON.parse(text);
                if (frame.channel === 'system' && frame.type === 'heartbeat') return;

                this.dispatch(frame);
            } catch (err) {
                console.warn('📡 UCB: Received malformed frame', event.data);
            }
        };

        this.ws.onerror = (error) => {
            console.warn('📡 UCB: Error:', error);
        };

        this.ws.onclose = () => {
            this.connected = false;
            console.warn('📡 UCB: Connection lost, will reconnect in 3s...');
            this.cleanup();

            this.dispatch({ channel: 'system', type: 'disconnected', payload: {}, timestamp: Date.now() });

            this.reconnectTimer = setTimeout(() => {
                this.connect();
            }, 3000);
        };
    }

    public disconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.cleanup();
        this.connected = false;
        console.log('📡 UCB: Disconnected');
    }

    private cleanup(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    public subscribe(channel: string, handler: UcbEventHandler): void {
        if (!this.listeners.has(channel)) {
            this.listeners.set(channel, new Set());
        }
        this.listeners.get(channel)!.add(handler);
    }

    public unsubscribe(channel: string, handler: UcbEventHandler): void {
        const handlers = this.listeners.get(channel);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.listeners.delete(channel);
            }
        }
    }

    public send(channel: string, type: string, payload: any, streamId?: string): void {
        if (!this.connected || !this.ws) return;

        const frame: UCBFrame = {
            channel,
            type,
            payload,
            streamId,
            timestamp: Date.now()
        };

        this.ws.send(JSON.stringify(frame));
    }

    private dispatch(frame: UCBFrame): void {
        const handlers = this.listeners.get(frame.channel);
        if (handlers) {
            for (const handler of handlers) {
                try {
                    handler(frame);
                } catch (err) {
                    console.error(`📡 UCB: Error in handler for channel "${frame.channel}":`, err);
                }
            }
        }

        // Wildcard
        const wildcard = this.listeners.get('*');
        if (wildcard) {
            for (const handler of wildcard) {
                try {
                    handler(frame);
                } catch (err) { }
            }
        }
    }

    public isConnected() {
        return this.connected;
    }
}
