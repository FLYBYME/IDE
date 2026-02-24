import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

export const ScratchpadExtension: Extension = {
    id: 'tools.scratchpad',
    name: 'Scratchpad',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        // 1. Register a command to open a temporary markdown file in the main editor
        const openEditorCommand = context.ide.commands.registerDisposable({
            id: 'scratchpad.openEditor',
            label: 'Open Scratchpad File',
            handler: () => {
                // Uses the EditorManager to open a new file tab with Monaco
                context.ide.editor.openFile(
                    'scratchpad-temp.md',
                    'Scratchpad',
                    '# My Scratchpad\n\nType your temporary code or notes here. This is an in-memory file.\n',
                    'markdown',
                    'fas fa-edit' // FontAwesome icon for the tab
                );
            }
        });
        context.subscriptions.push(openEditorCommand);

        // 2. Create a custom UI ViewProvider for the right panel
        const scratchpadSidebarProvider: ViewProvider = {
            id: 'tools.scratchpad.sidebarView',
            name: 'Quick Notes',
            resolveView: (container, disposables) => {
                // Build the UI using standard DOM manipulation
                container.innerHTML = `
                    <div style="padding: 15px; display: flex; flex-direction: column; height: 100%; gap: 10px; color: var(--text-main); font-family: var(--font-ui);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h2 style="font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Quick Notes</h2>
                            <i id="clear-notes" class="fas fa-trash" style="cursor: pointer; font-size: 12px; color: var(--text-muted);" title="Clear Notes"></i>
                        </div>
                        <textarea id="scratchpad-textarea" style="flex: 1; resize: none; background-color: var(--bg-root); color: var(--text-main); border: 1px solid var(--border-color); padding: 8px; font-family: var(--font-code); border-radius: 3px;" placeholder="Jot down quick thoughts..."></textarea>
                    </div>
                `;

                // Add interactivity
                const textarea = container.querySelector('#scratchpad-textarea') as HTMLTextAreaElement;
                const clearBtn = container.querySelector('#clear-notes');

                // Basic persistence to localStorage
                const savedNote = localStorage.getItem('scratchpad-note');
                if (savedNote && textarea) {
                    textarea.value = savedNote;
                }

                if (textarea) {
                    textarea.addEventListener('input', () => {
                        localStorage.setItem('scratchpad-note', textarea.value);
                    });
                }

                if (clearBtn && textarea) {
                    clearBtn.addEventListener('click', () => {
                        textarea.value = '';
                        localStorage.removeItem('scratchpad-note');
                    });
                }
            }
        };

        // 3. Register the provider with the IDE in the 'right-panel' location
        context.ide.views.registerProvider('right-panel', scratchpadSidebarProvider);

        // Register a command to toggle the right panel view
        const toggleSidebarCommand = context.ide.commands.registerDisposable({
            id: 'scratchpad.toggleSidebar',
            label: 'Toggle Quick Notes Sidebar',
            handler: () => {
                context.ide.views.renderView('right-panel', scratchpadSidebarProvider.id);
                // The layout manager handles showing the panel if it's hidden
            }
        });
        context.subscriptions.push(toggleSidebarCommand);

        // 4. Add a top-level menu item to trigger our commands
        context.ide.layout.header.menuBar.addMenuItem({
            id: 'menu:scratchpad',
            label: 'Tools',
            items: [
                {
                    id: 'menu:scratchpad:editor',
                    label: 'Open Scratchpad File',
                    icon: 'fas fa-file-alt',
                    onClick: () => context.ide.commands.execute('scratchpad.openEditor')
                },
                {
                    id: 'menu:scratchpad:sidebar',
                    label: 'Toggle Quick Notes',
                    icon: 'fas fa-sticky-note',
                    onClick: () => context.ide.commands.execute('scratchpad.toggleSidebar')
                }
            ]
        });
    }
};