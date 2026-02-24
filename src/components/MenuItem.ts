
export interface MenuItemConfig {
    id: string;
    label: string;
    command?: string;
    onClick?: () => void;
    icon?: string;
    shortcut?: string;
    items?: MenuItemConfig[]; // For submenus in the future
    disabled?: boolean;
}

export class MenuItem {
    private config: MenuItemConfig;
    private element: HTMLElement;
    private dropdown?: HTMLElement;
    private onClick?: () => void;
    private isOpen: boolean = false;

    private handleDocumentClick: (e: MouseEvent) => void;

    constructor(config: MenuItemConfig, onClick?: () => void) {
        this.config = config;
        this.onClick = onClick;
        this.handleDocumentClick = this.onDocumentClick.bind(this);
        this.element = this.createUnmountedElement();
    }

    private createUnmountedElement(): HTMLElement {
        const item = document.createElement('div');
        item.className = 'menu-item';

        if (this.config.disabled) {
            item.classList.add('disabled');
        }

        const label = document.createElement('span');
        label.textContent = this.config.label;
        item.appendChild(label);

        if (this.config.icon) {
            const icon = document.createElement('i');
            icon.className = this.config.icon;
            item.appendChild(icon);
        }
        item.dataset.id = this.config.id;

        // Create dropdown if items exist
        if (this.config.items && this.config.items.length > 0) {
            this.dropdown = document.createElement('div');
            this.dropdown.className = 'menu-dropdown';

            this.config.items.forEach(subItemConfig => {
                const subItem = document.createElement('div');
                subItem.className = 'menu-dropdown-item';

                // Icon column
                const iconEl = document.createElement('span');
                iconEl.className = 'menu-icon';
                if (subItemConfig.icon) {
                    const i = document.createElement('i');
                    i.className = subItemConfig.icon;
                    iconEl.appendChild(i);
                }
                subItem.appendChild(iconEl);

                // Label
                const labelEl = document.createElement('span');
                labelEl.className = 'menu-label';
                labelEl.textContent = subItemConfig.label;
                subItem.appendChild(labelEl);

                // Shortcut hint
                if (subItemConfig.shortcut) {
                    const shortcutEl = document.createElement('span');
                    shortcutEl.className = 'menu-shortcut';
                    shortcutEl.textContent = subItemConfig.shortcut;
                    subItem.appendChild(shortcutEl);
                }

                subItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (subItemConfig.onClick) {
                        subItemConfig.onClick();
                        this.close();
                    }
                });

                this.dropdown!.appendChild(subItem);
            });

            item.appendChild(this.dropdown);
        }

        item.addEventListener('click', (e) => {
            if (this.config.disabled) return;

            if (this.config.items && this.config.items.length > 0) {
                this.toggle();
            } else if (this.onClick) {
                this.onClick();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', this.handleDocumentClick);

        return item;
    }

    private onDocumentClick(e: MouseEvent): void {
        if (this.isOpen && !this.element.contains(e.target as Node)) {
            this.close();
        }
    }

    private toggle(): void {
        this.isOpen ? this.close() : this.open();
    }

    public getIsOpen(): boolean {
        return this.isOpen;
    }

    public open(): void {
        if (this.dropdown) {
            this.dropdown.classList.add('visible');
            this.isOpen = true;
        }
    }

    public close(): void {
        if (this.dropdown) {
            this.dropdown.classList.remove('visible');
            this.isOpen = false;
        }
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public dispose(): void {
        document.removeEventListener('click', this.handleDocumentClick);
    }
}
