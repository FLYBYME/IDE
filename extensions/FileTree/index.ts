import { Extension, ExtensionContext } from 'ide-core';
import { FileTreeState } from './FileTreeState';
import { FileTreeView } from './FileTreeView';
import * as uiLib from 'ide-core';

export const FileTreeExtension: Extension = {
    id: 'core.fileTree',
    name: 'File Explorer',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        const state = new FileTreeState();

        const view = new FileTreeView({
            onRefresh: () => renderLogic(),
            onNewFile: () => {
                context.ide.notifications.notify('New File');
                context.ide.editor.openTab({ id: 'new.ts', title: 'New File' })
            },
            onToggleFolder: (path) => {
                const expanded = state.getState().expandedPaths;
                expanded.has(path) ? expanded.delete(path) : expanded.add(path);
                state.update({ expandedPaths: expanded });
                renderLogic();
            },
            onFileSelected: async (path, name) => {
                //const content = await context.ide.vfs.readFile(path);
                //context.ide.editor.openFile(path, name, content, 'typescript');
            },
            onContextMenu: (e, node) => {
                new uiLib.ContextMenu([
                    { label: 'Rename', icon: 'fas fa-edit', action: () => {/* Logic */ } },
                    { label: 'Delete', icon: 'fas fa-trash', action: () => {/* Logic */ } }
                ], e.clientX, e.clientY).show(); // Overlays context menu [cite: 170, 172]
            }
        });

        // Bind State to View
        state.addListener((s) => view.update(s));

        async function renderLogic() {
            const paths = [{
                name: 'project',
                type: 'folder',
                children: [
                    {
                        name: 'src',
                        type: 'folder',
                        children: [
                            {
                                name: 'index.ts',
                                type: 'file'
                            }
                        ]
                    }
                ]
            }]
            // ... Tree building logic ...
            state.update({ visibleNodes: [] /* mapped nodes */ });
        }

        const provider: uiLib.ViewProvider = {
            id: 'core.fileTree.sidebar',
            name: 'Explorer',
            resolveView: (container, disposables) => {
                view.mount(container); // Automatic lifecycle management [cite: 6]
                renderLogic();
            }
        };

        context.ide.views.registerProvider('left-panel', provider);
        context.ide.activityBar.registerItem({
            id: provider.id,
            location: 'left-panel',
            icon: 'fas fa-copy',
            title: 'Explorer'
        });
    }
};