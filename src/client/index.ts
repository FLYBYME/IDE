/**
 * CanvasLLM IDE - Entry Point
 * Initializes all IDE components and services
 */

import { IDE } from './core/IDE';
import { HelloWorldExtension } from './extensions/HelloWorldExtension';
import { FileTreeExtension } from './extensions/FileTreeExtension';
import { ScratchpadExtension } from './extensions/ScratchpadExtension';
import { SettingsEditorExtension } from './extensions/SettingsEditorExtension';
import { SourceControlExtension } from './extensions/SourceControlExtension';
import { OutputExtension } from './extensions/OutputExtension';
import { ContainerBuildExtension } from './extensions/ContainerBuildExtension';
import { TerminalExtension } from './extensions/TerminalExtension';
import { ExtensionsManagerExtension } from './extensions/ExtensionsManagerExtension';
import { ExtensionBuilderExtension } from './extensions/ExtensionBuilderExtension';

// Import styles
import './css/main.css';
import './css/layout.css';
import './css/filetree.css';
import './css/notifications.css';
import './css/settings.css';
import './css/dialog.css';
import './css/inline-edit.css';
import './css/sourcecontrol.css';
import './css/container-build.css';

/**
 * Main application initialization
 */
async function initializeApp(): Promise<void> {
    try {
        const ide = new IDE();

        // Register extensions before initializing
        ide.extensions.register(FileTreeExtension);
        ide.extensions.register(HelloWorldExtension);
        ide.extensions.register(ScratchpadExtension);
        ide.extensions.register(SettingsEditorExtension);
        ide.extensions.register(SourceControlExtension);
        ide.extensions.register(OutputExtension);
        ide.extensions.register(TerminalExtension);
        ide.extensions.register(ContainerBuildExtension);
        ide.extensions.register(ExtensionsManagerExtension);
        ide.extensions.register(ExtensionBuilderExtension);

        await ide.initialize();
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        showErrorScreen(error as Error);
    }
}

/**
 * Show error screen if initialization fails
 */
function showErrorScreen(error: Error): void {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #1e1e1e; color: #fff;">
                <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: #f44336; margin-bottom: 20px;"></i>
                <h1 style="margin: 0 0 10px;">Failed to Initialize</h1>
                <p style="color: #888; margin: 0 0 20px;">${error.message}</p>
                <button onclick="location.reload()" style="background: #007acc; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                    Reload Application
                </button>
            </div>
        `;
    }
}

// Start when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
