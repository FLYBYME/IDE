import { StatusItem } from "./StatusItem";

export class StatusBar {
    private container: HTMLElement;
    private leftContainer: HTMLElement;
    private rightContainer: HTMLElement;
    private items: Map<string, StatusItem> = new Map();

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'status-bar';

        this.leftContainer = document.createElement('div');
        this.leftContainer.className = 'status-left';

        this.rightContainer = document.createElement('div');
        this.rightContainer.className = 'status-right';

        this.container.appendChild(this.leftContainer);
        this.container.appendChild(this.rightContainer);

        this.renderDefaultItems();
    }

    private renderDefaultItems(): void {
        // Left items
        this.addItem(new StatusItem({ id: 'branch', label: 'master', icon: 'fas fa-code-branch' }), 'left');
        this.addItem(new StatusItem({ id: 'errors', label: '0 errors', icon: 'far fa-times-circle' }), 'left');
        this.addItem(new StatusItem({ id: 'warnings', label: '0 warnings', icon: 'far fa-bell' }), 'left');

        // Notification status (transient messages from NotificationService)
        this.addItem(new StatusItem({ id: 'notification-status', label: '' }), 'left');

        // Right items
        this.addItem(new StatusItem({ id: 'position', label: 'Ln 1, Col 1' }), 'right');
        this.addItem(new StatusItem({ id: 'encoding', label: 'UTF-8' }), 'right');
        this.addItem(new StatusItem({ id: 'language', label: 'TypeScript', icon: 'fab fa-js' }), 'right');
    }

    private addItem(item: StatusItem, position: 'left' | 'right' = 'left'): void {
        if (position === 'left') {
            this.leftContainer.appendChild(item.getElement());
        } else {
            this.rightContainer.appendChild(item.getElement());
        }
        this.items.set(item.getId(), item);
    }

    public getItem(id: string): StatusItem | undefined {
        return this.items.get(id);
    }

    public setMessage(message: string): void {
        // Implementation for dynamic status messages could go here
    }

    public getElement(): HTMLElement {
        return this.container;
    }

    public dispose(): void {
        this.items.forEach(item => item.dispose());
        this.items.clear();
        this.container.remove();
    }
}
