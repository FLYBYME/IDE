/**
 * WorkspaceExtension – handles auth login/logout, workspace selection,
 * and loading real files from the backend API into the IDE.
 * Also owns the Welcome tab content.
 */

import { Extension, ExtensionContext } from '../core/extensions/Extension';

export const WorkspaceExtension: Extension = {
    id: 'core.workspace',
    name: 'Workspace Manager',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        const { ide } = context;

        // ── Status bar indicator ────────────────────────────────
        let statusEl: HTMLElement | null = null;

        function updateStatusIndicator(loggedIn: boolean, username?: string) {
            if (!statusEl) {
                statusEl = document.createElement('span');
                statusEl.style.cssText =
                    'margin-left: 12px; font-size: 12px; cursor: pointer; opacity: 0.85;';
                const statusBar = document.querySelector('.status-bar .status-left');
                if (statusBar) statusBar.appendChild(statusEl);
            }
            if (loggedIn && username) {
                statusEl.innerHTML = `<i class="fas fa-user" style="margin-right: 4px;"></i>${username}`;
                statusEl.title = 'Click to open a workspace';
                statusEl.onclick = () => ide.commands.execute('workspace.open');
            } else {
                statusEl.innerHTML = `<i class="fas fa-sign-in-alt" style="margin-right: 4px;"></i>Login`;
                statusEl.title = 'Click to login';
                statusEl.onclick = () => ide.commands.execute('auth.triggerLogin');
            }
        }

        // ── Welcome tab renderer ────────────────────────────────
        function renderWelcome() {
            const panel = ide.editor.getContentPanel('welcome');
            if (!panel) return;

            const loggedIn = ide.api.isAuthenticated();

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
                    if (cmd) ide.commands.execute(cmd);
                });
            });
        }

        // ── auth.triggerLogin ────────────────────────────────────
        const loginCmd = ide.commands.registerDisposable({
            id: 'auth.triggerLogin',
            label: 'Login',
            handler: async () => {
                try {
                    const username = await ide.dialogs.prompt('Enter username:', {
                        title: 'Login',
                        placeholder: 'username',
                    });
                    if (!username) return;

                    const password = await ide.dialogs.prompt('Enter password:', {
                        title: 'Login',
                        placeholder: 'password',
                        password: true,
                    });
                    if (!password) return;

                    const result = await ide.api.login(username, password);
                    ide.notifications.notify(
                        `Welcome, ${result.user.username}!`,
                        'success',
                        4000
                    );
                    updateStatusIndicator(true, result.user.username);
                    renderWelcome();
                } catch (err: any) {
                    ide.notifications.notify(
                        `Login failed: ${err.message}`,
                        'error'
                    );
                }
            },
        });
        context.subscriptions.push(loginCmd);

        // ── auth.logout ─────────────────────────────────────────
        const logoutCmd = ide.commands.registerDisposable({
            id: 'auth.logout',
            label: 'Logout',
            handler: async () => {
                try {
                    await ide.saveWorkspaceState();
                    await ide.api.logout();
                    ide.editor.closeAllTabs();
                    ide.activeWorkspace = null;
                    localStorage.removeItem('ide-last-workspace');
                    ide.notifications.notify('Logged out.', 'info', 3000);
                    updateStatusIndicator(false);
                    renderWelcome();
                } catch (err: any) {
                    ide.notifications.notify(
                        `Logout failed: ${err.message}`,
                        'error'
                    );
                }
            },
        });
        context.subscriptions.push(logoutCmd);

        // ── workspace.create ────────────────────────────────────
        const createCmd = ide.commands.registerDisposable({
            id: 'workspace.create',
            label: 'Create Workspace',
            handler: async () => {
                if (!ide.api.isAuthenticated()) {
                    ide.notifications.notify('Please login first.', 'warning');
                    return;
                }
                const name = await ide.dialogs.prompt('Workspace name:', {
                    title: 'New Workspace',
                    placeholder: 'my-project',
                });
                if (!name) return;

                try {
                    const ws = await ide.api.createWorkspace(name);
                    ide.notifications.notify(
                        `Workspace "${ws.name}" created.`,
                        'success',
                        4000
                    );
                    await ide.loadWorkspace(ws.id, ws.name);
                    localStorage.setItem('ide-last-workspace', JSON.stringify({ id: ws.id, name: ws.name }));
                } catch (err: any) {
                    ide.notifications.notify(
                        `Failed to create workspace: ${err.message}`,
                        'error'
                    );
                }
            },
        });
        context.subscriptions.push(createCmd);

        // ── workspace.open ──────────────────────────────────────
        const openCmd = ide.commands.registerDisposable({
            id: 'workspace.open',
            label: 'Open Workspace',
            handler: async () => {
                if (!ide.api.isAuthenticated()) {
                    ide.notifications.notify('Please login first.', 'warning');
                    return;
                }
                try {
                    const data = await ide.api.listWorkspaces();
                    const workspaces: any[] = data.workspaces || [];

                    if (workspaces.length === 0) {
                        ide.notifications.notify(
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

                    const selected = await ide.dialogs.showQuickPick(items, {
                        placeholder: 'Select a workspace...',
                    });

                    if (selected) {
                        await ide.loadWorkspace(selected.id, selected.label);
                        localStorage.setItem('ide-last-workspace', JSON.stringify({ id: selected.id, name: selected.label }));
                    }
                } catch (err: any) {
                    ide.notifications.notify(
                        `Failed to list workspaces: ${err.message}`,
                        'error'
                    );
                }
            },
        });
        context.subscriptions.push(openCmd);

        // ── Menu items ──────────────────────────────────────────
        ide.layout.header.menuBar.addMenuItem({
            id: 'workspace-menu',
            label: 'Workspace',
            items: [
                {
                    id: 'workspace-menu:login',
                    label: 'Login',
                    onClick: () => ide.commands.execute('auth.triggerLogin'),
                },
                {
                    id: 'workspace-menu:logout',
                    label: 'Logout',
                    onClick: () => ide.commands.execute('auth.logout'),
                },
                {
                    id: 'workspace-menu:create',
                    label: 'New Workspace…',
                    onClick: () => ide.commands.execute('workspace.create'),
                },
                {
                    id: 'workspace-menu:open',
                    label: 'Open Workspace…',
                    onClick: () => ide.commands.execute('workspace.open'),
                },
            ],
        });

        // ── Render welcome tab (small delay so the tab panel is mounted) ──
        setTimeout(() => renderWelcome(), 50);

        // ── Auto-restore session on startup ─────────────────────
        if (ide.api.isAuthenticated()) {
            ide.api
                .getSession()
                .then((session) => {
                    updateStatusIndicator(true, session.user.username);
                    renderWelcome();

                    // Auto-reopen the last workspace if one was saved
                    const saved = localStorage.getItem('ide-last-workspace');
                    if (saved) {
                        try {
                            const { id, name } = JSON.parse(saved);
                            ide.loadWorkspace(id, name).catch(() => {
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
                    updateStatusIndicator(false);
                    renderWelcome();
                });
        } else {
            updateStatusIndicator(false);
        }
    },
};
