import { HttpClient, Terminal, TerminalCommand } from 'tool-ms';
import { EventSource } from 'eventsource';

const API_URL = 'http://localhost:3001';

class IDESession {
    private client: HttpClient;
    private term: Terminal;
    private token: string | null = null;
    private workspaceId: string | null = null;
    private workspaceName: string | null = null;
    private sseEnabled: boolean = false;
    private sseConnection: EventSource | null = null;

    constructor() {
        this.client = new HttpClient(API_URL);
        this.term = new Terminal({
            title: '🖥️  CanvasLLM IDE TUI',
            prompt: 'ide> ',
            commands: this.getCommands(),
            defaultHandler: (input) => this.handleAIChat(input),
        });
    }

    // ── Helpers ──────────────────────────────────────────

    private authHeaders(): Record<string, string> {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    }

    private callAuth<T = any>(action: string, params: any = {}): Promise<T> {
        return this.client.call<T>(action, params, { headers: this.authHeaders() });
    }

    private logJSON(data: any) {
        this.term.log(JSON.stringify(data, null, 2));
    }

    private requireWorkspace(): string {
        if (!this.workspaceId) {
            throw new Error('No workspace selected. Run "select-ws" or "create-ws" first.');
        }
        return this.workspaceId;
    }

    // ── Auth ─────────────────────────────────────────────

    private async login(username?: string, password?: string) {
        const u = username ?? (await this.term.prompt('Username')) ?? '';
        const p = password ?? (await this.term.prompt('Password')) ?? '';
        if (!u || !p) { this.term.error('Username and password are required'); return; }

        const result = await this.client.call('auth.login', { username: u, password: p, rememberMe: true });
        this.token = result.token;
        this.term.log(`✅ Logged in as ${result.user.username} (${result.user.email})`);
    }

    // ── Workspace helpers ────────────────────────────────

    private async listWorkspaces() {
        const result = await this.callAuth('workspace.list', {});
        if (result.workspaces.length === 0) {
            this.term.log('No workspaces found. Use "create-ws" to create one.');
            return result;
        }
        this.term.log(`📂 ${result.total} workspace(s):`);
        for (const ws of result.workspaces) {
            const active = ws.id === this.workspaceId ? ' ← active' : '';
            this.term.log(`  • ${ws.name} (${ws.id})${active}`);
        }
        return result;
    }

    private async selectWorkspace() {
        const result = await this.callAuth('workspace.list', {});
        if (result.workspaces.length === 0) {
            this.term.log('No workspaces. Create one first with "create-ws".');
            return;
        }
        const names = result.workspaces.map((ws: any) => `${ws.name} (${ws.id})`);
        const choice = await this.term.select('Select a workspace', names);
        if (!choice) return;
        const idx = names.indexOf(choice);
        this.workspaceId = result.workspaces[idx].id;
        this.workspaceName = result.workspaces[idx].name;
        this.term.log(`📂 Active workspace: ${this.workspaceName} [${this.workspaceId}]`);
    }

    private async createWorkspace() {
        const name = await this.term.prompt('Workspace name');
        if (!name) return;
        const desc = await this.term.prompt('Description (optional)');
        const result = await this.callAuth('workspace.create', {
            name,
            description: desc || undefined,
        });
        this.workspaceId = result.id;
        this.workspaceName = result.name;
        this.term.log(`✅ Created workspace "${result.name}" [${result.id}]`);
    }

    private async deleteWorkspace() {
        const result = await this.callAuth('workspace.list', {});
        if (result.workspaces.length === 0) {
            this.term.log('No workspaces to delete.');
            return;
        }
        const names = result.workspaces.map((ws: any) => `${ws.name} (${ws.id})`);
        const choice = await this.term.select('Delete which workspace?', names);
        if (!choice) return;
        const idx = names.indexOf(choice);
        const ws = result.workspaces[idx];
        const ok = await this.term.confirm(`Delete "${ws.name}"? This cannot be undone.`);
        if (!ok) return;
        await this.callAuth('workspace.delete', { id: ws.id });
        this.term.log(`🗑️  Deleted workspace "${ws.name}"`);
        if (ws.id === this.workspaceId) {
            this.workspaceId = null;
            this.workspaceName = null;
            this.term.log('Active workspace cleared. Select or create a new one.');
        }
    }

    // ── File operations ──────────────────────────────────

    private async listFiles() {
        const wsId = this.requireWorkspace();
        const pathInput = await this.term.prompt('Directory path (default /)');
        const path = pathInput || '/';
        const result = await this.callAuth('file.listTree', {
            workspaceId: wsId,
            path,
            recursive: true,
        });
        if (result.entries.length === 0) {
            this.term.log('(empty)');
            return;
        }
        this.term.log(`📁 ${result.path}:`);
        for (const entry of result.entries) {
            const icon = entry.type === 'folder' ? '📂' : '📄';
            const size = entry.size !== undefined ? ` (${entry.size}b)` : '';
            this.term.log(`  ${icon} ${entry.path}${size}`);
        }
    }

    private async catFile() {
        const wsId = this.requireWorkspace();
        const path = await this.term.prompt('File path');
        if (!path) return;
        const result = await this.callAuth('file.get', {
            workspaceId: wsId,
            path,
        });
        this.term.log(`── ${result.path} (${result.language}, ${result.size}b) ──`);
        this.term.log(result.content);
        this.term.log('─'.repeat(60));
    }

    private async createFile() {
        const wsId = this.requireWorkspace();
        const path = await this.term.prompt('File path');
        if (!path) return;
        const type = await this.term.select('Type', ['file', 'folder']);
        if (!type) return;
        let content: string | undefined;
        if (type === 'file') {
            content = (await this.term.prompt('Content (or leave empty)')) || '';
        }
        const result = await this.callAuth('file.create', {
            workspaceId: wsId,
            path,
            type,
            content,
        });
        this.term.log(`✅ Created ${result.type}: ${result.path}`);
    }

    private async saveFile() {
        const wsId = this.requireWorkspace();
        const path = await this.term.prompt('File path');
        if (!path) return;
        const content = await this.term.prompt('Content');
        if (content === null) return;
        const result = await this.callAuth('file.save', {
            workspaceId: wsId,
            path,
            content: content || '',
        });
        this.term.log(`💾 Saved ${result.path} (${result.size}b)`);
    }

    private async deleteFile() {
        const wsId = this.requireWorkspace();
        const path = await this.term.prompt('File path to delete');
        if (!path) return;
        const ok = await this.term.confirm(`Delete "${path}"?`);
        if (!ok) return;
        const result = await this.callAuth('file.delete', {
            workspaceId: wsId,
            path,
        });
        this.term.log(`🗑️  Deleted ${result.deleted} file(s)`);
    }

    private async renameFile() {
        const wsId = this.requireWorkspace();
        const oldPath = await this.term.prompt('Current path');
        if (!oldPath) return;
        const newPath = await this.term.prompt('New path');
        if (!newPath) return;
        const result = await this.callAuth('file.rename', {
            workspaceId: wsId,
            oldPath,
            newPath,
        });
        this.term.log(`✅ Renamed ${result.oldPath} → ${result.newPath}`);
    }

    private async searchFiles() {
        const wsId = this.requireWorkspace();
        const query = await this.term.prompt('Search query');
        if (!query) return;
        const result = await this.callAuth('file.search', {
            workspaceId: wsId,
            query,
        });
        this.term.log(`🔍 ${result.total} result(s):`);
        for (const res of result.results) {
            this.term.log(`  ${res.path}`);
            for (const m of res.matches) {
                if (m.line) {
                    this.term.log(`    L${m.line}:${m.column} ${m.snippet}`);
                } else if (m.snippet) {
                    this.term.log(`    ${m.snippet}`);
                }
            }
        }
    }

    // ── Editor ───────────────────────────────────────────

    private async openFile() {
        const wsId = this.requireWorkspace();
        const path = await this.term.prompt('File path to open');
        if (!path) return;
        const result = await this.callAuth('editor.openFile', {
            workspaceId: wsId,
            path,
        });
        this.term.log(`📝 Opened ${result.path} (tab ${result.tabId})`);
        this.term.log(`   Language: ${result.language}, Size: ${result.size}b`);
    }

    private async showTabs() {
        const wsId = this.requireWorkspace();
        const result = await this.callAuth('editor.getState', {
            workspaceId: wsId,
        });
        if (result.tabs.length === 0) {
            this.term.log('No open tabs.');
            return;
        }
        this.term.log('📑 Open tabs:');
        for (const tab of result.tabs) {
            const active = tab.isActive ? ' ← active' : '';
            const dirty = tab.isDirty ? ' (modified)' : '';
            this.term.log(`  • [${tab.id.slice(0, 8)}] ${tab.path}${dirty}${active}`);
        }
    }

    private async closeTab() {
        const wsId = this.requireWorkspace();
        const state = await this.callAuth('editor.getState', { workspaceId: wsId });
        if (state.tabs.length === 0) {
            this.term.log('No tabs to close.');
            return;
        }
        const labels = state.tabs.map((t: any) => `${t.path} [${t.id.slice(0, 8)}]`);
        const choice = await this.term.select('Close which tab?', labels);
        if (!choice) return;
        const idx = labels.indexOf(choice);
        const tab = state.tabs[idx];
        const result = await this.callAuth('editor.closeFile', {
            workspaceId: wsId,
            tabId: tab.id,
            force: true,
        });
        this.term.log(result.success ? '✅ Tab closed' : '❌ Failed to close tab');
    }

    // ── Live Events (SSE) ────────────────────────────────

    private toggleSse() {
        if (this.sseEnabled) {
            this.sseEnabled = false;
            if (this.sseConnection) {
                this.sseConnection.close();
                this.sseConnection = null;
            }
            this.term.log('🔕 Real-time event logging disabled.');
        } else {
            this.sseEnabled = true;
            this.term.log('🔔 Real-time event logging enabled. Connecting...');
            // Standalone SSE server runs on port 3002
            let sseUrl = `${API_URL.replace(':3001', ':3002')}/events`;
            if (this.token) {
                sseUrl += `?token=${encodeURIComponent(this.token)}`;
            }
            this.sseConnection = new EventSource(sseUrl);

            this.sseConnection.onopen = () => {
                this.term.log('📡 SSE Connected.');
            };

            this.sseConnection.onerror = (err: any) => {
                this.term.log('⚠️  SSE Error/Disconnected.');
                this.term.log(err);
            };

            const logEvent = (evt: string, data: any) => {
                if (this.sseEnabled) {
                    this.term.log(`[SSE] ${evt} → ${data}`);
                }
            };

            // Generic message (fallback)
            this.sseConnection.onmessage = (e: any) => logEvent('message', e.data);

            // Specific named events broadcasted by backend
            const eventNames = ['connected', 'file.created', 'file.saved', 'file.deleted', 'file.renamed'];
            for (const name of eventNames) {
                this.sseConnection.addEventListener(name, (e: any) => logEvent(name, e.data));
            }
        }
    }

    // ── Settings ─────────────────────────────────────────

    private async showSettings() {
        const result = await this.callAuth('settings.getUserSettings', {});
        this.term.log('⚙️  User Settings:');
        this.logJSON(result.user);
    }

    // ── Meta ─────────────────────────────────────────────

    private async healthCheck() {
        const result = await this.client.call('meta.healthCheck', {});
        this.term.log(`❤️  Status: ${result.status}`);
        this.term.log(`   Uptime: ${result.uptime}s | Version: ${result.version}`);
        this.term.log('   Services:');
        for (const [svc, ok] of Object.entries(result.services)) {
            this.term.log(`     ${ok ? '✅' : '⬜'} ${svc}`);
        }
    }

    // ── AI Chat (default handler) ────────────────────────

    private async handleAIChat(input: string) {
        const wsId = this.workspaceId;
        const result = await this.callAuth('ai.chat', {
            workspaceId: wsId || undefined,
            messages: [{ role: 'user', content: input }],
        });
        this.term.log('─'.repeat(60));
        this.term.log(`🤖 ${result.message}`);
        this.term.log('─'.repeat(60));
    }

    // ── Command Definitions ──────────────────────────────

    private getCommands(): TerminalCommand[] {
        return [
            // ── Auth ────────────────────────
            {
                name: 'login',
                description: 'Re-authenticate with the server',
                type: 'command' as const,
                execute: async () => { await this.login(); },
            },
            {
                name: 'logout',
                description: 'End current session',
                type: 'command' as const,
                execute: async () => {
                    await this.callAuth('auth.logout', {});
                    this.token = null;
                    this.term.log('👋 Logged out.');
                },
            },

            // ── Workspace ───────────────────
            {
                name: 'workspaces',
                description: 'List all workspaces',
                type: 'command' as const,
                execute: async () => { await this.listWorkspaces(); },
            },
            {
                name: 'create-ws',
                description: 'Create a new workspace',
                type: 'command' as const,
                execute: async () => { await this.createWorkspace(); },
            },
            {
                name: 'select-ws',
                description: 'Select the active workspace',
                type: 'command' as const,
                execute: async () => { await this.selectWorkspace(); },
            },
            {
                name: 'delete-ws',
                description: 'Delete a workspace',
                type: 'command' as const,
                execute: async () => { await this.deleteWorkspace(); },
            },

            // ── File operations ─────────────
            {
                name: 'ls',
                description: 'List files in workspace',
                type: 'command' as const,
                execute: async () => { await this.listFiles(); },
            },
            {
                name: 'cat',
                description: 'Show file contents',
                type: 'command' as const,
                execute: async () => { await this.catFile(); },
            },
            {
                name: 'touch',
                description: 'Create a new file or folder',
                type: 'command' as const,
                execute: async () => { await this.createFile(); },
            },
            {
                name: 'write',
                description: 'Save content to a file',
                type: 'command' as const,
                execute: async () => { await this.saveFile(); },
            },
            {
                name: 'rm',
                description: 'Delete a file',
                type: 'command' as const,
                execute: async () => { await this.deleteFile(); },
            },
            {
                name: 'mv',
                description: 'Rename or move a file',
                type: 'command' as const,
                execute: async () => { await this.renameFile(); },
            },
            {
                name: 'search',
                description: 'Search files by name or content',
                type: 'command' as const,
                execute: async () => { await this.searchFiles(); },
            },

            // ── Editor ─────────────────────
            {
                name: 'open',
                description: 'Open a file in the editor',
                type: 'command' as const,
                execute: async () => { await this.openFile(); },
            },
            {
                name: 'tabs',
                description: 'Show open editor tabs',
                type: 'command' as const,
                execute: async () => { await this.showTabs(); },
            },
            {
                name: 'close',
                description: 'Close an editor tab',
                type: 'command' as const,
                execute: async () => { await this.closeTab(); },
            },

            // ── Live Events ────────────────
            {
                name: 'sse',
                description: 'Toggle real-time SSE event logging',
                type: 'command' as const,
                execute: async () => { this.toggleSse(); },
            },

            // ── Settings ───────────────────
            {
                name: 'settings',
                description: 'View user settings',
                type: 'command' as const,
                execute: async () => { await this.showSettings(); },
            },

            // ── Meta ───────────────────────
            {
                name: 'health',
                description: 'Server health check',
                type: 'command' as const,
                execute: async () => { await this.healthCheck(); },
            },

            // ── Utility ────────────────────
            {
                name: 'clear',
                description: 'Clear the terminal',
                type: 'command' as const,
                execute: async () => { this.term.clear(); },
            },
        ];
    }

    // ── Bootstrap ────────────────────────────────────────

    async start() {
        try {
            console.log('Starting CanvasLLM IDE Terminal Client...');
            await this.client.load();
            this.term.run();

            this.term.log('🖥️  CanvasLLM IDE Terminal Client');
            this.term.log('─'.repeat(40));
            this.term.log('Connecting to server & logging in...');

            // Auto-login with default dev credentials
            await this.login('admin', 'admin123');

            this.term.log('');
            this.term.log('Type a command or chat with AI. Type "help" for commands.');
            this.term.focusInput();
            console.log('CanvasLLM IDE Terminal Client started.');
        } catch (err: any) {
            console.log('❌ Startup error: ' + err.message);
            //this.term.error('❌ Startup error: ' + err.message);
            //process.exit(1);
        }
    }
}

// Start the TUI session
new IDESession().start();
