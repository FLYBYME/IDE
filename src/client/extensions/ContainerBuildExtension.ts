import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

interface ProcessItem {
    executionId: string;
    command: string[];
    startTime: number;
}

// --- Helpers ---

function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function renderSidebar(container: HTMLElement, ide: any, activeProcesses: ProcessItem[] = []) {
    const activeWs = ide.activeWorkspace;
    const workspaceName = activeWs?.name || 'No Workspace';

    // Check for extension manifest (heuristic)
    const isExtension = activeWs?.name === 'IDE' || activeWs?.name.includes('extension');

    const now = Date.now();

    const processesHtml = activeProcesses.length > 0
        ? activeProcesses.map(p => `
            <div class="status-item process-item" style="display: flex; flex-direction: column; align-items: flex-start; margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px; border-left: 3px solid #2196f3;">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 4px;">
                    <span style="color: #2196f3; font-weight: bold; font-family: monospace; font-size: 0.9em; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.command.join(' ')}">${p.command.join(' ')}</span>
                    <span style="font-size: 0.8em; color: #888;">${formatDuration(now - p.startTime)}</span>
                </div>
                <div style="font-size: 0.75em; color: #666; font-family: monospace;">ID: ${p.executionId.substring(0, 8)}</div>
            </div>
        `).join('')
        : `<div class="status-item"><span style="color: #888; font-style: italic;">No active processes</span></div>`;

    container.className = 'container-build-sidebar';
    container.innerHTML = `
        <div class="build-section">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
                <button class="build-btn" data-cmd="npm install">
                    <i class="fas fa-download"></i>
                    <span>Install Dependencies</span>
                </button>
                <button class="build-btn" data-cmd="npm run build">
                    <i class="fas fa-hammer"></i>
                    <span>Run Build</span>
                </button>
                <button class="build-btn primary" data-cmd="npm start">
                    <i class="fas fa-play"></i>
                    <span>Start Application</span>
                </button>
            </div>
        </div>

        <div class="divider"></div>

        <div class="build-section">
            <h3>Container Status</h3>
            <div class="status-list">
                <div class="status-item">
                    <i class="fas fa-hdd"></i>
                    <span>Workspace:</span>
                    <span class="status-value">${workspaceName}</span>
                </div>
                <div class="status-item">
                    <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                    <span>Status:</span>
                    <span class="status-badge online">Running</span>
                </div>
            </div>
        </div>

        <div class="divider"></div>

        <div class="build-section">
            <h3 style="display: flex; justify-content: space-between; align-items: center;">
                Active Processes
                <span class="status-badge" style="background: rgba(33, 150, 243, 0.2); color: #2196f3; font-size: 0.8em; padding: 2px 6px;">${activeProcesses.length}</span>
            </h3>
            <div class="status-list">
                ${processesHtml}
            </div>
        </div>

        ${isExtension ? `
        <div class="divider"></div>
        <div class="build-section extension-controls">
            <h4>Extension Development</h4>
            <div class="action-buttons">
                <button class="build-btn" data-cmd="build.publish">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>Publish to Marketplace</span>
                </button>
            </div>
        </div>
        ` : ''}
    `;

    // Event Listeners
    container.querySelectorAll('button[data-cmd]').forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = (btn as HTMLElement).dataset.cmd;
            if (!cmd) return;

            if (cmd === 'build.publish') {
                ide.commands.execute('build.publish');
            } else {
                ide.commands.execute('workspace.runCommand', cmd);
            }
        });
    });
}

function registerCommands(context: ExtensionContext) {
    const { ide } = context;

    context.subscriptions.push(ide.commands.registerDisposable({
        id: 'build.install',
        label: 'Container: NPM Install',
        handler: () => { ide.commands.execute('workspace.runCommand', 'npm install'); }
    }));

    context.subscriptions.push(ide.commands.registerDisposable({
        id: 'build.runBuild',
        label: 'Container: Run Build',
        handler: () => { ide.commands.execute('workspace.runCommand', 'npm run build'); }
    }));

    context.subscriptions.push(ide.commands.registerDisposable({
        id: 'build.publish',
        label: 'Container: Publish Extension',
        handler: async () => {
            const confirm = await ide.dialogs.confirm('Publish Extension?', {
                detail: 'This will build and upload your extension to the marketplace.',
                confirmLabel: 'Publish Now'
            } as any);
            if (confirm) {
                ide.notifications.notify('Publishing extension...', 'info');
                ide.commands.execute('workspace.runCommand', 'npm run build');
            }
        }
    }));
}

export const ContainerBuildExtension: Extension = {
    id: 'core.containerBuild',
    name: 'Process Manager',
    version: '1.2.0',

    activate(context: ExtensionContext) {
        const { ide } = context;
        let pList: ProcessItem[] = [];
        let timer: any = null;

        // --- 1. Sidebar View Logic ---
        const buildSidebarProvider: ViewProvider = {
            id: 'core.build.sidebar',
            name: 'Process Manager',
            resolveView: (container, disposables) => {

                const update = async () => {
                    const wsId = ide.activeWorkspace?.id;
                    if (wsId) {
                        try {
                            const res = await ide.api.getWorkspaceProcesses(wsId);
                            pList = res.processes || [];
                        } catch (err) {
                            console.error('Failed to fetch workspace processes', err);
                        }
                    } else {
                        pList = [];
                    }
                    renderSidebar(container, ide, pList);
                };

                update();

                // Periodic refresh for duration timer update
                timer = setInterval(() => {
                    if (pList.length > 0) {
                        renderSidebar(container, ide, pList);
                    }
                }, 1000);

                // Watch for workspace changes to re-render
                const refreshSubId = ide.commands.on('workspace:loaded', update);

                // Listen for execution events
                const startHandler = (frame: any) => {
                    if (frame.type !== 'workspace.exec.start') return;
                    // Optimistic update
                    pList.push({
                        executionId: frame.payload.executionId,
                        command: frame.payload.command,
                        startTime: Date.now()
                    });
                    renderSidebar(container, ide, pList);
                };

                const exitHandler = (frame: any) => {
                    if (frame.type !== 'workspace.exec.exit') return;
                    pList = pList.filter(p => p.executionId !== frame.payload.executionId);
                    renderSidebar(container, ide, pList);
                };

                ide.ucb.subscribe('terminal', startHandler);
                ide.ucb.subscribe('terminal', exitHandler);

                disposables.push({
                    dispose: () => {
                        if (timer) clearInterval(timer);
                        ide.commands.off(refreshSubId);
                        ide.ucb.unsubscribe('terminal', startHandler);
                        ide.ucb.unsubscribe('terminal', exitHandler);
                    }
                });
            }
        };

        // --- 2. Registration ---
        ide.views.registerProvider('left-panel', buildSidebarProvider);

        // Activity Bar Integration
        ide.activityBar.registerItem({
            id: buildSidebarProvider.id,
            location: 'left-panel',
            icon: 'fas fa-tasks', // Changed icon to represent tasks/processes
            title: 'Process Manager',
            order: 20
        });

        // --- 3. Commands ---
        registerCommands(context);
    }
};