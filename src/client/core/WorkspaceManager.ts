import { IDE } from './IDE';

export class WorkspaceManager {
    private ide: IDE;
    private statusEl: HTMLElement | null = null;
    private usernameCache: string | null = null;
    private sidebarContainer: HTMLElement | null = null;

    constructor(ide: IDE) {
        this.ide = ide;
    }

    public initialize(): void {
        this.registerViews();
        this.registerCommands();
        this.buildMenu();
        this.restoreSession();

        // Small delay to ensure the editor grid is mounted before rendering
        setTimeout(() => this.renderWelcome(), 50);
    }

    private updateStatusIndicator(loggedIn: boolean, username?: string) {
        if (!this.statusEl) {
            this.statusEl = document.createElement('span');
            this.statusEl.style.cssText =
                'margin-left: 12px; font-size: 12px; cursor: pointer; opacity: 0.85;';
            const statusBar = document.querySelector('.status-bar .status-left');
            if (statusBar) statusBar.appendChild(this.statusEl);
        }
        if (loggedIn && username) {
            this.statusEl.innerHTML = `<i class="fas fa-user" style="margin-right: 4px;"></i>${username}`;
            this.statusEl.title = 'Click to open a workspace';
            this.statusEl.onclick = () => this.ide.commands.execute('workspace.open');
        } else {
            this.statusEl.innerHTML = `<i class="fas fa-sign-in-alt" style="margin-right: 4px;"></i>Login`;
            this.statusEl.title = 'Click to login';
            this.statusEl.onclick = () => this.ide.commands.execute('auth.triggerLogin');
        }
    }

    public renderWelcome() {
        const panel = this.ide.editor.getContentPanel('welcome');
        if (!panel) return;

        const loggedIn = this.ide.api.isAuthenticated();

        const actionCard = (icon: string, title: string, desc: string, cmdId: string) => `
            <button class="welcome-action" data-cmd="${cmdId}" style="
                display: flex; align-items: center; gap: 14px;
                width: 100%; padding: 14px 18px;
                background: var(--bg-tertiary, #2d2d30); border: 1px solid var(--border, #3e3e42);
                border-radius: 8px; cursor: pointer; text-align: left;
                color: var(--text-main, #ccc); font-family: var(--font-ui);
                transition: background 0.15s, border-color 0.15s;
            ">
                <i class="${icon}" style="font-size: 20px; color: var(--accent, #007acc); width: 24px; text-align: center;"></i>
                <div>
                    <div style="font-size: 13px; font-weight: 600;">${title}</div>
                    <div style="font-size: 12px; color: var(--text-muted, #888); margin-top: 2px;">${desc}</div>
                </div>
            </button>`;

        const actions = loggedIn
            ? `
                ${actionCard('fas fa-folder-plus', 'New Workspace', 'Create a new project workspace', 'workspace.create')}
                ${actionCard('fas fa-folder-open', 'Open Workspace', 'Open an existing workspace', 'workspace.open')}
                ${actionCard('fas fa-sign-out-alt', 'Logout', 'Sign out of your account', 'auth.logout')}
            `
            : `
                ${actionCard('fas fa-sign-in-alt', 'Login', 'Sign in to access your workspaces', 'auth.triggerLogin')}
            `;

        panel.innerHTML = `
            <div style="
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                height: 100%; padding: 40px 20px;
                font-family: var(--font-ui); color: var(--text-muted, #888);
            ">
                <div style="max-width: 420px; width: 100%; text-align: center;">
                    <i class="fas fa-code" style="font-size: 48px; color: var(--accent, #007acc); margin-bottom: 16px;"></i>
                    <h1 style="font-size: 22px; color: var(--text-main, #fff); margin: 0 0 6px;">CanvasLLM IDE</h1>
                    <p style="font-size: 13px; margin: 0 0 28px;">
                        ${loggedIn ? 'Select or create a workspace to get started.' : 'Sign in to access your cloud workspaces.'}
                    </p>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${actions}
                    </div>

                    <div style="margin-top: 24px; font-size: 11px; color: var(--text-muted, #666);">
                        <kbd style="
                            background: var(--bg-tertiary, #2d2d30); border: 1px solid var(--border, #3e3e42);
                            border-radius: 3px; padding: 2px 6px; font-family: var(--font-mono, monospace);
                        ">Ctrl+Shift+P</kbd> to open the Command Palette
                    </div>
                </div>
            </div>`;

        // Wire up action buttons
        panel.querySelectorAll('.welcome-action').forEach((btn) => {
            (btn as HTMLElement).addEventListener('mouseenter', () => {
                (btn as HTMLElement).style.background = 'var(--bg-hover, #383838)';
                (btn as HTMLElement).style.borderColor = 'var(--accent, #007acc)';
            });
            (btn as HTMLElement).addEventListener('mouseleave', () => {
                (btn as HTMLElement).style.background = 'var(--bg-tertiary, #2d2d30)';
                (btn as HTMLElement).style.borderColor = 'var(--border, #3e3e42)';
            });
            (btn as HTMLElement).addEventListener('click', () => {
                const cmd = (btn as HTMLElement).getAttribute('data-cmd');
                if (cmd) this.ide.commands.execute(cmd);
            });
        });
    }

    private async renderSidebar() {
        if (!this.sidebarContainer) return;

        this.sidebarContainer.innerHTML = '';
        const loggedIn = this.ide.api.isAuthenticated();

        // Create a wrapper for proper styling
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.height = '100%';
        wrapper.style.color = 'var(--text-main, #ccc)';
        wrapper.style.fontFamily = 'var(--font-ui, sans-serif)';

        if (!loggedIn) {
            // State A: Logged Out
            wrapper.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center;">
                    <i class="fas fa-user-circle" style="font-size: 48px; color: var(--text-muted, #888); margin-bottom: 16px;"></i>
                    <p style="font-size: 13px; color: var(--text-muted, #888); margin: 0 0 20px;">
                        Sign in to access your cloud workspaces
                    </p>
                    <button class="ide-button primary" id="sidebar-login-btn">
                        Login
                    </button>
                </div>
            `;
            this.sidebarContainer.appendChild(wrapper);

            const loginBtn = wrapper.querySelector('#sidebar-login-btn') as HTMLElement;
            if (loginBtn) {
                loginBtn.onclick = () => this.ide.commands.execute('auth.triggerLogin');
            }
            return;
        }

        // State B: Logged In

        // Header: User info
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.padding = '12px 16px';
        headerDiv.style.borderBottom = '1px solid var(--border, #3e3e42)';

        const userSpan = document.createElement('span');
        userSpan.style.fontWeight = 'bold';
        userSpan.style.fontSize = '13px';
        userSpan.innerHTML = `<i class="fas fa-user" style="margin-right: 8px; color: var(--accent, #007acc);"></i>${this.usernameCache || 'User'}`;

        const logoutIcon = document.createElement('i');
        logoutIcon.className = 'fas fa-sign-out-alt';
        logoutIcon.title = 'Logout';
        logoutIcon.style.cursor = 'pointer';
        logoutIcon.style.color = 'var(--text-muted, #888)';
        logoutIcon.onmouseover = () => logoutIcon.style.color = 'var(--text-main, #ccc)';
        logoutIcon.onmouseout = () => logoutIcon.style.color = 'var(--text-muted, #888)';
        logoutIcon.onclick = () => this.ide.commands.execute('auth.logout');

        headerDiv.appendChild(userSpan);
        headerDiv.appendChild(logoutIcon);
        wrapper.appendChild(headerDiv);

        // Active Workspace Area
        if (this.ide.activeWorkspace) {
            const activeWsDiv = document.createElement('div');
            activeWsDiv.style.padding = '12px 16px';
            activeWsDiv.style.borderBottom = '1px solid var(--border, #3e3e42)';
            activeWsDiv.style.background = 'var(--bg-tertiary, #252526)';

            const title = document.createElement('div');
            title.textContent = 'ACTIVE WORKSPACE';
            title.style.fontSize = '10px';
            title.style.fontWeight = 'bold';
            title.style.color = 'var(--text-muted, #888)';
            title.style.marginBottom = '8px';
            title.style.letterSpacing = '0.5px';

            const wsRow = document.createElement('div');
            wsRow.style.display = 'flex';
            wsRow.style.alignItems = 'center';
            wsRow.style.gap = '8px';
            wsRow.style.color = 'var(--accent, #007acc)';
            wsRow.style.fontWeight = '600';
            wsRow.style.fontSize = '13px';
            wsRow.innerHTML = `<i class="fas fa-check-circle"></i> <span>${this.ide.activeWorkspace.name}</span>`;

            activeWsDiv.appendChild(title);
            activeWsDiv.appendChild(wsRow);
            wrapper.appendChild(activeWsDiv);
        }

        // Workspace List Area
        const listContainer = document.createElement('div');
        listContainer.style.flex = '1';
        listContainer.style.overflowY = 'auto';
        listContainer.style.padding = '12px 0';

        const listHeader = document.createElement('div');
        listHeader.style.display = 'flex';
        listHeader.style.justifyContent = 'space-between';
        listHeader.style.alignItems = 'center';
        listHeader.style.padding = '0 16px 8px';

        const listTitle = document.createElement('span');
        listTitle.textContent = 'YOUR WORKSPACES';
        listTitle.style.fontSize = '10px';
        listTitle.style.fontWeight = 'bold';
        listTitle.style.color = 'var(--text-muted, #888)';
        listTitle.style.letterSpacing = '0.5px';

        const createBtn = document.createElement('i');
        createBtn.className = 'fas fa-plus';
        createBtn.title = 'Create New Workspace';
        createBtn.style.cursor = 'pointer';
        createBtn.style.color = 'var(--text-muted, #888)';
        createBtn.onmouseover = () => createBtn.style.color = 'var(--text-main, #ccc)';
        createBtn.onmouseout = () => createBtn.style.color = 'var(--text-muted, #888)';
        createBtn.onclick = () => this.ide.commands.execute('workspace.create');

        listHeader.appendChild(listTitle);
        listHeader.appendChild(createBtn);
        listContainer.appendChild(listHeader);

        // Fetch list
        const loadingText = document.createElement('div');
        loadingText.textContent = 'Loading workspaces...';
        loadingText.style.padding = '8px 16px';
        loadingText.style.fontSize = '12px';
        loadingText.style.color = 'var(--text-muted, #888)';
        listContainer.appendChild(loadingText);

        wrapper.appendChild(listContainer);
        this.sidebarContainer.appendChild(wrapper);

        try {
            const data = await this.ide.api.listWorkspaces();
            const workspaces: any[] = data.workspaces || [];

            listContainer.removeChild(loadingText);

            if (workspaces.length === 0) {
                const empty = document.createElement('div');
                empty.textContent = 'No workspaces found.';
                empty.style.padding = '8px 16px';
                empty.style.fontSize = '12px';
                empty.style.color = 'var(--text-muted, #888)';
                listContainer.appendChild(empty);
            } else {
                for (const ws of workspaces) {
                    const item = document.createElement('div');
                    item.style.padding = '6px 16px';
                    item.style.fontSize = '13px';
                    item.style.cursor = 'pointer';
                    item.style.display = 'flex';
                    item.style.alignItems = 'center';
                    item.style.gap = '8px';
                    item.innerHTML = `<i class="fas fa-folder" style="color: var(--text-muted, #888);"></i> ${ws.name}`;

                    item.onmouseover = () => item.style.background = 'var(--bg-hover, #383838)';
                    item.onmouseout = () => item.style.background = 'transparent';

                    item.onclick = async () => {
                        try {
                            await this.ide.loadWorkspace(ws.id, ws.name);
                            localStorage.setItem('ide-last-workspace', JSON.stringify({ id: ws.id, name: ws.name }));
                            this.renderSidebar();
                        } catch (err: any) {
                            this.ide.notifications.notify(`Failed to load workspace: ${err.message}`, 'error');
                        }
                    };

                    listContainer.appendChild(item);
                }
            }
        } catch (err: any) {
            loadingText.textContent = `Error: ${err.message}`;
            loadingText.style.color = 'var(--accent-error, #f48771)';
        }
    }

    private registerViews() {
        const workspaceProvider = {
            id: 'core.workspace.sidebarView',
            name: 'Workspaces',
            resolveView: (container: HTMLElement, disposables: any[]) => {
                this.sidebarContainer = container;
                this.renderSidebar();
                disposables.push({ dispose: () => { this.sidebarContainer = null; } });
            }
        };

        this.ide.views.registerProvider('left-panel', workspaceProvider);

        // Activity Bar UI
        const activityBar = document.querySelector('.activity-bar');
        if (activityBar) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-cloud';
            icon.title = 'Workspaces';
            icon.style.cursor = 'pointer';
            icon.setAttribute('data-view-id', workspaceProvider.id);

            icon.onclick = () => {
                this.ide.views.renderView('left-panel', workspaceProvider.id);
            };

            // Insert at the top
            if (activityBar.firstChild) {
                activityBar.insertBefore(icon, activityBar.firstChild);
            } else {
                activityBar.appendChild(icon);
            }
        }
    }

    private registerCommands() {
        this.ide.commands.register({
            id: 'auth.triggerLogin',
            label: 'Login',
            handler: async () => {
                try {
                    const username = await this.ide.dialogs.prompt('Enter username:', {
                        title: 'Login',
                        placeholder: 'username',
                    });
                    if (!username) return;

                    const password = await this.ide.dialogs.prompt('Enter password:', {
                        title: 'Login',
                        placeholder: 'password',
                        password: true,
                    });
                    if (!password) return;

                    const result = await this.ide.api.login(username, password);
                    this.ide.notifications.notify(
                        `Welcome, ${result.user.username}!`,
                        'success',
                        4000
                    );
                    this.updateStatusIndicator(true, result.user.username);
                    this.usernameCache = result.user.username;
                    this.renderWelcome();
                    this.renderSidebar();
                } catch (err: any) {
                    this.ide.notifications.notify(
                        `Login failed: ${err.message}`,
                        'error'
                    );
                }
            },
        });

        this.ide.commands.register({
            id: 'auth.logout',
            label: 'Logout',
            handler: async () => {
                try {
                    await this.ide.saveWorkspaceState();
                    await this.ide.api.logout();
                    this.ide.editor.closeAllTabs();
                    this.ide.activeWorkspace = null;
                    localStorage.removeItem('ide-last-workspace');
                    this.ide.notifications.notify('Logged out.', 'info', 3000);
                    this.updateStatusIndicator(false);
                    this.usernameCache = null;
                    this.renderWelcome();
                    this.renderSidebar();
                } catch (err: any) {
                    this.ide.notifications.notify(
                        `Logout failed: ${err.message}`,
                        'error'
                    );
                }
            },
        });

        this.ide.commands.register({
            id: 'workspace.create',
            label: 'Create Workspace',
            handler: async () => {
                if (!this.ide.api.isAuthenticated()) {
                    this.ide.notifications.notify('Please login first.', 'warning');
                    return;
                }
                const name = await this.ide.dialogs.prompt('Workspace name:', {
                    title: 'New Workspace',
                    placeholder: 'my-project',
                });
                if (!name) return;

                try {
                    const ws = await this.ide.api.createWorkspace(name);
                    this.ide.notifications.notify(
                        `Workspace "${ws.name}" created.`,
                        'success',
                        4000
                    );
                    await this.ide.loadWorkspace(ws.id, ws.name);
                    localStorage.setItem('ide-last-workspace', JSON.stringify({ id: ws.id, name: ws.name }));
                    this.renderSidebar();
                } catch (err: any) {
                    this.ide.notifications.notify(
                        `Failed to create workspace: ${err.message}`,
                        'error'
                    );
                }
            },
        });

        this.ide.commands.register({
            id: 'workspace.open',
            label: 'Open Workspace',
            handler: async () => {
                if (!this.ide.api.isAuthenticated()) {
                    this.ide.notifications.notify('Please login first.', 'warning');
                    return;
                }
                try {
                    const data = await this.ide.api.listWorkspaces();
                    const workspaces: any[] = data.workspaces || [];

                    if (workspaces.length === 0) {
                        this.ide.notifications.notify(
                            'No workspaces found. Create one first.',
                            'info'
                        );
                        return;
                    }

                    const items = workspaces.map((ws: any) => ({
                        id: ws.id,
                        label: ws.name,
                        description: ws.description || '',
                        icon: 'fas fa-folder',
                    }));

                    const selected = await this.ide.dialogs.showQuickPick(items, {
                        placeholder: 'Select a workspace...',
                    });

                    if (selected) {
                        await this.ide.loadWorkspace(selected.id, selected.label);
                        localStorage.setItem('ide-last-workspace', JSON.stringify({ id: selected.id, name: selected.label }));
                        this.renderSidebar();
                    }
                } catch (err: any) {
                    this.ide.notifications.notify(
                        `Failed to list workspaces: ${err.message}`,
                        'error'
                    );
                }
            },
        });
    }

    private buildMenu() {
        this.ide.layout.header.menuBar.addMenuItem({
            id: 'workspace-menu',
            label: 'Workspace',
            items: [
                {
                    id: 'workspace-menu:login',
                    label: 'Login',
                    onClick: () => this.ide.commands.execute('auth.triggerLogin'),
                },
                {
                    id: 'workspace-menu:logout',
                    label: 'Logout',
                    onClick: () => this.ide.commands.execute('auth.logout'),
                },
                {
                    id: 'workspace-menu:create',
                    label: 'New Workspace…',
                    onClick: () => this.ide.commands.execute('workspace.create'),
                },
                {
                    id: 'workspace-menu:open',
                    label: 'Open Workspace…',
                    onClick: () => this.ide.commands.execute('workspace.open'),
                },
            ],
        });
    }

    private restoreSession() {
        if (this.ide.api.isAuthenticated()) {
            this.ide.api
                .getSession()
                .then((session) => {
                    this.updateStatusIndicator(true, session.user.username);
                    this.usernameCache = session.user.username;
                    this.renderWelcome();
                    this.renderSidebar();

                    // Auto-reopen the last workspace if one was saved
                    const saved = localStorage.getItem('ide-last-workspace');
                    if (saved) {
                        try {
                            const { id, name } = JSON.parse(saved);
                            this.ide.loadWorkspace(id, name).then(() => {
                                this.renderSidebar();
                            }).catch(() => {
                                // Workspace may have been deleted – clear stale entry
                                localStorage.removeItem('ide-last-workspace');
                            });
                        } catch {
                            localStorage.removeItem('ide-last-workspace');
                        }
                    }
                })
                .catch(() => {
                    localStorage.removeItem('ide-auth-token');
                    this.updateStatusIndicator(false);
                    this.usernameCache = null;
                    this.renderWelcome();
                    this.renderSidebar();
                });
        } else {
            this.updateStatusIndicator(false);
        }
    }
}
