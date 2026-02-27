export interface User {
    username: string;
    email?: string;
    id?: string;
    bio?: string;
}

export interface Workspace {
    id: string;
    name: string;
    description?: string;
}

export interface WorkspaceStateModel {
    currentUser: User | null;
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    isLoading: boolean;
}

export type StateListener = (state: WorkspaceStateModel) => void;

export class WorkspaceState {
    private state: WorkspaceStateModel = {
        currentUser: null,
        workspaces: [],
        activeWorkspace: null,
        isLoading: false,
    };

    private listeners: Set<StateListener> = new Set();

    public getState(): WorkspaceStateModel {
        return { ...this.state };
    }

    public addListener(callback: StateListener): () => void {
        this.listeners.add(callback);
        // Immediate call with current state
        callback(this.getState());
        return () => this.listeners.delete(callback);
    }

    public update(partialState: Partial<WorkspaceStateModel>): void {
        this.state = { ...this.state, ...partialState };
        this.notify();
    }

    public setWorkspaces(workspaces: Workspace[]): void {
        this.update({ workspaces });
    }

    public setCurrentUser(user: User | null): void {
        this.update({ currentUser: user });
    }

    public setActiveWorkspace(workspace: Workspace | null): void {
        this.update({ activeWorkspace: workspace });
    }

    public setLoading(isLoading: boolean): void {
        this.update({ isLoading });
    }

    private notify(): void {
        const currentState = this.getState();
        this.listeners.forEach(callback => callback(currentState));
    }
}
