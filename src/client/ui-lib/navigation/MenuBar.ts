// ui-lib/navigation/MenuBar.ts

import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';
import { MenuItem, MenuItemProps } from './MenuItem';

export class MenuBar extends BaseComponent<{}> {
    private items: MenuItem[] = [];

    constructor() {
        super('div', {});
        this.render();
    }

    public render(): void {
        this.applyStyles({
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0',
            gap: '0'
        });
        this.addClasses('menu-bar');

        this.element.innerHTML = '';
        this.items.forEach(item => {
            this.element.appendChild(item.getElement());
        });
    }

    public addMenuItem(props: MenuItemProps): MenuItem {
        const item = new MenuItem(props);
        this.items.push(item);
        this.element.appendChild(item.getElement());

        // Hover-open logic for menu bars
        item.getElement().addEventListener('mouseenter', () => {
            const openItem = this.items.find(i => i.getElement().classList.contains('open'));
            if (openItem && openItem !== item) {
                // In a real menu bar, moving between top-level items while one is open
                // would close the previous and open the new one.
                // For now, MenuItem handles its own dropdown.
            }
        });

        return item;
    }

    public dispose(): void {
        this.items.forEach(item => item.dispose());
        this.items = [];
        super.dispose();
    }
}
