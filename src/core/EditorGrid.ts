/**
 * EditorGrid - Manages EditorGroups in a resizable split-pane layout.
 * For this initial version, we support a simple horizontal split (Left / Right).
 * Future versions could support full nested CSS Grids or flex trees.
 */

import { IDE } from './IDE';
import { EditorGroup } from './EditorGroup';
import { EditorTabConfig } from '../components/EditorTab';

export class EditorGrid {
    private ide: IDE;
    public element: HTMLElement;

    // Group structures
    public groups: Map<string, EditorGroup> = new Map();
    private activeGroupId: string;

    constructor(ide: IDE) {
        this.ide = ide;

        this.element = document.createElement('div');
        this.element.className = 'editor-grid';
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'row'; // side-by-side
        this.element.style.flex = '1';
        this.element.style.overflow = 'hidden';

        // Create initial Group
        const initialGroup = this.createGroup('group-1');
        this.activeGroupId = initialGroup.id;
    }

    private createGroup(id: string): EditorGroup {
        const group = new EditorGroup(id, this.ide);
        group.element.style.flex = '1';
        group.element.style.minWidth = '200px';

        // Listen for group events
        group.onEmpty = (groupId) => this.handleGroupEmpty(groupId);
        group.onActiveTabChanged = (groupId, tabId) => {
            if (tabId) this.activeGroupId = groupId;
        };
        group.onDragTab = (sourceTabId, targetGroupId, targetIndex) => {
            this.moveTab(sourceTabId, targetGroupId, targetIndex);
        };

        this.element.appendChild(group.element);
        this.groups.set(id, group);
        return group;
    }

    private handleGroupEmpty(groupId: string): void {
        // Only remove if it's not the last group
        if (this.groups.size > 1) {
            const group = this.groups.get(groupId);
            if (group) {
                group.dispose();
                this.groups.delete(groupId);
            }

            if (this.activeGroupId === groupId) {
                const firstKey = this.groups.keys().next().value;
                if (firstKey !== undefined) {
                    this.activeGroupId = firstKey;
                }
            }
        }
    }

    private moveTab(sourceTabId: string, targetGroupId: string, targetIndex: number): void {
        const targetGroup = this.groups.get(targetGroupId);
        if (!targetGroup) return;

        // Find the source group
        let sourceGroup: EditorGroup | undefined;
        let sourceIndex = -1;

        for (const g of this.groups.values()) {
            sourceIndex = g.tabOrder.indexOf(sourceTabId);
            if (sourceIndex !== -1) {
                sourceGroup = g;
                break;
            }
        }

        if (!sourceGroup) return;

        // If moving within the same group, and the index hasn't effectively changed
        if (sourceGroup.id === targetGroupId) {
            if (sourceIndex === targetIndex || sourceIndex === targetIndex - 1) return;
        }

        // Remove from source
        const removed = sourceGroup.removeTabInternally(sourceTabId);
        if (!removed) return;

        // Insert into target
        targetGroup.insertTabInternally(removed.config, removed.panel, targetIndex, true);
        this.activeGroupId = targetGroupId;
    }

    public getActiveGroup(): EditorGroup {
        const group = this.groups.get(this.activeGroupId);
        if (group) return group;
        const firstGroup = this.groups.values().next().value;
        if (firstGroup) return firstGroup;
        throw new Error('No active EditorGroup found');
    }

    public getGroupForTab(tabId: string): EditorGroup | undefined {
        for (const group of this.groups.values()) {
            if (group.hasTab(tabId)) return group;
        }
        return undefined;
    }

    public splitRight(): void {
        if (this.groups.size >= 3) {
            this.ide.notifications.notify('Maximum of 3 panes supported in this version.', 'warning');
            return;
        }

        const newId = `group-${Date.now()}`;
        const newGroup = this.createGroup(newId);
        const oldGroup = this.getActiveGroup();
        this.activeGroupId = newId;

        // Add a resizer handle
        const resizer = document.createElement('div');
        resizer.className = 'editor-resizer';
        resizer.title = 'Drag to resize';

        this.element.appendChild(resizer);
        this.element.appendChild(newGroup.element);

        this.setupResizer(resizer, oldGroup.element, newGroup.element);
    }

    private setupResizer(resizer: HTMLElement, leftPane: HTMLElement, rightPane: HTMLElement): void {
        let isResizing = false;
        let startX = 0;
        let leftStartWidth = 0;
        let rightStartWidth = 0;

        const onMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const dx = e.clientX - startX;

            // Adjust flex basis based on pixel diff
            // To be precise, we switch to fixing flex-basis in pixels temporarily
            leftPane.style.flex = '0 0 auto';
            rightPane.style.flex = '0 0 auto';

            const newLeftW = Math.max(100, leftStartWidth + dx);
            const newRightW = Math.max(100, rightStartWidth - dx);

            leftPane.style.width = `${newLeftW}px`;
            rightPane.style.width = `${newRightW}px`;
        };

        const onMouseUp = () => {
            if (!isResizing) return;
            isResizing = false;
            document.body.style.cursor = '';

            // Re-apply flex ratio based on final computed widths so window resizes scale them
            const lw = leftPane.getBoundingClientRect().width;
            const rw = rightPane.getBoundingClientRect().width;

            leftPane.style.flex = `${lw} 1 0%`;
            leftPane.style.width = '';
            rightPane.style.flex = `${rw} 1 0%`;
            rightPane.style.width = '';

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Trigger resize event so Monaco editors update their layout
            window.dispatchEvent(new Event('resize'));
        };

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            leftStartWidth = leftPane.getBoundingClientRect().width;
            rightStartWidth = rightPane.getBoundingClientRect().width;

            document.body.style.cursor = 'col-resize';
            e.preventDefault(); // prevent text selection

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}
