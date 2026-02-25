/**
 * MonacoVFSBridge - Syncs the VFS to Monaco editor models.
 *
 * For cross-file imports to work (e.g., `import { App } from './app'`),
 * Monaco needs a text model for every TypeScript file in the project,
 * even those not currently open in an editor tab.
 */

import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';
import { FileSystemProvider } from './FileSystemProvider';
import { IDE } from '../IDE';

export class MonacoVFSBridge {
    private vfs: FileSystemProvider;
    private ide: IDE;

    constructor(vfs: FileSystemProvider, ide: IDE) {
        this.vfs = vfs;
        this.ide = ide;

        // Keep models up-to-date when files change externally
        this.vfs.onDidChangeFile((event) => {
            if (event.type === 'delete') {
                const prefix = monaco.Uri.file(event.path).toString();
                const models = monaco.editor.getModels();
                for (const model of models) {
                    const modelUri = model.uri.toString();
                    if (modelUri === prefix || modelUri.startsWith(prefix + '/')) {
                        model.dispose();
                    }
                }
                return;
            }

            if (event.type === 'rename') {
                const oldPrefix = monaco.Uri.file(event.oldPath!).toString();
                const newPrefix = monaco.Uri.file(event.path).toString();

                const models = monaco.editor.getModels();
                for (const model of models) {
                    const modelUri = model.uri.toString();
                    if (modelUri === oldPrefix || modelUri.startsWith(oldPrefix + '/')) {
                        const content = model.getValue();
                        // Compute new URI string
                        const newUriStr = newPrefix + modelUri.substring(oldPrefix.length);
                        const newUri = monaco.Uri.parse(newUriStr);

                        model.dispose();

                        const language = this.detectLanguage(newUriStr);
                        if (language) {
                            monaco.editor.createModel(content, language, newUri);
                        }
                    }
                }
                return;
            }

            if (event.type === 'change') {
                const uri = monaco.Uri.file(event.path);
                const model = monaco.editor.getModel(uri);
                if (model) {
                    // Only update if the content actually differs
                    if (event.content !== undefined && model.getValue() !== event.content) {
                        if (event.remoteSync) {
                            // Check if the user has unsaved changes in this specific file
                            const isDirty = this.ide.editor.getState().groups.some(
                                g => g.tabs[event.path]?.isDirty
                            );

                            if (isDirty) {
                                // 🚨 CONFLICT DETECTED!
                                // Do NOT overwrite. Prompt the user instead.
                                this.handleConflict(event.path, model.getValue(), event.content);
                            } else {
                                // For remote syncs, use pushEditOperations so Monaco treats it as an
                                // "external" change that doesn't mark the tab as dirty.
                                model.pushEditOperations(
                                    [],
                                    [{
                                        range: model.getFullModelRange(),
                                        text: event.content,
                                    }],
                                    () => null
                                );
                            }
                        } else {
                            model.setValue(event.content);
                        }
                    }
                } else if (event.content !== undefined) {
                    // New file — create a background model
                    const language = this.detectLanguage(event.path);
                    if (language) {
                        monaco.editor.createModel(event.content, language, uri);
                    }
                }
            }
        });
    }

    private async handleConflict(filePath: string, localContent: string, remoteContent: string) {
        // 1. Notify the user
        this.ide.notifications.notify(
            `Remote changes detected in ${filePath}.`,
            'warning'
        );

        const action = await this.ide.dialogs.showQuickPick([
            { id: 'diff', label: 'Compare (Diff View)', icon: 'fas fa-columns' },
            { id: 'overwrite_local', label: 'Accept Remote (Discard my changes)', icon: 'fas fa-download', category: 'Danger Zone' },
            { id: 'ignore', label: 'Keep Local (Ignore remote)', icon: 'fas fa-times' }
        ], { title: 'File Conflict Detected', placeholder: 'Choose how to resolve...' });

        if (!action || action.id === 'ignore') return;

        if (action.id === 'overwrite_local') {
            const model = monaco.editor.getModel(monaco.Uri.file(filePath));
            if (model) {
                model.pushEditOperations([], [{ range: model.getFullModelRange(), text: remoteContent }], () => null);
                this.ide.editor.setTabDirty(filePath, false);
            }
        } else if (action.id === 'diff') {
            this.openDiffEditor(filePath, remoteContent, localContent);
        }
    }

    private openDiffEditor(filePath: string, remoteContent: string, localContent: string) {
        const diffTabId = `diff://${filePath}`;

        // 1. Open a new tab in the editor grid
        this.ide.editor.openTab({
            id: diffTabId,
            title: `Diff: ${filePath.split('/').pop()}`,
            icon: 'fas fa-exchange-alt'
        });

        const container = this.ide.editor.getContentPanel(diffTabId);
        if (!container) return;

        container.style.overflow = 'hidden';
        container.style.position = 'relative';

        // 2. Create the Monaco Diff Editor
        const diffEditor = monaco.editor.createDiffEditor(container, {
            theme: this.ide.settings.get('editor.theme') || 'ide-dark',
            automaticLayout: true,
            renderSideBySide: true, // Side-by-side diff
        });

        // 3. Set the Original (Remote) and Modified (Local) models
        const originalModel = monaco.editor.createModel(remoteContent, this.detectLanguage(filePath) || 'text');
        const modifiedModel = monaco.editor.getModel(monaco.Uri.file(filePath))!; // Use the active local model

        diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel
        });
    }

    /**
     * Sync all project files to Monaco as background models.
     * Call this when a project loads, before extensions activate.
     */
    public async syncProjectToMonaco(rootPath: string): Promise<void> {
        const files = await this.vfs.readDirectory(rootPath);

        for (const filePath of files) {
            const language = this.detectLanguage(filePath);
            if (!language) continue;

            const uri = monaco.Uri.file(filePath);
            if (monaco.editor.getModel(uri)) continue; // already exists

            const content = await this.vfs.readFile(filePath);
            monaco.editor.createModel(content, language, uri);
        }

        console.log(`📦 MonacoVFSBridge: Synced ${files.length} files to Monaco`);
    }

    /**
     * Detect Monaco language from file extension.
     * Returns null for files we don't want to create models for.
     */
    public detectLanguage(filePath: string): string | null {
        const ext = filePath.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'ts':
            case 'tsx':
                return 'typescript';
            case 'js':
            case 'jsx':
                return 'javascript';
            case 'json':
                return 'json';
            case 'css':
                return 'css';
            case 'html':
                return 'html';
            case 'md':
                return 'markdown';
            default:
                return null;
        }
    }

    /**
     * Dispose all background models created by the bridge.
     */
    public dispose(): void {
        // Monaco's getModels returns all models; we dispose them all
        // In a real app you'd track which ones the bridge created
        monaco.editor.getModels().forEach((model) => {
            model.dispose();
        });
    }
}
