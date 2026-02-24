/**
 * EditorGroup - Represents a single split pane in the editor grid.
 * It manages its own list of tabs, a tab header, and a content area.
 */

import { IDE } from './IDE';
import { EditorTab, EditorTabConfig } from '../components/EditorTab';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { EditorEvents } from './EditorManager';

export interface EditorGroupState {
    id: string;
    tabOrder: string[];
    tabs: Record<string, EditorTabConfig>;
    activeTabId: string | null;
}

export class EditorGroup {
    public readonly id: string;
    private ide: IDE;

    public element: HTMLElement;
    private tabsContainer: HTMLElement;
    private bodyContainer: HTMLElement;

    // State
    private tabs: Map<string, EditorTab> = new Map();
    public tabOrder: string[] = [];  // Insertion/display order
    private recentOrder: string[] = []; // MRU order
    private contentPanels: Map<string, HTMLElement> = new Map();
    public activeTabId: string | null = null;
    private activeContextMenu: ContextMenu | null = null;

    // Callbacks to parent grid
    public onEmpty?: (groupId: string) => void;
    public onActiveTabChanged?: (groupId: string, tabId: string | null) => void;
    public onDragTab?: (sourceTabId: string, targetGroupId: string, targetIndex: number) => void;

    constructor(id: string, ide: IDE) {
        this.id = id;
        this.ide = ide;

        // Structure
        this.element = document.createElement('div');
        this.element.className = 'editor-group';
        this.element.dataset.groupId = id;

        this.tabsContainer = document.createElement('div');
        this.tabsContainer.className = 'editor-tabs';
        this.element.appendChild(this.tabsContainer);

        this.bodyContainer = document.createElement('div');
        this.bodyContainer.className = 'editor-body';
        this.element.appendChild(this.bodyContainer);

        // Scroll tabs
        this.tabsContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.tabsContainer.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        this.setupDragAndDrop();
    }

    private setupDragAndDrop(): void {
        this.tabsContainer.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow dropping
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

            const draggingTab = document.querySelector('.tab.dragging') as HTMLElement;
            if (!draggingTab) return;

            const afterElement = this.getDragAfterElement(this.tabsContainer, e.clientX);
            if (afterElement) {
                this.tabsContainer.insertBefore(draggingTab, afterElement);
            } else {
                this.tabsContainer.appendChild(draggingTab);
            }
        });

        this.tabsContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const sourceTabId = e.dataTransfer?.getData('text/plain');
            if (!sourceTabId) return;

            // Determine new index
            const tabs = Array.from(this.tabsContainer.querySelectorAll('.tab'));
            let targetIndex = tabs.findIndex(t => (t as HTMLElement).dataset.tabId === sourceTabId);
            if (targetIndex === -1) targetIndex = tabs.length;

            if (this.onDragTab) {
                this.onDragTab(sourceTabId, this.id, targetIndex);
            }
        });
    }

    private getDragAfterElement(container: HTMLElement, x: number): Element | null {
        const draggableElements = [...container.querySelectorAll('.tab:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY, element: null as Element | null }).element;
    }

    // ── Tab Management ────────────────────────────────────

    public openTab(config: EditorTabConfig): void {
        if (this.tabs.has(config.id)) {
            this.activateTab(config.id);
            return;
        }

        const tab = new EditorTab(config, {
            onActivate: (id) => this.activateTab(id),
            onClose: (id) => this.closeTab(id),
            onContextMenu: (id, x, y) => this.showTabContextMenu(id, x, y),
        });

        const contentPanel = document.createElement('div');
        contentPanel.className = 'editor-content-panel';
        contentPanel.style.display = 'none';
        contentPanel.style.flex = '1';
        contentPanel.style.overflow = 'auto';
        contentPanel.dataset.tabId = config.id;

        this.tabs.set(config.id, tab);
        this.tabOrder.push(config.id);
        this.contentPanels.set(config.id, contentPanel);

        this.tabsContainer.appendChild(tab.getElement());
        this.bodyContainer.appendChild(contentPanel);

        this.ide.commands.emit(EditorEvents.EDITOR_TAB_OPENED, { tabId: config.id, config, groupId: this.id });
        this.activateTab(config.id);
    }

    public getContentPanel(tabId: string): HTMLElement | undefined {
        return this.contentPanels.get(tabId);
    }

    public activateTab(id: string): void {
        if (!this.tabs.has(id)) return;
        if (this.activeTabId === id) return;

        if (this.activeTabId) {
            this.tabs.get(this.activeTabId)?.setActive(false);
            const p = this.contentPanels.get(this.activeTabId);
            if (p) p.style.display = 'none';
        }

        this.tabs.get(id)?.setActive(true);
        const p = this.contentPanels.get(id);
        if (p) p.style.display = '';

        this.activeTabId = id;
        this.recentOrder = this.recentOrder.filter(tid => tid !== id);
        this.recentOrder.unshift(id);

        if (this.onActiveTabChanged) {
            this.onActiveTabChanged(this.id, id);
        }

        this.ide.commands.emit(EditorEvents.EDITOR_ACTIVE_CHANGED, { tabId: id, groupId: this.id });
    }

    public closeTab(id: string, force: boolean = false): void {
        const tab = this.tabs.get(id);
        const contentPanel = this.contentPanels.get(id);
        if (!tab) return;

        if (tab.getConfig().isPinned && !force) {
            return; // Prevent closing pinned tabs unless forced
        }

        const wasActive = this.activeTabId === id;

        tab.dispose();
        if (contentPanel?.parentNode) {
            contentPanel.parentNode.removeChild(contentPanel);
        }

        this.tabs.delete(id);
        this.contentPanels.delete(id);
        this.tabOrder = this.tabOrder.filter(tid => tid !== id);
        this.recentOrder = this.recentOrder.filter(tid => tid !== id);

        this.ide.commands.emit(EditorEvents.EDITOR_TAB_CLOSED, { tabId: id, groupId: this.id });

        if (wasActive) {
            this.activeTabId = null;
            if (this.recentOrder.length > 0) {
                this.activateTab(this.recentOrder[0]);
            } else if (this.tabOrder.length > 0) {
                this.activateTab(this.tabOrder[this.tabOrder.length - 1]);
            } else {
                if (this.onActiveTabChanged) this.onActiveTabChanged(this.id, null);
                if (this.onEmpty) this.onEmpty(this.id);
            }
        } else if (this.tabOrder.length === 0) {
            if (this.onEmpty) this.onEmpty(this.id);
        }
    }

    public removeTabInternally(id: string): { config: EditorTabConfig, panel: HTMLElement } | null {
        const tab = this.tabs.get(id);
        const panel = this.contentPanels.get(id);
        if (!tab || !panel) return null;

        const config = tab.getConfig();
        const wasActive = this.activeTabId === id;

        tab.dispose();
        if (panel.parentNode) panel.parentNode.removeChild(panel);

        this.tabs.delete(id);
        this.contentPanels.delete(id);
        this.tabOrder = this.tabOrder.filter(tid => tid !== id);
        this.recentOrder = this.recentOrder.filter(tid => tid !== id);

        if (wasActive) {
            this.activeTabId = null;
            if (this.recentOrder.length > 0) {
                this.activateTab(this.recentOrder[0]);
            } else if (this.tabOrder.length > 0) {
                this.activateTab(this.tabOrder[this.tabOrder.length - 1]);
            }
        }

        if (this.tabOrder.length === 0 && this.onEmpty) {
            this.onEmpty(this.id);
        }

        return { config, panel };
    }

    public insertTabInternally(config: EditorTabConfig, panel: HTMLElement, index: number, activate = true): void {
        const tab = new EditorTab(config, {
            onActivate: (id) => this.activateTab(id),
            onClose: (id) => this.closeTab(id),
            onContextMenu: (id, x, y) => this.showTabContextMenu(id, x, y),
        });

        this.tabs.set(config.id, tab);
        this.contentPanels.set(config.id, panel);

        if (index >= this.tabOrder.length) {
            this.tabOrder.push(config.id);
            this.tabsContainer.appendChild(tab.getElement());
        } else {
            this.tabOrder.splice(index, 0, config.id);
            const beforeId = this.tabOrder[index + 1];
            const beforeTab = this.tabs.get(beforeId);
            this.tabsContainer.insertBefore(tab.getElement(), beforeTab?.getElement() || null);
        }

        this.bodyContainer.appendChild(panel);

        if (activate) {
            this.activateTab(config.id);
        } else {
            tab.setActive(false);
            panel.style.display = 'none';
        }
    }

    public closeAllTabs(force: boolean = false): void {
        [...this.tabOrder].forEach(id => this.closeTab(id, force));
    }

    public closeOtherTabs(keepId: string): void {
        // Pinned tabs won't close unless forced, so we just call closeTab normally
        this.tabOrder.filter(id => id !== keepId).forEach(id => this.closeTab(id));
    }

    public closeTabsToRight(targetId: string): void {
        const idx = this.tabOrder.indexOf(targetId);
        if (idx === -1) return;
        this.tabOrder.slice(idx + 1).forEach(id => this.closeTab(id));
    }

    public cycleTab(direction: number): void {
        if (this.tabOrder.length === 0) return;
        const currentIndex = this.activeTabId ? this.tabOrder.indexOf(this.activeTabId) : -1;
        let newIndex = (currentIndex + direction + this.tabOrder.length) % this.tabOrder.length;
        this.activateTab(this.tabOrder[newIndex]);
    }

    public setTabDirty(id: string, dirty: boolean): void {
        this.tabs.get(id)?.setDirty(dirty);
    }

    public hasTab(id: string): boolean {
        return this.tabs.has(id);
    }

    private showTabContextMenu(tabId: string, x: number, y: number): void {
        if (this.activeContextMenu) this.activeContextMenu.dispose();

        const tab = this.tabs.get(tabId);
        if (!tab) return;

        const isPinned = tab.getConfig().isPinned;

        const items: ContextMenuItem[] = [
            { label: 'Split Right', action: () => this.ide.commands.execute('editor.splitRight') },
            { separator: true },
            {
                label: isPinned ? 'Unpin Tab' : 'Pin Tab',
                action: () => tab.setPinned(!isPinned)
            },
            { separator: true },
            { label: 'Close', action: () => this.closeTab(tabId, true) },
            { label: 'Close Others', action: () => this.closeOtherTabs(tabId) },
            { label: 'Close to the Right', action: () => this.closeTabsToRight(tabId) },
            { label: 'Close All in Group', action: () => this.closeAllTabs() },
            { separator: true },
            {
                label: 'Copy Path',
                action: () => {
                    navigator.clipboard.writeText(tabId).catch(() => {
                        console.warn('EditorGroup: Could not copy path to clipboard');
                    });
                }
            },
        ];

        this.activeContextMenu = new ContextMenu(items, x, y);
    }

    public getState(): EditorGroupState {
        const tabsRecord: Record<string, EditorTabConfig> = {};
        for (const [id, tab] of this.tabs.entries()) {
            tabsRecord[id] = tab.getConfig();
        }
        return {
            id: this.id,
            tabOrder: [...this.tabOrder],
            tabs: tabsRecord,
            activeTabId: this.activeTabId,
        };
    }

    public dispose(): void {
        // Force close all tabs
        this.closeAllTabs(true);
        if (this.activeContextMenu) this.activeContextMenu.dispose();
        if (this.element.parentNode) this.element.parentNode.removeChild(this.element);
    }
}
