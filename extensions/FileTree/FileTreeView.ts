import * as uiLib from 'ide-core';
import { FileTreeStateModel } from './FileTreeState';

export interface FileTreeViewEvents {
    onRefresh: () => void;
    onNewFile: () => void;
    onToggleFolder: (path: string) => void;
    onFileSelected: (path: string, name: string) => void;
    onContextMenu: (e: MouseEvent, node: any) => void;
}

export class FileTreeView extends uiLib.BaseComponent<FileTreeViewEvents> {
    private fileList!: uiLib.VirtualList<any>;
    private header!: uiLib.Toolbar;

    constructor(events: FileTreeViewEvents) {
        super('div', events); // Inherits from BaseComponent 
        this.render();
    }

    /**
     * Implements the inherited abstract member from BaseComponent.
     */
    public render(): void {
        const events = this.props;
        this.element.innerHTML = ''; // Clear before rendering

        this.header = new uiLib.Toolbar({
            children: [
                new uiLib.Heading({ text: 'EXPLORER', level: 4, transform: 'uppercase' }),
                new uiLib.Spacer(), // Absorbs flex space [cite: 121, 122]
                new uiLib.Button({
                    icon: 'fas fa-sync',
                    variant: 'ghost',
                    onClick: () => events.onRefresh()
                }),
                new uiLib.Button({
                    icon: 'fas fa-plus',
                    variant: 'ghost',
                    onClick: () => events.onNewFile()
                })
            ]
        });

        this.fileList = new uiLib.VirtualList<any>({
            items: [],
            itemHeight: 24,
            height: '100%',
            renderItem: (flatNode) => this.renderTreeItem(flatNode, events)
        });

        const container = new uiLib.Column({
            fill: true,
            children: [this.header, this.fileList]
        });
        this.appendChildren(container); // Safe DOM appending [cite: 8]
    }

    private renderTreeItem(flatNode: any, events: FileTreeViewEvents) {
        const { node, depth } = flatNode;
        const item = new uiLib.TreeItem({
            label: node.name,
            depth: depth,
            hasChildren: node.type === 'directory',
            icon: node.type === 'directory' ? 'fas fa-folder' : 'fas fa-file',
            onClick: () => events.onFileSelected(node.fullPath, node.name),
            onToggle: () => events.onToggleFolder(node.fullPath)
        });

        item.getElement().addEventListener('contextmenu', (e) => events.onContextMenu(e, node));
        return item;
    }

    public update(state: FileTreeStateModel): void {
        if (this.fileList) {
            this.fileList.setItems(state.visibleNodes); // Updates VirtualList props [cite: 161]
        }
    }
}