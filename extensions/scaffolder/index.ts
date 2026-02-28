import { Extension, ExtensionContext, ViewProvider } from 'ide-core';
import { ScaffolderState } from './ScaffolderState';
import { ScaffolderSidebarView } from './ScaffolderSidebarView';
import { ScaffolderLogView } from './ScaffolderLogView';

export const ProjectScaffolderExtension: Extension = {
    id: 'dev.scaffolder',
    name: 'Project Scaffolder',
    version: '2.0.0',

    activate(context: ExtensionContext) {
        // 1. Initialize Central State
        const state = new ScaffolderState();

        // 2. Initialize Views
        const sidebarView = new ScaffolderSidebarView({
            onNameChanged: (name) => state.update({ projectName: name }),
            onGitChanged: (useGit) => state.update({ useGit }),
            onTsChanged: (useTs) => state.update({ useTs }),
            onGenerateRequested: () => context.ide.commands.execute('scaffolder.generate')
        });

        const logView = new ScaffolderLogView();

        // 3. Bind State to Views
        state.addListener((currentState) => {
            sidebarView.update(currentState);
            logView.update(currentState);
        });

        // 4. Register Left Panel Provider
        const sidebarProvider: ViewProvider = {
            id: 'scaffolder.sidebar',
            name: 'Scaffolder',
            resolveView: (container) => {
                sidebarView.mount(container);
                sidebarView.update(state.getState()); // Initial render sync
            }
        };
        context.ide.views.registerProvider('bottom-panel', sidebarProvider);
        context.ide.activityBar.registerItem({
            id: sidebarProvider.id,
            location: 'bottom-panel',
            icon: 'fas fa-hammer',
            title: 'Scaffolder'
        });

        // 5. Register Bottom Panel Provider
        const logProvider: ViewProvider = {
            id: 'scaffolder.logs',
            name: 'Scaffolder Logs',
            resolveView: (container) => {
                logView.mount(container);
                logView.update(state.getState());
            }
        };
        context.ide.views.registerProvider('bottom-panel', logProvider);

        // 6. Register Business Logic Command
        context.subscriptions.push(
            context.ide.commands.registerDisposable({
                id: 'scaffolder.generate',
                label: 'Generate Project',
                handler: async () => {
                    const current = state.getState();
                    if (!current.projectName) {
                        context.ide.notifications.notify('Project name is required.', 'warning');
                        return;
                    }

                    // Add to bottom activity bar
                    context.ide.activityBar.registerItem({
                        id: logProvider.id,
                        location: 'bottom-panel',
                        icon: 'fas fa-terminal',
                        title: 'Scaffolder Logs'
                    });
                    // Open the log panel automatically
                    context.ide.views.renderView('bottom-panel', logProvider.id);

                    state.update({ isGenerating: true });
                    state.clearLogs();
                    state.addLog(`Starting generation for "${current.projectName}"...`);

                    // Mock generation process
                    await new Promise(res => setTimeout(res, 800));
                    state.addLog(`Creating root directory...`);

                    if (current.useTs) {
                        await new Promise(res => setTimeout(res, 500));
                        state.addLog(`Initializing tsconfig.json...`);
                    }

                    if (current.useGit) {
                        await new Promise(res => setTimeout(res, 600));
                        state.addLog(`Running git init...`);
                    }

                    await new Promise(res => setTimeout(res, 400));
                    state.addLog(`Done!`);
                    state.update({ isGenerating: false });

                    context.ide.notifications.notify('Project generated successfully!', 'success');
                }
            })
        );

        context.ide.notifications.notify('Project Scaffolder loaded successfully!', 'success');
    }
};