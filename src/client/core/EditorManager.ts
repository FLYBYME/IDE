/**
 * EditorManager - Central controller for the center panel tab system.
 * Manages open tabs, active state, content areas, and context menus.
 */

import { IDE } from './IDE';
import { EditorTabConfig } from '../components/EditorTab';
import { EditorGrid } from './EditorGrid';
import { EditorGroupState } from './EditorGroup';

// Events emitted by the EditorManager
export const EditorEvents = {
    EDITOR_TAB_OPENED: 'editor.tab.opened',
    EDITOR_TAB_CLOSED: 'editor.tab.closed',
    EDITOR_ACTIVE_CHANGED: 'editor.active.changed',
};

export interface EditorState {
    groups: EditorGroupState[];
    activeTabId: string | null;
}

export class EditorManager {
    private ide: IDE;
    private grid: EditorGrid;

    constructor(ide: IDE) {
        this.ide = ide;
        this.grid = new EditorGrid(ide);
        this.registerCommands();
    }

    public mount(centerPanel: HTMLElement): void {
        centerPanel.appendChild(this.grid.element);
    }

    private registerCommands(): void {
        this.ide.commands.register({
            id: 'editor.open',
            label: 'Open Editor Tab',
            handler: (config: EditorTabConfig) => this.openTab(config),
        });
        this.ide.commands.register({
            id: 'editor.close',
            label: 'Close Editor Tab',
            handler: (id: string) => this.closeTab(id),
        });
        this.ide.commands.register({
            id: 'editor.closeAll',
            label: 'Close All Tabs',
            handler: () => this.closeAllTabs(),
        });
        this.ide.commands.register({
            id: 'editor.nextTab',
            label: 'Next Tab',
            handler: () => this.cycleTab(1),
        });
        this.ide.commands.register({
            id: 'editor.prevTab',
            label: 'Previous Tab',
            handler: () => this.cycleTab(-1),
        });
        this.ide.commands.register({
            id: 'editor.splitRight',
            label: 'Split Editor Right',
            handler: () => this.grid.splitRight(),
        });
    }

    public openTab(config: EditorTabConfig): void {
        const group = this.grid.getGroupForTab(config.id) || this.grid.getActiveGroup();
        group.openTab(config);
    }

    public openFile(fileId: string, title: string, content: string, language: string, icon?: string): void {
        const group = this.grid.getGroupForTab(fileId) || this.grid.getActiveGroup();

        if (group.hasTab(fileId)) {
            group.activateTab(fileId);
            return;
        }

        group.openTab({ id: fileId, title, icon });

        const contentPanel = group.getContentPanel(fileId);
        if (contentPanel && this.ide.monaco) {
            contentPanel.style.overflow = 'hidden';
            contentPanel.style.position = 'relative';
            this.ide.monaco.openFile(contentPanel, fileId, content, language);
        }
    }

    public getContentPanel(tabId: string): HTMLElement | undefined {
        const group = this.grid.getGroupForTab(tabId);
        return group ? group.getContentPanel(tabId) : undefined;
    }

    public activateTab(id: string): void {
        this.grid.getGroupForTab(id)?.activateTab(id);
    }

    public closeTab(id: string): void {
        this.grid.getGroupForTab(id)?.closeTab(id);
    }

    public closeAllTabs(): void {
        for (const group of this.grid.groups.values()) {
            group.closeAllTabs();
        }
    }

    public cycleTab(direction: number): void {
        this.grid.getActiveGroup().cycleTab(direction);
    }

    public setTabDirty(id: string, dirty: boolean): void {
        this.grid.getGroupForTab(id)?.setTabDirty(id, dirty);
    }

    public hasTab(id: string): boolean {
        return !!this.grid.getGroupForTab(id);
    }

    public getActiveTabId(): string | null {
        return this.grid.getActiveGroup().activeTabId;
    }

    public getState(): EditorState {
        const groupsState: EditorGroupState[] = [];
        for (const group of this.grid.groups.values()) {
            groupsState.push(group.getState());
        }
        return {
            groups: groupsState,
            activeTabId: this.getActiveTabId(),
        };
    }

    public dispose(): void {
        for (const group of this.grid.groups.values()) {
            group.dispose();
        }
    }
}
