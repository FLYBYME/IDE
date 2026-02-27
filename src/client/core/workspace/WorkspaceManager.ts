import { IDE } from '../IDE';
import { WorkspaceState } from './WorkspaceState';
import { SidebarView } from './SidebarView';
import { WelcomeView } from './WelcomeView';
import { AuthDialogs } from './AuthDialogs';
import { QuickPickDialog } from '../../ui-lib';

export class WorkspaceManager {
    private ide: IDE;
    private state: WorkspaceState;
    private sidebarView: SidebarView;
    private welcomeView: WelcomeView;
    private authDialogs: AuthDialogs;
    private statusEl: HTMLElement | null = null;

    constructor(ide: IDE) {
        this.ide = ide;
        this.state = new WorkspaceState();
        this.authDialogs = new AuthDialogs();

        this.sidebarView = new SidebarView({
            onLoginRequested: () => this.ide.commands.execute('auth.triggerLogin'),
            onRegisterRequested: () => this.ide.commands.execute('auth.triggerRegister'),
            onAccountRequested: () => this.ide.commands.execute('auth.triggerAccount'),
            onLogoutRequested: () => this.ide.commands.execute('auth.logout'),
            onWorkspaceSelected: (id, name) => this.loadWorkspace(id, name),
            onCreateWorkspaceRequested: () => this.ide.commands.execute('workspace.create'),
        });

        this.welcomeView = new WelcomeView({
            state: this.state.getState(),
            onLoginRequested: () => this.ide.commands.execute('auth.triggerLogin'),
            onRegisterRequested: () => this.ide.commands.execute('auth.triggerRegister'),
            onLogoutRequested: () => this.ide.commands.execute('auth.logout'),
            onCreateRequested: () => this.ide.commands.execute('workspace.create'),
            onOpenRequested: () => this.ide.commands.execute('workspace.open'),
        });

        // Listen for state changes to re-render views
        this.state.addListener((state) => {
            this.sidebarView.update(state);
            this.welcomeView.update(state);
            this.updateStatusIndicator(state.currentUser !== null, state.currentUser?.username);
        });
    }

    public async initialize(): Promise<void> {
        this.registerViews();
        this.registerCommands();
        this.buildMenu();

        // Await the session restore so we have user data before rendering
        await this.restoreSession();

        const renderViews = () => {
            let panel = this.ide.editor.getContentPanel('welcome');
            if (!panel) {
                this.ide.editor.openTab({
                    id: 'welcome',
                    title: 'Welcome',
                    icon: 'fas fa-star',
                });
                panel = this.ide.editor.getContentPanel('welcome');
            }

            if (panel) {
                this.welcomeView.mount(panel);
                this.welcomeView.update(this.state.getState());
            }

            this.ide.views.renderView('left-panel', 'core.workspace.sidebarView');
        };

        renderViews();
    }

    private updateStatusIndicator(loggedIn: boolean, username?: string) {
        if (!this.statusEl) {
            this.statusEl = document.createElement('span');
            this.statusEl.style.cssText =
                'margin-left: 12px; font-size: 12px; cursor: pointer; opacity: 0.85;';
            const statusBar = document.querySelector('.status-bar .status-left');
            if (statusBar) statusBar.appendChild(this.statusEl);
        }

        this.statusEl.innerHTML = ''; // Clear existing content safely

        const icon = document.createElement('i');
        icon.style.marginRight = '4px';

        if (loggedIn && username) {
            icon.className = 'fas fa-user';
            this.statusEl.appendChild(icon);
            this.statusEl.appendChild(document.createTextNode(username));
            this.statusEl.title = 'Click to open a workspace';
            this.statusEl.onclick = () => this.ide.commands.execute('workspace.open');
        } else {
            icon.className = 'fas fa-sign-in-alt';
            this.statusEl.appendChild(icon);
            this.statusEl.appendChild(document.createTextNode('Login'));
            this.statusEl.title = 'Click to login';
            this.statusEl.onclick = () => this.ide.commands.execute('auth.triggerLogin');
        }
    }

    private registerViews() {
        const workspaceProvider = {
            id: 'core.workspace.sidebarView',
            name: 'Workspaces',
            resolveView: (container: HTMLElement, disposables: any[]) => {
                console.log('Workspace view resolved');
                this.sidebarView.mount(container);
                this.sidebarView.update(this.state.getState());

                // Fetch workspaces when view is opened
                this.refreshWorkspaces();

                disposables.push({ dispose: () => { /* Handle cleanup if needed */ } });
            }
        };

        this.ide.views.registerProvider('left-panel', workspaceProvider);

        // Activity Bar UI
        this.ide.activityBar.registerItem({
            id: workspaceProvider.id,
            location: 'left-panel',
            icon: 'fas fa-cloud',
            title: 'Workspaces',
            order: 0, // Top
        });
    }

    private registerCommands() {
        this.ide.commands.register({
            id: 'auth.triggerLogin',
            label: 'Login',
            handler: async () => {
                try {
                    const credentials = await this.authDialogs.showLogin();
                    if (!credentials) return console.log('Login cancelled');

                    const rememberMe = !!credentials.rememberMe;
                    const result = await this.ide.gateway.call('auth.login', credentials);
                    this.state.setCurrentUser({
                        username: result.user.username,
                        email: result.user.email,
                        id: result.user.id
                    });

                    // Save token
                    if (rememberMe) {
                        this.ide.commands.execute('core.gateway.saveToken', result.token);
                    }

                    this.ide.notifications.notify(
                        `Welcome, ${result.user.username}!`,
                        'success',
                        4000
                    );

                    this.refreshWorkspaces();
                } catch (err: any) {
                    this.ide.notifications.notify(
                        `Login failed: ${err.message}`,
                        'error'
                    );
                }
            },
        });

        this.ide.commands.register({
            id: 'auth.triggerRegister',
            label: 'Register',
            handler: async () => {
                try {
                    const credentials = await this.authDialogs.showRegister();
                    if (!credentials) return;

                    await this.ide.gateway.call('auth.register', credentials);
                    this.ide.notifications.notify(
                        `Account created successfully! Please login.`,
                        'success',
                        4000
                    );

                    // Trigger login dialog automatically
                    this.ide.commands.execute('auth.triggerLogin');
                } catch (err: any) {
                    this.ide.notifications.notify(
                        `Registration failed: ${err.message}`,
                        'error'
                    );
                }
            },
        });

        this.ide.commands.register({
            id: 'auth.triggerAccount',
            label: 'Account',
            handler: async () => {
                const user = this.state.getState().currentUser;
                if (!user) return;

                try {
                    const result = await this.authDialogs.showAccount(user);
                    if (!result) return;

                    await this.ide.gateway.call('auth.updateProfile', result);
                    this.state.setCurrentUser({
                        ...user,
                        email: result.email,
                        bio: result.bio
                    });

                    this.ide.notifications.notify(
                        'Profile updated.',
                        'success',
                        3000
                    );
                } catch (err: any) {
                    this.ide.notifications.notify(
                        `Update failed: ${err.message}`,
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
                    await this.ide.gateway.call('auth.logout');
                    this.ide.editor.closeAllTabs();
                    this.ide.activeWorkspace = null;
                    localStorage.removeItem('ide-last-workspace');

                    this.state.update({
                        currentUser: null,
                        activeWorkspace: null,
                        workspaces: []
                    });

                    this.ide.notifications.notify('Logged out.', 'info', 3000);
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
                if (!this.ide.gateway.getToken()) {
                    this.ide.notifications.notify('Please login first.', 'warning');
                    return;
                }
                const name = await this.authDialogs.showCreateWorkspace();
                if (!name) return;

                try {
                    const ws = await this.ide.gateway.call('workspace.create', { name });
                    this.ide.notifications.notify(
                        `Workspace "${ws.name}" created.`,
                        'success',
                        4000
                    );
                    await this.loadWorkspace(ws.id, ws.name);
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
                if (!this.ide.gateway.getToken()) {
                    this.ide.notifications.notify('Please login first.', 'warning');
                    return;
                }
                try {
                    this.state.setLoading(true);
                    const data = await this.ide.gateway.call('workspace.list');
                    const workspaces: any[] = data.workspaces || [];
                    this.state.setWorkspaces(workspaces);
                    this.state.setLoading(false);

                    if (workspaces.length === 0) {
                        this.ide.notifications.notify(
                            'No workspaces found. Create one first.',
                            'info'
                        );
                        return;
                    }

                    const activeWs = this.state.getState().activeWorkspace;
                    const items = workspaces.map((ws: any) => ({
                        id: ws.id,
                        label: ws.name + (activeWs?.id === ws.id ? ' (current)' : ''),
                        description: ws.description || '',
                        icon: activeWs?.id === ws.id ? 'fas fa-check' : 'fas fa-folder',
                    }));

                    console.log(items);
                    const selected = await QuickPickDialog.show(items, {
                        placeholder: 'Select a workspace...',
                    });

                    if (selected) {
                        await this.loadWorkspace(selected.id, selected.label);
                    } else {
                        this.ide.notifications.notify('No workspace selected.', 'info');
                    }
                } catch (err: any) {
                    this.state.setLoading(false);
                    this.ide.notifications.notify(
                        `Failed to list workspaces: ${err.message}`,
                        'error'
                    );
                }
            },
        });
    }

    private async refreshWorkspaces() {
        if (!this.ide.gateway.getToken()) return;

        try {
            this.state.setLoading(true);
            const data = await this.ide.gateway.call('workspace.list');
            this.state.setWorkspaces(data.workspaces || []);
        } catch (err) {
            console.error('Failed to refresh workspaces:', err);
        } finally {
            this.state.setLoading(false);
        }
    }

    private async loadWorkspace(id: string, name: string) {
        try {
            // await this.ide.loadWorkspace(id, name);
            this.state.setActiveWorkspace({ id, name });
            localStorage.setItem('ide-last-workspace', JSON.stringify({ id, name }));
            this.ide.notifications.notify(`Workspace "${name}" loaded.`, 'success', 14000);
        } catch (err: any) {
            this.ide.notifications.notify(`Failed to load workspace: ${err.message}`, 'error');
        }
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

    private async restoreSession(retries = 3): Promise<void> {
        const token = this.ide.gateway.getToken();
        if (!token) {
            console.log('WorkspaceManager: No token found, skipping session restore.');
            return;
        }

        try {
            this.state.setLoading(true);

            // Attempt to fetch the profile
            const result = await this.ide.gateway.call('auth.getSession');

            if (result && result.user) {
                this.state.setCurrentUser({
                    username: result.user.username,
                    email: result.user.email,
                    id: result.user.id,
                    bio: result.user.bio
                });
                await this.refreshWorkspaces();
            }
        } catch (err: any) {
            // If the error is a connection race condition, retry
            if (err.message.includes('Not connected to WS') && retries > 0) {
                console.warn(`Gateway not ready, retrying... (${retries} left) waiting 1.5s`);
                await new Promise(res => setTimeout(res, 1500)); // wait 1.5s
                return this.restoreSession(retries - 1);
            }

            console.error('WorkspaceManager: Failed to restore session:', err);
        } finally {
            this.state.setLoading(false);
        }
    }
}
