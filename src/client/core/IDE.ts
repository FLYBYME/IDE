import { LayoutManager } from './LayoutManager';
import { ApiService } from './ApiService';
import { CommandRegistry } from './CommandRegistry';
import { ExtensionManager } from './extensions/ExtensionManager';
import { ViewRegistry } from './extensions/ViewRegistry';
import { ActivityBarService } from './ActivityBarService';
import { TerminalService } from './TerminalService';
import { EditorManager } from './EditorManager';
import { MonacoService } from './MonacoService';
import { ShortcutManager } from './ShortcutManager';
import { ConfigurationRegistry } from './configuration/ConfigurationRegistry';
import { InlineEditWidget } from '../components/InlineEditWidget';
import { ConfigurationService } from './configuration/ConfigurationService';
import { WorkerFileSystemProvider } from './vfs/WorkerFileSystemProvider';
import { MonacoVFSBridge } from './vfs/MonacoVFSBridge';
import { DEMO_FILES } from './vfs/demoFiles';
import { NotificationService } from './NotificationService';
import { DialogService } from './DialogService';
import { ThemeService } from './ThemeService';
import { WorkspaceManager } from './WorkspaceManager';

export const IDEEvents = {
    APP_READY: 'ide:app_ready',
}

export class IDE {

    public layout: LayoutManager;
    public commands: CommandRegistry;
    public extensions: ExtensionManager;
    public views: ViewRegistry;
    public activityBar: ActivityBarService;
    public terminal: TerminalService;
    public editor: EditorManager;
    public monaco: MonacoService;
    public shortcuts: ShortcutManager;
    public configurationRegistry: ConfigurationRegistry;
    public settings: ConfigurationService;
    public vfs: WorkerFileSystemProvider;
    public vfsBridge: MonacoVFSBridge;
    public notifications!: NotificationService;
    public dialogs: DialogService;
    public theme: ThemeService;
    public api: ApiService;
    public activeWorkspace: { id: string; name: string } | null = null;
    public workspace: WorkspaceManager;
    private initialized: boolean = false;
    private stateSaveTimer: NodeJS.Timeout | null = null;

    constructor() {
        this.configurationRegistry = new ConfigurationRegistry();
        this.layout = new LayoutManager(this, document.getElementById('app')!);
        this.commands = new CommandRegistry(this);
        this.extensions = new ExtensionManager(this);
        this.views = new ViewRegistry(this);
        this.activityBar = new ActivityBarService(this); // Instantiated
        this.terminal = new TerminalService(this);
        this.editor = new EditorManager(this);
        this.monaco = new MonacoService(this);
        this.shortcuts = new ShortcutManager(this);
        this.settings = new ConfigurationService(this, this.configurationRegistry);
        this.vfs = new WorkerFileSystemProvider();
        this.vfsBridge = new MonacoVFSBridge(this.vfs, this);
        this.dialogs = new DialogService();
        this.theme = new ThemeService(this);
        this.api = new ApiService();
        this.workspace = new WorkspaceManager(this);
    }

    private setupStateSyncing(): void {
        const triggerSave = () => {
            if (!this.activeWorkspace) return;
            if (this.stateSaveTimer) clearTimeout(this.stateSaveTimer);

            // Debounce saves by 2 seconds
            this.stateSaveTimer = setTimeout(() => {
                this.saveWorkspaceState().catch(err =>
                    console.warn('Failed to auto-save workspace state', err)
                );
            }, 2000);
        };

        // Listen to tab events
        import('./EditorManager').then(({ EditorEvents }) => {
            this.commands.on(EditorEvents.EDITOR_TAB_OPENED, triggerSave);
            this.commands.on(EditorEvents.EDITOR_TAB_CLOSED, triggerSave);
            this.commands.on(EditorEvents.EDITOR_ACTIVE_CHANGED, triggerSave);
        });

        // Listen to cursor movement events from Monaco
        this.commands.on('monaco.cursor.moved', triggerSave);
    }

    public async initialize(): Promise<void> {
        if (this.initialized) return;

        // Notification service must be created after layout builds the status bar
        this.notifications = new NotificationService(this.layout.statusBar);
        this.notifications.setStatusMessage('Initializing...');

        try {
            this.layout.buildStructure();
            this.layout.initialize();

            // Register core settings before UI and extensions
            this.registerCoreSettings();

            // Connect to SSE
            this.api.connectSSE();

            this.initializeUI();
            this.setupStateSyncing();

            this.workspace.initialize();

            // Mount the editor into the center panel
            const centerPanel = document.getElementById('center-panel');
            if (centerPanel) {
                this.editor.mount(centerPanel);
            }

            // Open a welcome tab (content provided by WorkspaceExtension)
            this.editor.openTab({
                id: 'welcome',
                title: 'Welcome',
                icon: 'fas fa-home'
            });

            // VFS initialized (files will be populated when a workspace is loaded)

            // Initialize extensions after the core UI is ready
            await this.extensions.activateAll();

            this.initialized = true;
            this.commands.emit(IDEEvents.APP_READY, { timestamp: Date.now() });

            this.notifications.notify({
                message: 'Successfully launched browser.',
                detail: 'The browser extension has connected to the active session and is ready for commands.',
                severity: 'success',
                source: { id: 'extension.browserLauncher', label: 'Browser Launcher' },
                progress: true,
                timeout: 8000,
                actions: [
                    { label: 'View Logs', action: () => console.log('Viewing logs...') },
                    { label: 'Configure', action: () => console.log('Configuring...'), isPrimary: true }
                ]
            });

        } catch (error) {
            console.error('❌ Failed to initialize IDE:', error);
            throw error;
        }
    }

    public async saveWorkspaceState(): Promise<void> {
        if (!this.activeWorkspace) return;

        const tabsToSave: Array<{ path: string, cursorLine: number, cursorColumn: number, scrollTop: number }> = [];
        let activeTabPath: string | undefined = undefined;

        const activeId = this.editor.getActiveTabId();

        // Get all tabs
        const state = this.editor.getState();
        for (const group of state.groups) {
            for (const tabId of group.tabOrder) {
                let cursorLine = 1;
                let cursorColumn = 1;
                let scrollTop = 0;

                const monacoEditor = this.monaco.getEditor(tabId);
                if (monacoEditor) {
                    const pos = monacoEditor.getPosition();
                    if (pos) {
                        cursorLine = pos.lineNumber;
                        cursorColumn = pos.column;
                    }
                    scrollTop = monacoEditor.getScrollTop();
                }

                tabsToSave.push({
                    path: tabId,
                    cursorLine,
                    cursorColumn,
                    scrollTop
                });

                if (tabId === activeId) {
                    activeTabPath = tabId;
                }
            }
        }

        try {
            await this.api.saveEditorState(this.activeWorkspace.id, tabsToSave, activeTabPath);
        } catch (err) {
            console.error('Failed to save editor state:', err);
        }
    }

    /**
     * Load a workspace from the backend API into the local VFS.
     * Fetches the file tree, downloads each file's content, builds a
     * VirtualFolder tree, and re-initializes the VFS + Monaco bridge.
     */
    public async loadWorkspace(workspaceId: string, workspaceName: string): Promise<void> {
        this.notifications.setStatusMessage(`Loading workspace "${workspaceName}"…`);

        // Save state of current workspace before switching
        await this.saveWorkspaceState();

        // Clear current editors
        this.editor.closeAllTabs();

        try {
            // 1. Fetch the flat file/folder listing from the backend
            const data = await this.api.listFiles(workspaceId, '/');
            const entries: Array<{ name: string; type: 'file' | 'folder'; path: string }> = data.entries || [];

            // 2. Fetch content for every file entry
            const fileContents = new Map<string, { content: string; language: string }>();
            const fileEntries = entries.filter((e: any) => e.type === 'file');
            await Promise.all(
                fileEntries.map(async (entry: any) => {
                    try {
                        const file = await this.api.getFile(workspaceId, entry.path);
                        fileContents.set(entry.path, {
                            content: file.content,
                            language: file.language || 'text',
                        });
                    } catch {
                        // Skip files that fail to download
                    }
                })
            );

            // 3. Build VirtualFolder tree from flat entries
            const root: import('./vfs/WorkerFileSystemProvider').VirtualFolder = {
                name: workspaceName,
                type: 'folder',
                expanded: true,
                children: [],
            };

            // Helper to find or create a folder at a given path
            const ensureFolder = (
                parts: string[],
                parent: import('./vfs/WorkerFileSystemProvider').VirtualFolder
            ): import('./vfs/WorkerFileSystemProvider').VirtualFolder => {
                let current = parent;
                for (const part of parts) {
                    let child = current.children.find(
                        (c) => c.name === part && c.type === 'folder'
                    ) as import('./vfs/WorkerFileSystemProvider').VirtualFolder | undefined;
                    if (!child) {
                        child = { name: part, type: 'folder', children: [] };
                        current.children.push(child);
                    }
                    current = child;
                }
                return current;
            };

            for (const entry of entries) {
                // Path from the API looks like "/src/index.ts" – strip leading slash
                const cleanPath = entry.path.replace(/^\/+/, '');
                const parts = cleanPath.split('/');
                const fileName = parts.pop()!;
                const parentFolder = ensureFolder(parts, root);

                if (entry.type === 'file') {
                    const meta = fileContents.get(entry.path);
                    parentFolder.children.push({
                        name: fileName,
                        type: 'file',
                        content: meta?.content ?? '',
                        language: meta?.language ?? 'text',
                    });
                } else {
                    // Ensure the folder node exists
                    ensureFolder([fileName], parentFolder);
                }
            }

            // 4. Configure VFS & Re-initialize
            await this.vfs.configure({
                token: (this.api as any).token, // Access private token for the worker
                baseUrl: (this.api as any).baseUrl,
                workspaceId: workspaceId,
                rootName: workspaceName,
            });

            await this.vfs.initialize(root);
            await this.vfsBridge.syncProjectToMonaco(workspaceName);

            this.activeWorkspace = { id: workspaceId, name: workspaceName };
            this.commands.emit('workspace:loaded', { id: workspaceId, name: workspaceName });

            this.notifications.notify(
                `Workspace "${workspaceName}" loaded (${fileContents.size} files).`,
                'success',
                4000
            );

            // Re-render the file tree if the extension is active
            this.views.renderView('left-panel', 'core.fileTree.sidebar');

            // Restore editor state matching the backend
            try {
                const state = await this.api.getEditorState(workspaceId);
                if (state && Array.isArray(state.tabs)) {
                    // Open all previously opened tabs
                    for (const tab of state.tabs) {
                        const fileData = fileContents.get(tab.path);
                        if (fileData) {
                            const fileName = tab.path.split('/').pop() || tab.path;
                            this.editor.openFile(
                                tab.path,
                                fileName,
                                fileData.content,
                                fileData.language
                            );

                            // Restore cursor and scroll
                            const monacoEditor = this.monaco.getEditor(tab.path);
                            if (monacoEditor) {
                                monacoEditor.setPosition({
                                    lineNumber: tab.cursorLine || 1,
                                    column: tab.cursorColumn || 1
                                });
                                monacoEditor.setScrollTop(tab.scrollTop || 0);
                            }
                        }
                    }

                    // Activate the previously active tab
                    if (state.activeTabId) {
                        const activeTab = state.tabs.find((t: any) => t.id === state.activeTabId);
                        if (activeTab) {
                            this.editor.activateTab(activeTab.path);
                        }
                    }
                }
            } catch (err) {
                console.warn('Could not restore editor state:', err);
            }
        } catch (err: any) {
            this.notifications.notify(
                `Failed to load workspace: ${err.message}`,
                'error'
            );
            throw err;
        }
    }

    private initializeUI(): void {
        this.layout.header.menuBar.addMenuItem({
            id: 'file',
            label: 'File',
            items: [
                { id: 'file:new', label: 'New File', shortcut: 'Ctrl+N', onClick: () => this.commands.execute('file:new') },
                { id: 'file:open', label: 'Open File', shortcut: 'Ctrl+O', onClick: () => this.commands.execute('file:open') },
                { id: 'file:save', label: 'Save File', shortcut: 'Ctrl+S', onClick: () => this.commands.execute('file.save') },
                { id: 'file:save-as', label: 'Save As File', shortcut: 'Ctrl+Shift+S', onClick: () => this.commands.execute('file:save-as') },
            ]
        });

        this.commands.register({
            id: 'file:new',
            label: 'New File',
            keybinding: 'Ctrl+N',
            handler: async () => {
                const fileName = await this.dialogs.prompt('Enter file name:', {
                    title: 'New File',
                    placeholder: 'filename.ts'
                });

                if (!fileName) return;

                const path = fileName.startsWith('/') ? fileName : `/${fileName}`;

                try {
                    // Check if file already exists
                    try {
                        await this.vfs.stat(path);
                        this.notifications.notify(`File already exists: ${path}`, 'warning');
                        return;
                    } catch (e) {
                        // File doesn't exist, proceed
                    }

                    await this.vfs.writeFile(path, '');
                    const name = path.split('/').pop() || path;
                    const language = this.vfsBridge.detectLanguage(name) || 'text';

                    // Open the new file
                    this.editor.openFile(path, name, '', language);

                    this.notifications.notify(`Created: ${path}`, 'success', 3000);
                } catch (err: any) {
                    this.notifications.notify(`Failed to create file: ${err.message}`, 'error');
                }
            }
        });

        this.commands.register({
            id: 'ui.saveState',
            label: 'Save UI State',
            handler: (args: any) => {
                // Placeholder to prevent "command not found" error when LayoutManager saves
                // console.log('UI state saved:', args.state);
            },
        });

        this.layout.header.menuBar.addMenuItem({
            id: 'view',
            label: 'View',
            items: [
                { id: 'view:split-right', label: 'Split Editor Right', onClick: () => this.commands.execute('editor.splitRight') }
            ]
        });

        // Register default keybinding commands
        this.commands.register({
            id: 'file.save',
            label: 'Save File',
            keybinding: 'Ctrl+S',
            handler: async () => {
                const activeId = this.editor.getActiveTabId();
                if (activeId) {
                    const model = this.monaco.getModel(activeId);
                    if (model) {
                        try {
                            console.log('Saving file:', activeId);
                            await this.vfs.writeFile(activeId, model.getValue());
                            this.editor.setTabDirty(activeId, false);
                            this.notifications.notify(`Saved: ${activeId}`, 'success', 3000);
                        } catch (err) {
                            this.notifications.notify(`Failed to save ${activeId}`, 'error');
                        }
                    }
                }
            }
        });

        this.commands.register({
            id: 'file:open',
            label: 'Open File',
            keybinding: 'Ctrl+O',
            handler: async () => {
                try {
                    const files = await this.vfs.readDirectory('/');
                    const items = files.map(f => ({
                        id: f,
                        label: f.split('/').pop() || f,
                        description: f,
                        icon: 'fas fa-file'
                    }));

                    const selected = await this.dialogs.showQuickPick(items, {
                        placeholder: 'Select a file to open...'
                    });

                    if (selected) {
                        const content = await this.vfs.readFile(selected.id);
                        const name = selected.label;
                        const language = this.vfsBridge.detectLanguage(selected.id) || 'text';
                        this.editor.openFile(selected.id, name, content, language);
                    }
                } catch (err: any) {
                    this.notifications.notify(`Failed to list files: ${err.message}`, 'error');
                }
            }
        });

        this.commands.register({
            id: 'file:save-as',
            label: 'Save As File',
            keybinding: 'Ctrl+Shift+S',
            handler: async () => {
                const activeId = this.editor.getActiveTabId();
                if (!activeId) return;

                const model = this.monaco.getModel(activeId);
                if (!model) return;

                const fileName = await this.dialogs.prompt('Save as:', {
                    title: 'Save As',
                    defaultValue: activeId,
                    placeholder: 'new_filename.ts'
                });

                if (!fileName) return;

                const path = fileName.startsWith('/') ? fileName : `/${fileName}`;

                try {
                    await this.vfs.writeFile(path, model.getValue());
                    const name = path.split('/').pop() || path;
                    const language = this.vfsBridge.detectLanguage(name) || 'text';

                    this.editor.openFile(path, name, model.getValue(), language);
                    this.notifications.notify(`Saved as: ${path}`, 'success', 3000);
                } catch (err: any) {
                    this.notifications.notify(`Failed to save: ${err.message}`, 'error');
                }
            }
        });

        this.commands.register({
            id: 'file.close',
            label: 'Close Tab',
            keybinding: 'Ctrl+W',
            handler: () => {
                const activeId = this.editor.getActiveTabId();
                if (activeId) {
                    this.editor.closeTab(activeId);
                }
            }
        });

        this.commands.register({
            id: 'view.commandPalette',
            label: 'Command Palette',
            keybinding: 'Ctrl+Shift+P',
            handler: async () => {
                const items = [
                    { id: 'file:new', label: 'New File', icon: 'fas fa-file-alt', category: 'File' },
                    { id: 'file:open', label: 'Open File', icon: 'fas fa-folder-open', category: 'File' },
                    { id: 'file.save', label: 'Save File', icon: 'fas fa-save', category: 'File' },
                    { id: 'view:split-right', label: 'Split Editor Right', icon: 'fas fa-columns', category: 'View' },
                    { id: 'settings', label: 'Preferences: Open Settings', icon: 'fas fa-cog', category: 'Preferences' }
                ];

                const selected = await this.dialogs.showQuickPick(items, {
                    placeholder: 'Type a command...',
                    matchOnDescription: true
                });

                if (selected) {
                    if (selected.id === 'settings') {
                        // Special case - assuming there's an event or command for settings
                        this.commands.emit('ide:open_settings', {});
                    } else {
                        this.commands.execute(selected.id);
                    }
                }
            }
        });

        this.commands.register({
            id: 'agent.inlineEdit',
            label: 'Inline AI Edit',
            category: 'Agent',
            keybinding: 'Ctrl+K',
            when: () => !!this.editor.getActiveTabId(),
            handler: () => {
                const activeId = this.editor.getActiveTabId();
                if (!activeId) return;

                const editor = this.monaco.getEditor(activeId);
                if (!editor) return;

                const position = editor.getPosition();
                const lineNumber = position ? position.lineNumber : 1;

                new InlineEditWidget({
                    ide: this,
                    editorId: activeId,
                    lineNumber,
                    onSubmit: async (prompt, context) => {
                        this.notifications.notify(`AI Edit: "${prompt}"`, 'info', 3000);
                        // TODO: LLM integration - use prompt + context to generate edits
                        console.log('[InlineEdit] Prompt:', prompt);
                        console.log('[InlineEdit] Context:', context);
                    },
                });
            }
        });

        // UI modules & shortcuts initialized (no user-facing log needed)
    }

    private registerCoreSettings(): void {
        this.configurationRegistry.registerConfiguration({
            id: 'editor',
            title: 'Editor',
            properties: {
                'editor.fontSize': {
                    type: 'number',
                    default: 14,
                    description: 'Controls the font size in pixels.',
                },
                'editor.wordWrap': {
                    type: 'boolean',
                    default: false,
                    description: 'Controls how lines should wrap.',
                },
                'editor.theme': {
                    type: 'enum',
                    default: 'ide-dark',
                    enum: ['ide-dark', 'vs-dark', 'vs-light', 'hc-black'],
                    description: 'The color theme for the editor.',
                },
                'editor.minimap': {
                    type: 'boolean',
                    default: true,
                    description: 'Controls whether the minimap is shown.',
                },
                'editor.lineNumbers': {
                    type: 'boolean',
                    default: true,
                    description: 'Controls the display of line numbers.',
                },
            },
        });

        this.configurationRegistry.registerConfiguration({
            id: 'files',
            title: 'Files',
            properties: {
                'files.autoSave': {
                    type: 'enum',
                    default: 'off',
                    enum: ['off', 'afterDelay', 'onFocusChange'],
                    description: 'Controls auto save of editors.',
                },
                'files.autoSaveDelay': {
                    type: 'number',
                    default: 1000,
                    description: 'Controls the delay in ms after which an auto save is triggered.',
                },
            },
        });

        this.configurationRegistry.registerConfiguration({
            id: 'terminal',
            title: 'Terminal',
            properties: {
                'terminal.fontSize': {
                    type: 'number',
                    default: 13,
                    description: 'Controls the font size of the terminal in pixels.',
                },
                'terminal.cursorStyle': {
                    type: 'enum',
                    default: 'block',
                    enum: ['block', 'underline', 'line'],
                    description: 'Controls the style of the terminal cursor.',
                },
            },
        });

        // Core settings registered
    }
}
