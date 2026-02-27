import { HttpClient } from 'tool-ms';
import { bootstrap, stopServer } from '../src/canvas-llm-server/index';
import fs from 'fs';

export class SharedServer {
    private static started = false;
    private static workspaceId?: string;
    private static authToken?: string;

    static async start() {
        if (this.started) return { workspaceId: this.workspaceId, authToken: this.authToken };

        console.log('🚀 Loading server in-process (shared)...');
        await bootstrap();

        // Wait for health
        const start = Date.now();
        while (Date.now() - start < 30000) {
            try {
                const res = await fetch('http://localhost:3001/api/_meta/health');
                if (res.ok) {
                    console.log('✅ Server is healthy!');
                    break;
                }
            } catch (e) { }
            await new Promise(r => setTimeout(r, 1000));
        }

        // Initialize the singleton helper
        await testHelper.setup();
        this.workspaceId = testHelper.workspaceId;
        this.authToken = testHelper.headers.Authorization;
        this.started = true;

        return { workspaceId: this.workspaceId, authToken: this.authToken };
    }

    static async stop() {
        if (!this.started) return;
        testHelper.workspaceId = this.workspaceId;
        testHelper.headers = { Authorization: this.authToken || '' };
        await testHelper.teardown();
        await stopServer();
        this.started = false;
    }
}

export class TestHelper {
    public client: HttpClient;
    public headers: Record<string, string> = {};
    public workspaceId?: string;

    constructor(baseUrl: string = 'http://localhost:3001') {
        this.client = new HttpClient(baseUrl);
    }

    /**
     * Ensures the shared server is running and the helper is ready.
     * Call this in beforeAll().
     */
    async start() {
        await SharedServer.start();
        // Sync singleton state to this instance if needed (redundant for singleton but good for API)
        await this.client.load();
    }

    /**
     * Stops the shared server. Call this in afterAll() if it's the last test.
     */
    async stop() {
        await SharedServer.stop();
    }

    async setup() {
        await this.client.load();

        // Authenticate
        let auth;
        try {
            auth = await this.client.call('auth.login', { username: 'admin', password: 'admin123' });
        } catch (e) {
            // Fallback to register if admin doesn't exist
            await this.client.call('auth.register', {
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123'
            });
            auth = await this.client.call('auth.login', { username: 'admin', password: 'admin123' });
        }
        this.headers = { Authorization: `Bearer ${auth.token}` };

        // Create Workspace
        const workspaceName = `Editor Test Space ${Date.now()}`;
        const workspace = await this.client.call('workspace.create', { name: workspaceName }, { headers: this.headers });
        this.workspaceId = workspace.id;
    }

    async teardown() {
        if (this.workspaceId) {
            await this.client.call('workspace.delete', { id: this.workspaceId }, { headers: this.headers });
        }
    }

    async createTestFile(path: string, content: string = 'console.log("Initial Content");') {
        if (!this.workspaceId) throw new Error('Workspace ID not initialized');
        return await this.client.call('file.create', {
            workspaceId: this.workspaceId,
            path,
            type: 'file',
            content
        }, { headers: this.headers });
    }

    async call(action: string, params: any = {}) {
        return await this.client.call(action, {
            workspaceId: this.workspaceId,
            ...params
        }, { headers: this.headers });
    }
}

// Singleton helper for shared use
export const testHelper = new TestHelper();
