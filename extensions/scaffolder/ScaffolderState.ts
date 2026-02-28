export interface ScaffolderStateModel {
    projectName: string;
    useGit: boolean;
    useTs: boolean;
    isGenerating: boolean;
    logs: string[];
}

export type StateListener = (state: ScaffolderStateModel) => void;

export class ScaffolderState {
    private state: ScaffolderStateModel = {
        projectName: '',
        useGit: true,
        useTs: true,
        isGenerating: false,
        logs: []
    };

    private listeners: Set<StateListener> = new Set();

    public getState(): ScaffolderStateModel {
        return { ...this.state };
    }

    public addListener(callback: StateListener): () => void {
        this.listeners.add(callback);
        callback(this.getState());
        return () => this.listeners.delete(callback);
    }

    public update(partialState: Partial<ScaffolderStateModel>): void {
        this.state = { ...this.state, ...partialState };
        this.notify();
    }

    public addLog(message: string): void {
        this.update({ logs: [...this.state.logs, message] });
    }

    public clearLogs(): void {
        this.update({ logs: [] });
    }

    private notify(): void {
        const currentState = this.getState();
        this.listeners.forEach(callback => callback(currentState));
    }
}