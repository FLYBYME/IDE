import { GatewayClient } from "tool-ms/dist/lib/GatewayClient.js";

export class ApiService {
    private client: GatewayClient;
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string = 'http://localhost:3001') {
        this.baseUrl = baseUrl;

        // Hydrate token from localStorage if available
        if (typeof localStorage !== 'undefined') {
            this.token = localStorage.getItem('ide-auth-token');
        }

        this.client = this.createClient();
    }

    private createClient(): GatewayClient {
        return new GatewayClient({
            baseUrl: this.baseUrl,
            token: this.token || undefined
        });
    }

    public async initClient(useWebsockets: boolean = false): Promise<void> {
        await this.client.init(useWebsockets);
        console.log('Client initialized');
    }

    public setToken(token: string | null): void {
        this.token = token;
        if (this.client) {
            this.client.close();
        }
        // Re-initialize the client with the new token
        this.client = this.createClient();
        console.log('Token set:', token);
    }

    public getBaseUrl(): string {
        return this.baseUrl;
    }

    public setBaseUrl(baseUrl: string): void {
        this.baseUrl = baseUrl;
        this.client = this.createClient();
    }

    // ── Auth Endpoints ─────────────────────────────────────────────

    public async login(username: string, password: string): Promise<any> {
        const data = await this.client.call('auth.login', { username, password, rememberMe: true });

        if (data.token) {
            this.setToken(data.token);
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('ide-auth-token', data.token);
            }
            await this.initClient(true);
        } else {
            console.log('No token received');
        }
        return data;
    }

    public async logout(): Promise<void> {
        await this.client.call('auth.logout', {});
        this.setToken(null);
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('ide-auth-token');
        }
    }

    public isAuthenticated(): boolean {
        return this.token !== null;
    }

    public async getSession(): Promise<any> {
        return this.client.call('auth.session', {});
    }

    // ── Workspace Endpoints ────────────────────────────────────────

    public async listWorkspaces(): Promise<any> {
        return this.client.call('workspace.list', {});
    }

    public async createWorkspace(name: string, description?: string): Promise<any> {
        return this.client.call('workspace.create', { name, description });
    }

    public async getWorkspace(id: string): Promise<any> {
        return this.client.call('workspace.get', { id });
    }

    public async executeWorkspaceCommand(workspaceId: string, command: string[]): Promise<any> {
        return this.client.call('workspace.execute', { workspaceId, command });
    }

    // ── Secrets Endpoints ──────────────────────────────────────────

    public async listSecrets(workspaceId: string): Promise<any> {
        return this.client.call('secrets.list', { workspaceId });
    }

    public async setSecret(workspaceId: string, key: string, value: string): Promise<any> {
        return this.client.call('secrets.set', { workspaceId, key, value });
    }

    public async deleteSecret(workspaceId: string, key: string): Promise<any> {
        return this.client.call('secrets.delete', { workspaceId, key });
    }

    // ── Editor State Endpoints ─────────────────────────────────────

    public async getEditorState(workspaceId: string): Promise<any> {
        return this.client.call('editor.getState', { workspaceId });
    }

    public async saveEditorState(workspaceId: string, tabs: any[], activeTabPath?: string): Promise<any> {
        return this.client.call('editor.setState', { workspaceId, tabs, activeTabPath });
    }

    // ── File Endpoints ─────────────────────────────────────────────

    public async listFiles(workspaceId: string, path: string = '/'): Promise<any> {
        return this.client.call('file.listTree', { workspaceId, path, recursive: true });
    }

    public async getFile(workspaceId: string, path: string): Promise<any> {
        return this.client.call('file.get', { workspaceId, path });
    }

    public async saveFile(workspaceId: string, path: string, content: string): Promise<any> {
        return this.client.call('file.save', { workspaceId, path, content });
    }

    public async createFile(
        workspaceId: string,
        path: string,
        type: 'file' | 'folder',
        content?: string
    ): Promise<any> {
        return this.client.call('file.create', { workspaceId, path, type, content });
    }

    public async deleteFile(workspaceId: string, path: string): Promise<any> {
        return this.client.call('file.delete', { workspaceId, path });
    }

    public async renameFile(workspaceId: string, oldPath: string, newPath: string): Promise<any> {
        return this.client.call('file.rename', { workspaceId, oldPath, newPath });
    }

    public async searchFiles(workspaceId: string, params: { query: string; type?: 'name' | 'content' | 'both'; caseSensitive?: boolean; limit?: number }): Promise<any> {
        return this.client.call('file.search', { workspaceId, ...params });
    }

    // ── Source Control Endpoints ───────────────────────────────────

    public async getSourceControlStatus(workspaceId: string): Promise<any> {
        return this.client.call('source-control.status', { workspaceId });
    }

    public async getSourceControlHistory(workspaceId: string): Promise<any[]> {
        return this.client.call('source-control.log', { workspaceId });
    }

    public async commitSourceControl(workspaceId: string, message: string): Promise<any> {
        return this.client.call('source-control.commit', { workspaceId, message });
    }

    public async getSourceControlBranches(workspaceId: string): Promise<any> {
        return this.client.call('source-control.listBranches', { workspaceId });
    }

    public async createSourceControlBranch(workspaceId: string, name: string): Promise<any> {
        return this.client.call('source-control.createBranch', { workspaceId, name });
    }

    public async checkoutSourceControlRef(workspaceId: string, ref: string): Promise<any> {
        return this.client.call('source-control.checkout', { workspaceId, ref });
    }

    public async mergeSourceControlBranch(workspaceId: string, branchName: string): Promise<any> {
        return this.client.call('source-control.merge', { workspaceId, branchName });
    }

    // ── Extension Endpoints ────────────────────────────────────────

    public async listExtensions(): Promise<any> {
        return this.client.call('extensions.list', {});
    }

    public async toggleExtension(id: string, enabled: boolean): Promise<any> {
        return this.client.call('extensions.toggle', { id, enabled });
    }

    public async installExtension(versionId: string): Promise<any> {
        return this.client.call('extensions.install', { versionId });
    }

    public async uninstallExtension(id: string): Promise<any> {
        return this.client.call('extensions.uninstall', { id });
    }

    public async updateExtension(id: string, data: { description: string }): Promise<any> {
        return this.client.call('extensions.update', { id, ...data });
    }

    public async deleteExtension(id: string): Promise<any> {
        return this.client.call('admin.extensions.delete', { id });
    }

    public async getExtensionManifest(id: string): Promise<any> {
        return this.client.call('extensions.getManifest', { id });
    }

    public async searchExtensions(params?: { q?: string; author?: string; sort?: string }): Promise<any> {
        return this.client.call('extensions.search', params || {});
    }

    public async getExtension(id: string): Promise<any> {
        return this.client.call('extensions.get', { id });
    }

    public async listExtensionVersions(): Promise<any> {
        return this.client.call('admin.extensions.listVersions', {});
    }

    public async deleteExtensionVersion(id: string): Promise<any> {
        return this.client.call('admin.extensions.deleteVersion', { id });
    }

    // ── Workspace Processes Endpoints ─────────────────────────────

    public async getWorkspaceProcesses(workspaceId: string): Promise<{
        processes: Array<{
            executionId: string;
            command: string[];
            startTime: number;
        }>;
    }> {
        return this.client.call('workspace.getProcesses', { workspaceId });
    }

    // ── Extension Builder Endpoints ─────────────────────────────────

    public async submitExtension(gitUrl: string, gitBranch: string = 'main', manifestPath: string = '/package.json'): Promise<{ buildId: string }> {
        return this.client.call('extensions.submit', { gitUrl, gitBranch, manifestPath });
    }

    public async getExtensionBuildStatus(buildId: string): Promise<any> {
        return this.client.call('extensions.getBuildStatus', { buildId });
    }

    public async rebuildExtension(id: string): Promise<{ buildId: string }> {
        return this.client.call('extensions.rebuild', { id });
    }
}