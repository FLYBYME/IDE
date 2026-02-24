import { LayoutManager } from './LayoutManager';
import { CommandRegistry } from './CommandRegistry';
import { ExtensionManager } from './extensions/ExtensionManager';
import { ViewRegistry } from './extensions/ViewRegistry';
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

export const IDEEvents = {
    APP_READY: 'ide:app_ready',
}

export class IDE {

    public layout: LayoutManager;
    public commands: CommandRegistry;
    public extensions: ExtensionManager;
    public views: ViewRegistry;
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
    private initialized: boolean = false;

    constructor() {
        this.configurationRegistry = new ConfigurationRegistry();
        this.layout = new LayoutManager(this, document.getElementById('app')!);
        this.commands = new CommandRegistry(this);
        this.extensions = new ExtensionManager(this);
        this.views = new ViewRegistry(this);
        this.editor = new EditorManager(this);
        this.monaco = new MonacoService(this);
        this.shortcuts = new ShortcutManager(this);
        this.settings = new ConfigurationService(this, this.configurationRegistry);
        this.vfs = new WorkerFileSystemProvider();
        this.vfsBridge = new MonacoVFSBridge(this.vfs);
        this.dialogs = new DialogService();
        this.theme = new ThemeService(this);
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

            this.initializeUI();

            // Mount the editor into the center panel
            const centerPanel = document.getElementById('center-panel');
            if (centerPanel) {
                this.editor.mount(centerPanel);
            }

            // Open a welcome tab
            this.editor.openTab({
                id: 'welcome',
                title: 'Welcome',
                icon: 'fas fa-home',
            });
            const welcomePanel = this.editor.getContentPanel('welcome');
            if (welcomePanel) {
                welcomePanel.innerHTML = `
                    <div style="padding: 40px; color: var(--text-muted); font-family: var(--font-ui); text-align: center;">
                        <h1 style="font-size: 24px; color: var(--text-main); margin-bottom: 10px;">Welcome to CanvasLLM IDE</h1>
                        <p style="font-size: 14px;">Open a file or use an extension to get started.</p>
                    </div>
                `;
            }

            // Initialize VFS with demo data and sync to Monaco
            await this.vfs.initialize(DEMO_FILES);
            await this.vfsBridge.syncProjectToMonaco(DEMO_FILES.name);

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
