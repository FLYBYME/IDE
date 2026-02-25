import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

export const TerminalExtension: Extension = {
    id: 'core.terminal',
    name: 'Terminal',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        const { ide } = context;

        const terminalProvider: ViewProvider = {
            id: 'core.terminal.view',
            name: 'Terminal',
            resolveView: (container, disposables) => {
                container.style.height = '100%';
                container.style.width = '100%';
                container.style.overflow = 'hidden';
                container.style.backgroundColor = '#1e1e1e';

                const workspaceId = ide.activeWorkspace?.id;
                if (!workspaceId) {
                    container.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Open a workspace to use the terminal.</div>';
                    return;
                }

                const term = ide.terminal.createTerminal(container, workspaceId);

                // Resize handler
                const onResize = () => {
                    ide.terminal.fit(workspaceId);
                };

                // Listen for layout resize events
                const resizeSubId = ide.commands.on('layout:resize', onResize);
                const visibilitySubId = ide.commands.on('panel:visibility_change', (data: any) => {
                    if (data.id === 'bottom-panel' && data.visible) {
                        setTimeout(onResize, 50); // Small delay to allow DOM to update
                    }
                });

                disposables.push({
                    dispose: () => {
                        ide.commands.off(resizeSubId);
                        ide.commands.off(visibilitySubId);
                        // We don't destroy the terminal here to keep it alive when switching views
                        // But if the extension is deactivated, we should.
                    }
                });
            }
        };

        // 1. Register View Provider
        ide.views.registerProvider('bottom-panel', terminalProvider);

        // 2. Register Activity Bar Item
        ide.activityBar.registerItem({
            id: terminalProvider.id,
            location: 'bottom-panel',
            icon: 'fas fa-terminal',
            title: 'Terminal',
            order: 1
        });

        // 3. Register Commands
        context.subscriptions.push(ide.commands.registerDisposable({
            id: 'terminal.focus',
            label: 'Terminal: Focus',
            handler: () => {
                ide.views.renderView('bottom-panel', terminalProvider.id);
            }
        }));

        context.subscriptions.push(ide.commands.registerDisposable({
            id: 'terminal.clear',
            label: 'Terminal: Clear',
            handler: () => {
                // TODO: Clear terminal logic
            }
        }));
    }
};
