/**
 * CanvasLLM - Core Public API
 * This file serves as the unified entry point for extensions to import core functionality.
 */

// Export the main IDE class
export { IDE, IDEEvents } from './core/IDE';

// Export Extension interfaces and types
export { Extension, ExtensionContext } from './core/extensions/Extension';
export { ViewProvider, ViewLocation } from './core/extensions/ViewProvider';

// Export Registry interfaces for registering custom logic
export { CommandRegistry } from './core/CommandRegistry';
export { ConfigurationRegistry, ConfigurationNode, ConfigurationProperty } from './core/configuration/ConfigurationRegistry';
export { ViewRegistry } from './core/extensions/ViewRegistry';

// Export Services that extensions might want to interact with
export { ApiService } from './core/ApiService';
export { NotificationService } from './core/NotificationService';
export { DialogService } from './core/DialogService';
export { ThemeService } from './core/ThemeService';
export { WorkspaceManager } from './core/WorkspaceManager';
export { TerminalService } from './core/TerminalService';
export { EditorManager, EditorEvents } from './core/EditorManager';
export { ActivityBarService } from './core/ActivityBarService';

// Export VFS related types
export { FileSystemProvider, FileStat } from './core/vfs/FileSystemProvider';

