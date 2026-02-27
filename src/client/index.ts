/**
 * CanvasLLM IDE - Entry Point
 * Initializes all IDE components and services
 */

import { IDE } from './core/IDE';
//import { FileTreeExtension } from './extensions/FileTreeExtension';
import { ProjectScaffolderExtension } from './extensions/ProjectScaffolderExtension';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as monaco from 'monaco-editor';

// Import styles
import './css/main.css';
import './css/layout.css';
import './css/filetree.css';
import './css/settings.css';
import './css/dialog.css';
import './css/inline-edit.css';
import './css/sourcecontrol.css';
import './css/container-build.css';

//import * as Core from './core';


// Expose dependencies to the global window object for dynamically loaded extensions
declare global {
    interface Window {
        __IDE_REACT__: typeof React;
        __IDE_REACT_DOM__: typeof ReactDOM;
        __IDE_MONACO__: typeof monaco;
        //__IDE_CORE__: typeof Core;
    }
}

window.__IDE_REACT__ = React;
window.__IDE_REACT_DOM__ = ReactDOM;
window.__IDE_MONACO__ = monaco;
//window.__IDE_CORE__ = Core;


/**
 * Main application initialization
 */
async function initializeApp(): Promise<void> {
    try {
        const ide = new IDE();

        // Register extensions before initializing
        // ide.extensions.register(FileTreeExtension);
        ide.extensions.register(ProjectScaffolderExtension);

        await ide.initialize();
        hideLoadingScreen();
    } catch (error) {
        hideLoadingScreen(); // Hide it even on error so user can see error screen
        console.error('❌ Failed to initialize application:', error);
        showErrorScreen(error as Error);
    }
}

/**
 * Hide loading screen with fade effect
 */
function hideLoadingScreen(): void {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500); // Match transition duration
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
