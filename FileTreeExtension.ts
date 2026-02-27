/**
 * FileTreeExtension - Provides a file explorer in the left sidebar.
 * Refactored to use ui-lib components (VirtualList, TreeItem, Toolbar, etc.)
 */

import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

import * as uiLib from '../ui-lib';

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
 * Represents a flattened node specifically for rendering in the VirtualList
 */
interface FlatNode {
    node: TreeNode;
    depth: number;
}

/**
 * Build a tree structure from a flat list of file paths.
 */
function buildTree(filePaths: string[], rootName: string): TreeNode {
    const root: TreeNode = { name: rootName, fullPath: rootName, type: 'directory', children: [] };

    for (const filePath of filePaths) {
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
        let activeContainer: HTMLElement | null = null;
        let currentRootNode: TreeNode | null = null;
        let currentFilePaths: string[] = [];

        // Track UI state
        let expandedPaths = new Set<string>();
        let selectedPath: string | null = null;

        // Helper to flatten the tree for the VirtualList based on expanded state
        const getVisibleNodes = (root: TreeNode): FlatNode[] => {
            const result: FlatNode[] = [];

            // Sort folders first, then files
            const sorted = [...root.children].sort((a, b) => {
                if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
                return a.name.localeCompare(b.name);
            });

            const traverse = (nodes: TreeNode[], depth: number) => {
                for (const node of nodes) {
                    result.push({ node, depth });
                    // Only process children if this directory is expanded
                    if (node.type === 'directory' && expandedPaths.has(node.fullPath)) {
                        const sortedChildren = [...node.children].sort((a, b) => {
                            if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
                            return a.name.localeCompare(b.name);
                        });
                        traverse(sortedChildren, depth + 1);
                    }
                }
            };

            traverse(sorted, 0);
            return result;
        };

        const fileTreeProvider: ViewProvider = {
            id: 'core.fileTree.sidebar',
            name: 'Explorer',
            resolveView: (container, disposables) => {
                activeContainer = container;

                // 1. Setup the UI Shell
                const masterLayout = new uiLib.Column({ fill: true });

                const header = new uiLib.Toolbar({
                    children: [
                        new uiLib.Heading({ text: 'EXPLORER', level: 4, transform: 'uppercase' }),
                        new uiLib.Spacer(),
                        new uiLib.Button({
                            icon: 'fas fa-sync',
                            variant: 'ghost',
                            onClick: () => renderTree()
                        }),
                        new uiLib.Button({
                            icon: 'fas fa-plus',
                            variant: 'ghost',
                            onClick: () => context.ide.editor.openTab({
                                id: 'newfile.ts',             // Unique identifier (usually the file path)
                                title: 'New File',          // Display name (e.g., "main.ts")
                                icon: 'fas fa-file',          // FontAwesome class (e.g., "fab fa-js")
                                isDirty: false,      // True if there are unsaved changes
                                providerId: 'core.fileTree',    // If this is a custom extension view rather than a text file
                                isPinned: false
                            })
                        }),
                    ]
                });

                // 2. Setup the VirtualList
                const fileList = new uiLib.VirtualList<FlatNode>({
                    items: [],
                    itemHeight: 24, // Matches TreeItem height
                    height: '100%',
                    renderItem: (flatNode) => {
                        const { node, depth } = flatNode;
                        const isDir = node.type === 'directory';
                        const isExpanded = expandedPaths.has(node.fullPath);
                        const { iconClass, colorClass } = getFileIcon(node.name);

                        // Combine custom color class into the icon prop natively supported by TreeItem
                        const activeIcon = isDir
                            ? (isExpanded ? 'fas fa-folder-open folder-icon' : 'fas fa-folder folder-icon')
                            : `${iconClass} ${colorClass}`;

                        const treeItem = new uiLib.TreeItem({
                            label: node.name,
                            depth: depth,
                            icon: activeIcon,
                            hasChildren: isDir,
                            expanded: isExpanded,
                            selected: selectedPath === node.fullPath,
                            onToggle: (e) => {
                                if (isExpanded) expandedPaths.delete(node.fullPath);
                                else expandedPaths.add(node.fullPath);
                                updateList();
                            },
                            onClick: async (e) => {
                                selectedPath = node.fullPath;

                                if (isDir) {
                                    if (isExpanded) expandedPaths.delete(node.fullPath);
                                    else expandedPaths.add(node.fullPath);
                                    updateList();
                                } else {
                                    updateList(); // Re-render to show selection styling immediately
                                    try {
                                        const vfs = context.ide.vfs;
                                        const content = await vfs.readFile(node.fullPath);
                                        const language = detectLanguage(node.name);
                                        context.ide.editor.openFile(node.fullPath, node.name, content, language, iconClass);
                                    } catch (err) {
                                        console.error(`Failed to read file: ${node.fullPath}`, err);
                                    }
                                }
                            }
                        });

                        // 3. Attach standard Context Menu dynamically to the raw element
                        treeItem.getElement().addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const items: uiLib.ContextMenuItem[] = [
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

                                            if (currentFilePaths.includes(newPath) && newPath !== node.fullPath) {
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
                                                await context.ide.vfs.rename(node.fullPath, newPath);
                                                renderTree();
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
                                                await context.ide.vfs.delete(node.fullPath);
                                                renderTree();
                                            } catch (err) {
                                                context.ide.notifications.notify(`Failed to delete: ${err}`, 'error');
                                            }
                                        }
                                    }
                                }
                            ];

                            new uiLib.ContextMenu(items, e.clientX, e.clientY);
                        });

                        return treeItem;
                    }
                });

                // Wrap List to give it physical dimensions in the flex layout
                const listContainer = new uiLib.Column({
                    fill: true,
                    children: [fileList]
                });

                masterLayout.updateProps({ children: [header, listContainer] });
                masterLayout.mount(container);

                // --- Syncing Methods ---

                const updateList = () => {
                    if (currentRootNode) {
                        const visibleNodes = getVisibleNodes(currentRootNode);
                        fileList.setItems(visibleNodes);

                        // Force recalculation after prop update
                        requestAnimationFrame(() => {
                            fileList.getElement().dispatchEvent(new Event('scroll'));
                        });
                    }
                };

                const renderTree = async () => {
                    const vfs = context.ide.vfs;
                    const rootName = context.ide.activeWorkspace?.name || 'my-project';
                    try {
                        currentFilePaths = await vfs.readDirectory(rootName);
                        currentRootNode = buildTree(currentFilePaths, rootName);

                        // Auto-expand first two levels on initial load to match original functionality
                        if (expandedPaths.size === 0 && currentRootNode) {
                            const expandRecursive = (node: TreeNode, currentDepth: number) => {
                                if (currentDepth < 2 && node.type === 'directory') {
                                    expandedPaths.add(node.fullPath);
                                    node.children.forEach(c => expandRecursive(c, currentDepth + 1));
                                }
                            };
                            expandRecursive(currentRootNode, 0);
                        }

                        updateList();
                    } catch (err) {
                        console.error('Failed to load file tree from VFS:', err);
                        // Optional: You could update `fileList` to show an error item or mount a Text component
                    }
                };

                // Listeners
                const wsSub = context.ide.commands.on('workspace:loaded', renderTree);
                disposables.push({ dispose: () => context.ide.commands.off(wsSub) });

                const onFileChanged = () => renderTree();
                context.ide.vfs.onDidChangeFile(onFileChanged);

                // Initial render
                renderTree();
            },

            update: () => {
                // When requested by the IDE view manager
                const fileList = activeContainer?.querySelector('.virtual-list');
                if (fileList) {
                    fileList.dispatchEvent(new Event('scroll'));
                }
            }
        };

        // Register with the IDE Layout
        context.ide.views.registerProvider('left-panel', fileTreeProvider);
        context.ide.views.renderView('left-panel', fileTreeProvider.id);

        context.ide.activityBar.registerItem({
            id: fileTreeProvider.id,
            location: 'left-panel',
            icon: 'fas fa-copy',
            title: 'Explorer',
            order: 0
        });
    }
};