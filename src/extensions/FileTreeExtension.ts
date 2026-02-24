/**
 * FileTreeExtension - Provides a file explorer in the left sidebar.
 * Reads from the VFS (FileSystemProvider) and opens files via Monaco Editor.
 */

import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';

// -------------------------------------------------------------------
// Helper: map file extension to icon
// -------------------------------------------------------------------
function getFileIcon(filename: string): { iconClass: string; colorClass: string } {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
        case 'ts':
        case 'tsx':
            return { iconClass: 'fab fa-js', colorClass: 'ts-icon' };
        case 'js':
        case 'jsx':
            return { iconClass: 'fab fa-js', colorClass: 'js-icon' };
        case 'css':
            return { iconClass: 'fab fa-css3-alt', colorClass: 'css-icon' };
        case 'html':
            return { iconClass: 'fab fa-html5', colorClass: 'html-icon' };
        case 'json':
            return { iconClass: 'fas fa-cog', colorClass: 'json-icon' };
        case 'md':
            return { iconClass: 'fas fa-file-alt', colorClass: 'file-icon' };
        default:
            return { iconClass: 'fas fa-file', colorClass: 'file-icon' };
    }
}

/**
 * Detect language identifier from file extension.
 */
function detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'css':
            return 'css';
        case 'html':
            return 'html';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        default:
            return 'plaintext';
    }
}

/**
 * Represents a node in the locally reconstructed tree (built from VFS paths).
 */
interface TreeNode {
    name: string;
    fullPath: string;
    type: 'file' | 'directory';
    children: TreeNode[];
}

/**
 * Build a tree structure from a flat list of file paths.
 */
function buildTree(filePaths: string[], rootName: string): TreeNode {
    const root: TreeNode = { name: rootName, fullPath: rootName, type: 'directory', children: [] };

    for (const filePath of filePaths) {
        // Remove the root prefix to get relative parts
        const relative = filePath.startsWith(rootName + '/')
            ? filePath.slice(rootName.length + 1)
            : filePath;
        const parts = relative.split('/');
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;
            const currentFullPath = current.fullPath + '/' + part;

            let child = current.children.find(c => c.name === part);
            if (!child) {
                child = {
                    name: part,
                    fullPath: currentFullPath,
                    type: isLast ? 'file' : 'directory',
                    children: [],
                };
                current.children.push(child);
            }
            current = child;
        }
    }

    return root;
}

// -------------------------------------------------------------------
// Extension
// -------------------------------------------------------------------
export const FileTreeExtension: Extension = {
    id: 'core.fileTree',
    name: 'File Explorer',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        let selectedNode: HTMLElement | null = null;

        const fileTreeProvider: ViewProvider = {
            id: 'core.fileTree.sidebar',
            name: 'Explorer',
            resolveView: (container) => {
                container.innerHTML = '';
                const tree = document.createElement('div');
                tree.className = 'file-tree';

                const header = document.createElement('div');
                header.className = 'file-tree-header';
                header.textContent = 'Explorer';
                tree.appendChild(header);

                // Load tree from VFS asynchronously
                const vfs = context.ide.vfs;
                const rootName = 'my-project';

                vfs.readDirectory(rootName).then(async (filePaths) => {
                    const treeRoot = buildTree(filePaths, rootName);

                    function attachContextMenu(node: TreeNode, el: HTMLElement): void {
                        el.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const items: ContextMenuItem[] = [
                                {
                                    label: 'Rename',
                                    icon: 'fas fa-edit',
                                    action: async () => {
                                        const validator = (value: string) => {
                                            value = value.trim();
                                            if (!value) return 'Name cannot be empty.';
                                            if (/[/\\?]/.test(value)) return 'Name cannot contain /, \\, or ?';

                                            const parts = node.fullPath.split('/');
                                            parts.pop();
                                            const parentPath = parts.length > 0 ? parts.join('/') + '/' : '';
                                            const newPath = parentPath + value;

                                            if (filePaths.includes(newPath) && newPath !== node.fullPath) {
                                                return 'A file or folder with this name already exists.';
                                            }
                                            return null;
                                        };

                                        const newName = await context.ide.dialogs.prompt(`Rename ${node.name} to:`, {
                                            title: 'Rename',
                                            defaultValue: node.name,
                                            validateInput: validator
                                        });
                                        if (newName && newName !== node.name) {
                                            const parts = node.fullPath.split('/');
                                            parts.pop();
                                            const newPath = parts.length > 0 ? parts.join('/') + '/' + newName : newName;
                                            try {
                                                await vfs.rename(node.fullPath, newPath);
                                                context.ide.views.renderView('left-panel', fileTreeProvider.id);
                                            } catch (err) {
                                                context.ide.notifications.notify(`Failed to rename: ${err}`, 'error');
                                            }
                                        }
                                    }
                                },
                                {
                                    label: 'Delete',
                                    icon: 'fas fa-trash',
                                    action: async () => {
                                        const confirmed = await context.ide.dialogs.confirm(`Are you sure you want to delete ${node.name}?`, {
                                            title: 'Delete',
                                            isDestructive: true
                                        });
                                        if (confirmed) {
                                            try {
                                                await vfs.delete(node.fullPath);
                                                context.ide.views.renderView('left-panel', fileTreeProvider.id);
                                            } catch (err) {
                                                context.ide.notifications.notify(`Failed to delete: ${err}`, 'error');
                                            }
                                        }
                                    }
                                }
                            ];

                            new ContextMenu(items, e.clientX, e.clientY);
                        });
                    }

                    // Render the tree recursively
                    function renderNode(node: TreeNode, parentEl: HTMLElement, depth: number): void {
                        const nodeEl = document.createElement('div');
                        nodeEl.className = 'tree-node';
                        nodeEl.style.paddingLeft = `${8 + depth * 16}px`;

                        if (node.type === 'directory') {
                            const expanded = depth < 2; // Auto-expand first two levels

                            // Chevron
                            const chevron = document.createElement('i');
                            chevron.className = `fas fa-chevron-right chevron${expanded ? ' expanded' : ''}`;
                            nodeEl.appendChild(chevron);

                            // Folder icon
                            const icon = document.createElement('i');
                            icon.className = `fas fa-folder${expanded ? '-open' : ''} tree-icon folder-icon`;
                            nodeEl.appendChild(icon);

                            // Label
                            const label = document.createElement('span');
                            label.className = 'tree-label';
                            label.textContent = node.name;
                            nodeEl.appendChild(label);

                            attachContextMenu(node, nodeEl);

                            parentEl.appendChild(nodeEl);

                            // Children container
                            const childContainer = document.createElement('div');
                            childContainer.className = 'tree-children';
                            childContainer.style.display = expanded ? 'block' : 'none';

                            // Sort: folders first, then files, alphabetically within each
                            const sorted = [...node.children].sort((a, b) => {
                                if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
                                return a.name.localeCompare(b.name);
                            });
                            sorted.forEach(child => renderNode(child, childContainer, depth + 1));

                            parentEl.appendChild(childContainer);

                            // Toggle expand/collapse
                            nodeEl.addEventListener('click', () => {
                                const isExpanded = childContainer.style.display !== 'none';
                                childContainer.style.display = isExpanded ? 'none' : 'block';
                                chevron.classList.toggle('expanded', !isExpanded);
                                icon.className = `fas fa-folder${!isExpanded ? '-open' : ''} tree-icon folder-icon`;
                            });
                        } else {
                            const { iconClass, colorClass } = getFileIcon(node.name);

                            // Spacer (align with folder chevrons)
                            const spacer = document.createElement('span');
                            spacer.className = 'chevron';
                            spacer.style.visibility = 'hidden';
                            nodeEl.appendChild(spacer);

                            // File icon
                            const icon = document.createElement('i');
                            icon.className = `${iconClass} tree-icon file-icon ${colorClass}`;
                            nodeEl.appendChild(icon);

                            // Label
                            const label = document.createElement('span');
                            label.className = 'tree-label';
                            label.textContent = node.name;
                            nodeEl.appendChild(label);

                            attachContextMenu(node, nodeEl);

                            parentEl.appendChild(nodeEl);

                            // Open file on click — read content from VFS
                            nodeEl.addEventListener('click', async () => {
                                // Highlight selection
                                if (selectedNode) selectedNode.classList.remove('selected');
                                nodeEl.classList.add('selected');
                                selectedNode = nodeEl;

                                try {
                                    const content = await vfs.readFile(node.fullPath);
                                    const language = detectLanguage(node.name);

                                    // Open in editor via EditorManager
                                    context.ide.editor.openFile(
                                        node.fullPath,
                                        node.name,
                                        content,
                                        language,
                                        iconClass,
                                    );
                                } catch (err) {
                                    console.error(`Failed to read file: ${node.fullPath}`, err);
                                }
                            });
                        }
                    }

                    // Render root children (skip the root folder itself)
                    const sorted = [...treeRoot.children].sort((a, b) => {
                        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
                        return a.name.localeCompare(b.name);
                    });
                    sorted.forEach(child => renderNode(child, tree, 0));
                }).catch(err => {
                    console.error('Failed to load file tree from VFS:', err);
                    const errorEl = document.createElement('div');
                    errorEl.style.padding = '16px';
                    errorEl.style.color = '#f44336';
                    errorEl.textContent = 'Failed to load file tree';
                    tree.appendChild(errorEl);
                });

                container.appendChild(tree);
            }
        };

        // Register in left-panel
        context.ide.views.registerProvider('left-panel', fileTreeProvider);

        // Auto-render immediately
        context.ide.views.renderView('left-panel', fileTreeProvider.id);

        // Add an activity bar icon for the explorer
        const activityBar = document.querySelector('.activity-bar');
        if (activityBar) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-copy active'; // Files icon, active by default
            icon.title = 'Explorer';
            icon.style.cursor = 'pointer';

            icon.addEventListener('click', () => {
                context.ide.views.renderView('left-panel', fileTreeProvider.id);
                document.querySelectorAll('.activity-bar i').forEach(el => el.classList.remove('active'));
                icon.classList.add('active');
            });

            // Insert at the top of the activity bar (before HelloWorld plug icon)
            activityBar.insertBefore(icon, activityBar.firstChild);
        }
    }
};
