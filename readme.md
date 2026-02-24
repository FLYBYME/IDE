# CanvasLLM IDE

CanvasLLM IDE is a VS Code-like integrated development environment built with TypeScript and modern web technologies. It provides a robust, extensible, and browser-ready code editing experience using Monaco Editor and a Web Worker-based Virtual File System.

## Features

* **Monaco Editor Integration:** Full Monaco Editor support, configured with TypeScript defaults for proper module resolution and syntax highlighting.
* **Split-Pane Layout & Tabs:** A resizable split-pane layout supporting multiple editor groups, drag-and-drop tab reordering, and dirty (unsaved) state indicators.
* **Virtual File System (VFS):** An in-memory file system powered by a Web Worker to keep the main thread unblocked. Includes a `MonacoVFSBridge` to sync the VFS to Monaco editor models for cross-file imports and IntelliSense.
* **Extensibility System:** A fully-fledged extension API allowing developers to register commands, menu items, and custom UI views (via `ViewProvider`) in various layout slots (Left, Right, Bottom, Center).
* **Theming Engine:** Dynamic CSS-variable-based theming that matches Monaco editor themes (e.g., `ide-dark`, `vs-dark`, `vs-light`, `hc-black`).
* **Global Command & Shortcut Registry:** Centralized command registration mapped to a global keyboard shortcut manager.
* **Custom UI Components:** Themed modal dialogs (replacing native prompt and confirm), toast notifications, context menus, and a functional status bar.

## Architecture Overview

The IDE is composed of several core managers and services initialized by a central `IDE` class:

* **`LayoutManager`**: Manages the DOM grid areas, panel resizing handles, and visibility of the header, workspace (sidebars, center editor), bottom panel, and status bar.
* **`EditorManager` & `EditorGrid`**: Central controller for the center panel tab system. Manages `EditorGroup` instances in a split-pane layout.
* **`EventBus`**: The central Pub/Sub system acting as the "nervous system" of the IDE for inter-component communication.
* **`CommandRegistry` & `ShortcutManager`**: Maps executable functions to command IDs and keyboard events, normalizing key combinations across platforms (e.g., treating macOS Meta as Ctrl).
* **`ConfigurationRegistry` & `ConfigurationService`**: The runtime settings engine and schema store. Manages user overrides, schema defaults, and emits configuration change events.

## Included Extensions

CanvasLLM IDE ships with a set of core extensions that demonstrate its API capabilities:

* **File Explorer (`FileTreeExtension`)**: Provides a file explorer in the left sidebar that reads from the VFS and opens files via Monaco Editor. Includes renaming and deletion capabilities.
* **Settings Editor (`SettingsEditorExtension`)**: A visual settings editor that opens as a center-panel tab, rendering typed form controls for user preferences.
* **Scratchpad (`ScratchpadExtension`)**: Provides a quick notes tool that can be opened as a temporary markdown file in the editor or as a custom UI ViewProvider in the right panel.
* **Hello World (`HelloWorldExtension`)**: A sample extension demonstrating how to register commands, menu items, and custom sidebar views.

## Default Keybindings

The IDE comes configured with standard developer keyboard shortcuts:

* **Save File:** `Ctrl+S` 
* **Save As:** `Ctrl+Shift+S` 
* **Close Tab:** `Ctrl+W` 
* **New File:** `Ctrl+N` 
* **Open File:** `Ctrl+O` 
* **Open Settings:** `Ctrl+,` 
* **Command Palette:** `Ctrl+Shift+P` (UI pending implementation) 

## Initialization

The IDE is bootstrapped in `index.ts`. On DOM ready, it creates an `IDE` instance, registers the default extensions, and initializes the layout, VFS (with demo files), and UI. If initialization fails, an error screen provides a reload action.