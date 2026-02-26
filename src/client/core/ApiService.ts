/**
 * ApiService – thin wrapper around `fetch` for communicating with the
 * CanvasLLM backend server (tool-ms REST endpoints).
 *
 * Usage:
 *   const api = new ApiService();          // uses default base URL
 *   const ws  = await api.listWorkspaces();
 */

export class ApiService {
    private baseUrl: string;
    private token: string | null = null;

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

    public getBaseUrl(): string {
        return this.baseUrl;
    }

    public setBaseUrl(baseUrl: string): void {
        this.baseUrl = baseUrl;
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

    // ── Extension Endpoints ────────────────────────────────────────

    public async listExtensions(): Promise<any> {
        return this.request<any>('/extensions');
    }

    public async toggleExtension(id: string, enabled: boolean): Promise<any> {
        return this.request<any>(`/extensions/${encodeURIComponent(id)}/toggle`, {
            method: 'POST',
            body: JSON.stringify({ enabled }),
        });
    }

    public async installExtension(versionId: string): Promise<any> {
        return this.request<any>('/extensions/install', {
            method: 'POST',
            body: JSON.stringify({ versionId }),
        });
    }

    public async updateExtension(id: string, data: { description: string }): Promise<any> {
        return this.request<any>(`/extensions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * Retrieves all Extension versions from the database.
     */
    public async listExtensionVersions(): Promise<any> {
        return this.request<any>('/extensions/versions');
    }

    /**
     * Lists active processes running in the workspace builder container.
     */
    public async getWorkspaceProcesses(workspaceId: string): Promise<{
        processes: Array<{
            executionId: string;
            command: string[];
            startTime: number;
        }>;
    }> {
        return this.request<{
            processes: Array<{
                executionId: string;
                command: string[];
                startTime: number;
            }>;
        }>(`/workspaces/${workspaceId}/processes`, {
            method: 'GET'
        });
    }

    // ── Extension Builder Endpoints ─────────────────────────────────

    public async submitExtension(gitUrl: string, gitBranch: string = 'main', manifestPath: string = '/package.json'): Promise<{ buildId: string }> {
        return this.request<{ buildId: string }>('/extensions/submit', {
            method: 'POST',
            body: JSON.stringify({ gitUrl, gitBranch, manifestPath }),
        });
    }

    public async getExtensionBuildStatus(buildId: string): Promise<any> {
        return this.request<any>(`/extensions/builds/${encodeURIComponent(buildId)}`);
    }
}
