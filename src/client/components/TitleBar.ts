
/**
 * TitleBar - Displays the application title and window controls
 */

export class TitleBar {
    private container: HTMLElement;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'title-bar';
        this.buildStructure();
    }

    private buildStructure(): void {
        const title = document.createElement('div');
        title.className = 'title-text';
        title.textContent = 'CanvasLLM IDE';
        this.container.appendChild(title);
    }

    public getElement(): HTMLElement {
        return this.container;
    }

    public dispose(): void {
        this.container.remove();
    }
}