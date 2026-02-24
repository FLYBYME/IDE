/**
 * EditorTab - Represents a single visual tab in the editor header.
 * Handles click (activate), middle-click (close), right-click (context menu),
 * and reflects the dirty (unsaved) state.
 */

import { ContextMenu, ContextMenuItem } from './ContextMenu';

export interface EditorTabConfig {
    id: string;             // Unique identifier (usually the file path)
    title: string;          // Display name (e.g., "main.ts")
    icon?: string;          // FontAwesome class (e.g., "fab fa-js")
    isDirty?: boolean;      // True if there are unsaved changes
    providerId?: string;    // If this is a custom extension view rather than a text file
    isPinned?: boolean;     // True if the tab is pinned
}

export interface EditorTabCallbacks {
    onActivate: (id: string) => void;
    onClose: (id: string) => void;
    onContextMenu: (id: string, x: number, y: number) => void;
    onDragStart?: (id: string, e: DragEvent) => void;
    onDragEnd?: (id: string, e: DragEvent) => void;
}

export class EditorTab {
    private config: EditorTabConfig;
    private element: HTMLElement;
    private closeBtn: HTMLElement;
    private callbacks: EditorTabCallbacks;
    private dirty: boolean = false;
    private pinned: boolean = false;

    constructor(config: EditorTabConfig, callbacks: EditorTabCallbacks) {
        this.config = config;
        this.callbacks = callbacks;
        this.dirty = config.isDirty || false;
        this.pinned = config.isPinned || false;
        this.element = this.createElement();
        this.closeBtn = this.element.querySelector('.tab-close') as HTMLElement;
    }

    private createElement(): HTMLElement {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.tabId = this.config.id;
        tab.draggable = true;
        tab.title = this.config.id;

        if (this.pinned) {
            tab.classList.add('pinned');
        }

        // Icon
        if (this.config.icon) {
            const icon = document.createElement('i');
            icon.className = this.config.icon;
            icon.style.fontSize = '14px';
            tab.appendChild(icon);
        }

        // Title
        const title = document.createElement('span');
        title.className = 'tab-title';
        title.textContent = this.config.title;
        tab.appendChild(title);

        // Close / Dirty indicator
        const closeBtn = document.createElement('i');
        // If pinned, we show a pin icon instead of close/dirty, logic handled in CSS/setPinned
        closeBtn.className = this.dirty ? 'fas fa-circle dirty-indicator tab-close' : 'fas fa-times tab-close';
        if (this.pinned) {
            closeBtn.className = 'fas fa-thumbtack tab-close pinned-indicator';
        }
        tab.appendChild(closeBtn);

        // Click to activate
        tab.addEventListener('click', (e) => {
            // Don't activate if clicking close button
            if ((e.target as HTMLElement).classList.contains('tab-close')) return;
            this.callbacks.onActivate(this.config.id);
        });

        // Middle-click to close
        tab.addEventListener('auxclick', (e) => {
            if (e.button === 1) { // Middle mouse button
                e.preventDefault();
                this.callbacks.onClose(this.config.id);
            }
        });

        // Right-click for context menu
        tab.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.callbacks.onContextMenu(this.config.id, e.clientX, e.clientY);
        });

        // Close button click
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.callbacks.onClose(this.config.id);
        });

        // Drag and drop
        tab.addEventListener('dragstart', (e) => {
            tab.classList.add('dragging');
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', this.config.id);
            }
            if (this.callbacks.onDragStart) {
                this.callbacks.onDragStart(this.config.id, e);
            }
        });

        tab.addEventListener('dragend', (e) => {
            tab.classList.remove('dragging');
            if (this.callbacks.onDragEnd) {
                this.callbacks.onDragEnd(this.config.id, e);
            }
        });

        return tab;
    }

    public setActive(active: boolean): void {
        this.element.classList.toggle('active', active);
    }

    public setDirty(dirty: boolean): void {
        this.dirty = dirty;
        if (this.closeBtn && !this.pinned) {
            this.closeBtn.className = dirty
                ? 'fas fa-circle dirty-indicator tab-close'
                : 'fas fa-times tab-close';
        }
    }

    public setPinned(pinned: boolean): void {
        this.pinned = pinned;
        this.config.isPinned = pinned;
        this.element.classList.toggle('pinned', pinned);
        if (this.closeBtn) {
            if (pinned) {
                this.closeBtn.className = 'fas fa-thumbtack tab-close pinned-indicator';
            } else {
                this.closeBtn.className = this.dirty
                    ? 'fas fa-circle dirty-indicator tab-close'
                    : 'fas fa-times tab-close';
            }
        }
    }

    public getId(): string {
        return this.config.id;
    }

    public getConfig(): EditorTabConfig {
        return { ...this.config };
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public dispose(): void {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
