export interface TreeNode {
    name: string;
    fullPath: string;
    type: 'file' | 'directory';
    children: TreeNode[];
}

export interface FlatNode {
    node: TreeNode;
    depth: number;
}

export interface FileTreeStateModel {
    rootNode: TreeNode | null;
    visibleNodes: FlatNode[];
    expandedPaths: Set<string>;
    selectedPath: string | null;
}

export type StateListener = (state: FileTreeStateModel) => void;

export class FileTreeState {
    private state: FileTreeStateModel = {
        rootNode: null,
        visibleNodes: [],
        expandedPaths: new Set(),
        selectedPath: null
    };
    private listeners: Set<StateListener> = new Set();

    public getState(): FileTreeStateModel {
        return { ...this.state };
    }

    public addListener(callback: StateListener): () => void {
        this.listeners.add(callback);
        callback(this.getState());
        return () => this.listeners.delete(callback);
    }

    public update(partialState: Partial<FileTreeStateModel>): void {
        this.state = { ...this.state, ...partialState };
        this.listeners.forEach(cb => cb(this.getState()));
    }
}