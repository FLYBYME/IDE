import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

// --- Helpers ---

function renderSidebar(container: HTMLElement, ide: any, activeTask: string | null = null) {
    const activeWs = ide.activeWorkspace;
    const workspaceName = activeWs?.name || 'No Workspace';

    // Check for extension manifest (heuristic)
    const isExtension = activeWs?.name === 'IDE' || activeWs?.name.includes('extension');

    container.className = 'container-build-sidebar';
    container.innerHTML = `
        <div class="build-section">
            <h3>Build Tasks</h3>
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
                ${activeTask ? `
                <div class="status-item">
                    <i class="fas fa-tasks" style="color: #2196f3;"></i>
                    <span>Active Task:</span>
                    <span class="status-value" style="color: #2196f3; font-weight: bold;">${activeTask}</span>
                </div>
                ` : ''}
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

// Activity Bar Integration is now handled via ActivityBarService in activate()

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
    name: 'Build & Containers',
    version: '1.1.0',

    activate(context: ExtensionContext) {
        const { ide } = context;
        let currentTask: string | null = null;

        // --- 1. Sidebar View Logic ---
        const buildSidebarProvider: ViewProvider = {
            id: 'core.build.sidebar',
            name: 'Build & Run',
            resolveView: (container, disposables) => {
                const update = () => renderSidebar(container, ide, currentTask);
                update();

                // Watch for workspace changes to re-render
                const refreshSubId = ide.commands.on('workspace:loaded', update);

                // Listen for execution events
                const startHandler = (frame: any) => {
                    if (frame.type !== 'workspace.exec.start') return;
                    currentTask = frame.payload.command.join(' ');
                    update();
                };
                const exitHandler = (frame: any) => {
                    if (frame.type !== 'workspace.exec.exit') return;
                    currentTask = null;
                    update();
                };

                ide.ucb.subscribe('terminal', startHandler);
                ide.ucb.subscribe('terminal', exitHandler);

                disposables.push({
                    dispose: () => {
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
            icon: 'fas fa-cube',
            title: 'Build & Containers',
            order: 20
        });

        // --- 3. Commands ---
        registerCommands(context);
    }
};