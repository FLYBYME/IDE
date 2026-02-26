// This is a proxy module served to dynamically loaded extensions.
// In index.ts, we attach core exports to window.__IDE_CORE__.

const core = window.__IDE_CORE__;

// Re-export everything from the core object
export const {
    IDE,
    IDEEvents,
    ExtensionManager,
    ViewRegistry,
    CommandRegistry,
    ConfigurationRegistry,
    ApiService,
    NotificationService,
    DialogService,
    ThemeService,
    WorkspaceManager,
    TerminalService,
    EditorManager,
    EditorEvents,
    ActivityBarService
} = core;

export default core;

