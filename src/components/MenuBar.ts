
import { MenuItem, MenuItemConfig } from "./MenuItem";

export class MenuBar {
    private container: HTMLElement;
    private items: MenuItem[] = [];

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'menu-bar';
    }

    public addMenuItem(config: MenuItemConfig, onClick?: () => void): void {
        const item = new MenuItem(config, onClick);
        this.items.push(item);

        const el = item.getElement();
        el.addEventListener('mouseenter', () => {
            const openItem = this.items.find(i => i.getIsOpen());
            if (openItem && openItem !== item) {
                openItem.close();
                item.open();
            }
        });

        this.container.appendChild(el);
    }

    public getElement(): HTMLElement {
        return this.container;
    }
}
