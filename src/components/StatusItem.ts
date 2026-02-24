
export interface StatusItemConfig {
    id: string;
    label: string;
    icon?: string;
    onClick?: () => void;
    disabled?: boolean;
}

/**
 * StatusItem - Represents a single item in the status bar
 */

export class StatusItem {
    private container: HTMLElement;
    private textElement: HTMLElement;
    private id: string;

    constructor(config: StatusItemConfig) {
        this.id = config.id;
        this.container = document.createElement('div');
        this.container.className = 'status-item';
        this.textElement = document.createElement('span');
        this.buildStructure(config);
    }

    private buildStructure(config: StatusItemConfig): void {
        if (config.icon) {
            const icon = document.createElement('i');
            icon.className = config.icon;
            this.container.appendChild(icon);
        }
        this.textElement.textContent = config.label;
        this.container.appendChild(this.textElement);

        if (config.onClick) {
            this.container.addEventListener('click', config.onClick);
            this.container.style.cursor = 'pointer';
        }

        if (config.disabled) {
            this.container.classList.add('disabled');
        }
    }

    public updateLabel(label: string): void {
        this.textElement.textContent = label;
    }

    public getId(): string {
        return this.id;
    }

    public getElement(): HTMLElement {
        return this.container;
    }
}