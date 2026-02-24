
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
        this.container.appendChild(item.getElement());
    }

    public getElement(): HTMLElement {
        return this.container;
    }
}
