/**
 * ApiService – thin wrapper around `fetch` for communicating with the
 * CanvasLLM backend server (tool-ms REST endpoints).
 *
 * Usage:
 *   const api = new ApiService();          // uses default base URL
 *   const ws  = await api.listWorkspaces();
 */

export type SseEventHandler = (data: any) => void;

export class ApiService {
    private baseUrl: string;
    private token: string | null = null;

    // ── SSE Client ────────────────────────────────────────────────
    private eventSource: EventSource | null = null;
    private sseListeners: Map<string, Set<SseEventHandler>> = new Map();
    private sseReconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private sseConnected: boolean = false;

    constructor(baseUrl: string = 'http://localhost:3001/api') {
        this.baseUrl = baseUrl;

        // Hydrate token from localStorage if available (only in main thread)
        if (typeof localStorage !== 'undefined') {
            this.token = localStorage.getItem('ide-auth-token');
        }
    }

    public setToken(token: string | null): void {
        this.token = token;
    }

    public setBaseUrl(baseUrl: string): void {
        this.baseUrl = baseUrl;
    }

    // ── SSE Connection ────────────────────────────────────────────

    /**
     * Connect to the server's SSE endpoint for real-time events.
     * Automatically reconnects on disconnection.
     */
    public connectSSE(): void {
        // Guard: only connect in browser main thread
        if (typeof EventSource === 'undefined') return;
        if (this.eventSource) return; // already connected

        // Standalone SSE server runs on port 3002
        let sseUrl = this.baseUrl.replace(/:3001\/api$/, ':3002') + '/events';
        if (this.token) {
            sseUrl += `?token=${encodeURIComponent(this.token)}`;
        }
        console.log('📡 SSE: Connecting to', sseUrl);

        this.eventSource = new EventSource(sseUrl);

        // ── Handle connection open
        this.eventSource.onopen = () => {
            this.sseConnected = true;
            console.log('📡 SSE: Connected');
        };

        // ── Handle generic messages (fallback)
        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📡 SSE: Received message', data);
                this.dispatchSseEvent('message', data);
            } catch {
                // Ignore non-JSON messages (heartbeats, etc.)
                console.log('📡 SSE: Received non-JSON message', event.data);
            }
        };

        // ── Listen for specific named events
        const eventTypes = [
            'connected',
            'file.created',
            'file.saved',
            'file.deleted',
            'file.renamed',
            'workspace.exec.start',
            'workspace.exec.output',
            'workspace.exec.exit',
        ];

        for (const eventType of eventTypes) {
            this.eventSource.addEventListener(eventType, ((event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    this.dispatchSseEvent(eventType, data);
                } catch {
                    this.dispatchSseEvent(eventType, event.data);
                }
            }) as EventListener);
        }

        // ── Handle errors / reconnect
        this.eventSource.onerror = () => {
            this.sseConnected = false;
            console.warn('📡 SSE: Connection lost, will reconnect in 3s...');
            this.cleanupEventSource();
            this.sseReconnectTimer = setTimeout(() => {
                this.connectSSE();
            }, 3000);
        };
    }

    /**
     * Disconnect from the SSE endpoint.
     */
    public disconnectSSE(): void {
        if (this.sseReconnectTimer) {
            clearTimeout(this.sseReconnectTimer);
            this.sseReconnectTimer = null;
        }
        this.cleanupEventSource();
        this.sseConnected = false;
        console.log('📡 SSE: Disconnected');
    }

    /**
     * Subscribe to a specific SSE event type.
     * Common events: 'file.created', 'file.saved', 'file.deleted', 'file.renamed'
     */
    public on(event: string, handler: SseEventHandler): void {
        if (!this.sseListeners.has(event)) {
            this.sseListeners.set(event, new Set());
        }
        this.sseListeners.get(event)!.add(handler);
    }

    /**
     * Unsubscribe from a specific SSE event type.
     */
    public off(event: string, handler: SseEventHandler): void {
        const handlers = this.sseListeners.get(event);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.sseListeners.delete(event);
            }
        }
    }

    /**
     * Subscribe to a specific SSE event type, but only fire once.
     */
    public once(event: string, handler: SseEventHandler): void {
        const wrapper: SseEventHandler = (data) => {
            this.off(event, wrapper);
            handler(data);
        };
        this.on(event, wrapper);
    }

    /**
     * Whether the SSE connection is currently active.
     */
    public isSseConnected(): boolean {
        return this.sseConnected;
    }

    private dispatchSseEvent(event: string, data: any): void {
        const handlers = this.sseListeners.get(event);
        console.log(`📡 SSE: Dispatched event "${event}"`);
        if (handlers) {
            for (const handler of handlers) {
                try {
                    handler(data);
                } catch (err) {
                    console.error(`📡 SSE: Error in handler for "${event}":`, err);
                }
            }
        }


        // Also dispatch to wildcard listeners
        const wildcard = this.sseListeners.get('*');
        if (wildcard) {
            for (const handler of wildcard) {
                try {
                    handler({ event, data });
                } catch (err) {
                    console.error('📡 SSE: Error in wildcard handler:', err);
                }
            }
        }
    }

    private cleanupEventSource(): void {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    // ── Internals ──────────────────────────────────────────────────

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API request failed (${response.status})`);
        }

        return data as T;
    }

    // ── Auth Endpoints ─────────────────────────────────────────────

    public async login(username: string, password: string): Promise<any> {
        const data = await this.request<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password, rememberMe: true }),
        });

        if (data.token) {
            this.token = data.token;
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('ide-auth-token', data.token);
            }
        }
        return data;
    }

    public async logout(): Promise<void> {
        await this.request('/auth/logout', { method: 'POST' });
        this.token = null;
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('ide-auth-token');
        }
    }

    public isAuthenticated(): boolean {
        return this.token !== null;
    }

    public async getSession(): Promise<any> {
        return this.request<any>('/auth/session');
    }

    // ── Workspace Endpoints ────────────────────────────────────────

    public async listWorkspaces(): Promise<any> {
        return this.request<any>('/workspaces');
    }

    public async createWorkspace(name: string, description?: string): Promise<any> {
        return this.request<any>('/workspaces', {
            method: 'POST',
            body: JSON.stringify({ name, description }),
        });
    }

    public async getWorkspace(id: string): Promise<any> {
        return this.request<any>(`/workspaces/${id}`);
    }

    public async executeWorkspaceCommand(workspaceId: string, command: string[]): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/execute`, {
            method: 'POST',
            body: JSON.stringify({ command }),
        });
    }


    // ── Editor State Endpoints ─────────────────────────────────────

    public async getEditorState(workspaceId: string): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/editor/state`);
    }

    public async saveEditorState(workspaceId: string, tabs: any[], activeTabPath?: string): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/editor/state`, {
            method: 'POST',
            body: JSON.stringify({ tabs, activeTabPath }),
        });
    }

    // ── File Endpoints ─────────────────────────────────────────────

    public async listFiles(workspaceId: string, path: string = '/'): Promise<any> {
        const query = new URLSearchParams({ path, recursive: 'true' });
        return this.request<any>(`/workspaces/${workspaceId}/files?${query.toString()}`);
    }

    public async getFile(workspaceId: string, path: string): Promise<any> {
        return this.request<any>(
            `/workspaces/${workspaceId}/files/${encodeURIComponent(path)}`
        );
    }

    public async saveFile(workspaceId: string, path: string, content: string): Promise<any> {
        return this.request<any>(
            `/workspaces/${workspaceId}/files/${encodeURIComponent(path)}`,
            {
                method: 'PUT',
                body: JSON.stringify({ content }),
            }
        );
    }

    public async createFile(
        workspaceId: string,
        path: string,
        type: 'file' | 'folder',
        content?: string
    ): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/files`, {
            method: 'POST',
            body: JSON.stringify({ path, type, content }),
        });
    }

    public async deleteFile(workspaceId: string, path: string): Promise<any> {
        return this.request<any>(
            `/workspaces/${workspaceId}/files/${encodeURIComponent(path)}`,
            {
                method: 'DELETE',
            }
        );
    }

    public async renameFile(
        workspaceId: string,
        oldPath: string,
        newPath: string
    ): Promise<any> {
        return this.request<any>(
            `/workspaces/${workspaceId}/files/${encodeURIComponent(oldPath)}/rename`,
            {
                method: 'POST',
                body: JSON.stringify({ newPath }),
            }
        );
    }
    // ── Source Control Endpoints ───────────────────────────────────

    public async getSourceControlStatus(workspaceId: string): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/source-control/status`);
    }

    public async getSourceControlHistory(workspaceId: string): Promise<any[]> {
        return this.request<any[]>(`/workspaces/${workspaceId}/source-control/log`);
    }

    public async commitSourceControl(workspaceId: string, message: string): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/source-control/commit`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    }

    public async getSourceControlBranches(workspaceId: string): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/source-control/branches`);
    }

    public async createSourceControlBranch(workspaceId: string, name: string): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/source-control/branches`, {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }

    public async checkoutSourceControlRef(workspaceId: string, ref: string): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/source-control/checkout`, {
            method: 'POST',
            body: JSON.stringify({ ref }),
        });
    }

    public async mergeSourceControlBranch(workspaceId: string, branchName: string): Promise<any> {
        return this.request<any>(`/workspaces/${workspaceId}/source-control/merge`, {
            method: 'POST',
            body: JSON.stringify({ branchName }),
        });
    }

}
