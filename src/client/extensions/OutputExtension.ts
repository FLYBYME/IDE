import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

export const OutputExtension: Extension = {
    id: 'core.output',
    name: 'Output',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        let outputContainer: HTMLElement | null = null;

        console.log(`OutputExtension activated`);

        const outputProvider: ViewProvider = {
            id: 'core.output.view',
            name: 'Output',
            resolveView: (container: HTMLElement, disposables: any[]) => {
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.height = '100%';
                container.style.backgroundColor = 'var(--bg-root, #1e1e1e)';
                container.style.color = 'var(--text-main, #cccccc)';
                container.style.fontFamily = 'var(--font-mono, "Courier New", monospace)';
                container.style.fontSize = '12px';
                container.style.padding = '8px';
                container.style.overflowY = 'auto';
                container.style.whiteSpace = 'pre-wrap';

                outputContainer = container;

                disposables.push({
                    dispose: () => { outputContainer = null; }
                });
            }
        };

        context.ide.views.registerProvider('bottom-panel', outputProvider);

        // Add activity bar icon for output in the bottom panel
        context.ide.activityBar.registerItem({
            id: outputProvider.id,
            location: 'bottom-panel',
            icon: 'fas fa-terminal',
            title: 'Output',
            order: 0
        });

        // Listen for output events
        const outputHandler = (data: any) => {
            console.log(data);
            if (!outputContainer) return;

            const span = document.createElement('span');
            if (data.stream === 'stderr') {
                span.style.color = 'var(--error, #f48771)';
            }
            // Include execution ID in output
            span.textContent = `[${data.executionId.substring(0, 8)}] ${data.data}`;
            outputContainer.appendChild(span);

            // Auto-scroll to bottom
            outputContainer.scrollTop = outputContainer.scrollHeight;
        };

        const exitHandler = (data: any) => {
            if (!outputContainer) return;
            const div = document.createElement('div');
            div.style.marginTop = '8px';
            div.style.borderTop = '1px solid var(--border, #3e3e42)';
            div.style.paddingTop = '4px';
            div.style.color = 'var(--accent, #007acc)';
            div.textContent = `[${data.executionId.substring(0, 8)}] Process exited with code ${data.exitCode}`;
            outputContainer.appendChild(div);
            outputContainer.scrollTop = outputContainer.scrollHeight;
        };

        context.ide.api.on('workspace.exec.output', outputHandler);
        context.ide.api.on('workspace.exec.exit', exitHandler);

        context.subscriptions.push({
            dispose: () => {
                context.ide.api.off('workspace.exec.output', outputHandler);
                context.ide.api.off('workspace.exec.exit', exitHandler);
            }
        });

        // Register a command to execute something
        context.ide.commands.register({
            id: 'workspace.runCommand',
            label: 'Run Workspace Command',
            handler: async () => {
                if (!context.ide.activeWorkspace) {
                    context.ide.notifications.notify('No active workspace', 'warning');
                    return;
                }

                const cmdString = await context.ide.dialogs.prompt('Enter command:', {
                    title: 'Execute Command',
                    placeholder: 'npm run build'
                });

                if (!cmdString) return;

                const command = cmdString.split(' ');

                // Clear output and show panel
                if (outputContainer) outputContainer.innerHTML = `> ${cmdString}\n`;
                context.ide.views.renderView('bottom-panel', outputProvider.id);

                try {
                    await context.ide.api.executeWorkspaceCommand(context.ide.activeWorkspace.id, command);
                } catch (err: any) {
                    context.ide.notifications.notify(`Failed to start command: ${err.message}`, 'error');
                }
            }
        });

        // Initial render of output view
        setTimeout(() => {
            context.ide.views.renderView('bottom-panel', outputProvider.id);
        }, 1000);
    }
};
