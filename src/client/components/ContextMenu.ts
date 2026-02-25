/**
 * ContextMenu - Reusable floating right-click menu
 * Positions at mouse coordinates and auto-dismisses on outside click.
 */

export interface ContextMenuAction {
    label: string;
    action: () => void;
    icon?: string;
    disabled?: boolean;
}

export interface ContextMenuSeparator {
    separator: true;
}

export interface ContextMenuSubmenu {
    label: string;
    items: ContextMenuItem[];
    icon?: string;
    disabled?: boolean;
}

export type ContextMenuItem = ContextMenuAction | ContextMenuSeparator | ContextMenuSubmenu;

export function isContextMenuSeparator(item: ContextMenuItem): item is ContextMenuSeparator {
    return 'separator' in item && (item as ContextMenuSeparator).separator === true;
}

export function isContextMenuSubmenu(item: ContextMenuItem): item is ContextMenuSubmenu {
    return 'items' in item && Array.isArray((item as ContextMenuSubmenu).items);
}

export class ContextMenu {
    private container: HTMLElement;
    private handleDocumentClick: (e: MouseEvent) => void;
    private activeSubmenu: ContextMenu | null = null;
    private parentMenu: ContextMenu | null = null;

    constructor(items: ContextMenuItem[], x: number, y: number, parentMenu?: ContextMenu) {
        this.parentMenu = parentMenu || null;
        this.container = document.createElement('div');
        this.container.className = 'context-menu';
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;

        items.forEach(item => {
            this.container.appendChild(this.renderItem(item));
        });

        // Top-level menu handles document click
        if (!this.parentMenu) {
            this.handleDocumentClick = this.onDocumentClick.bind(this);
            requestAnimationFrame(() => {
                document.addEventListener('click', this.handleDocumentClick, { capture: true });
            });
        } else {
            this.handleDocumentClick = () => { };
        }

        document.body.appendChild(this.container);

        // Clamp position to viewport
        requestAnimationFrame(() => {
            const rect = this.container.getBoundingClientRect();
            let newX = rect.left;
            let newY = rect.top;

            // If we're a submenu, flip to the left side if we don't fit on the right
            if (this.parentMenu) {
                if (rect.right > window.innerWidth) {
                    const parentRect = this.parentMenu.container.getBoundingClientRect();
                    newX = parentRect.left - rect.width;
                }
            } else {
                if (rect.right > window.innerWidth) {
                    newX = window.innerWidth - rect.width - 4;
                }
            }

            if (rect.bottom > window.innerHeight) {
                newY = window.innerHeight - rect.height - 4;
            }

            this.container.style.left = `${newX}px`;
            this.container.style.top = `${newY}px`;
        });
    }

    private renderItem(item: ContextMenuItem): HTMLElement {
        if (isContextMenuSeparator(item)) {
            const sep = document.createElement('div');
            sep.className = 'context-menu-separator';
            return sep;
        }

        const el = document.createElement('div');
        el.className = 'context-menu-item';
        if (item.disabled) el.classList.add('disabled');

        // Left Icon
        const iconWrap = document.createElement('span');
        iconWrap.style.width = '16px';
        iconWrap.style.display = 'inline-flex';
        iconWrap.style.alignItems = 'center';
        iconWrap.style.justifyContent = 'center';

        if (item.icon) {
            const icon = document.createElement('i');
            icon.className = item.icon;
            iconWrap.appendChild(icon);
        }
        el.appendChild(iconWrap);

        // Label
        const label = document.createElement('span');
        label.textContent = item.label;
        label.style.flex = '1';
        el.appendChild(label);

        if (isContextMenuSubmenu(item)) {
            // Right Chevron for submenus
            const chevronWrap = document.createElement('span');
            chevronWrap.style.width = '16px';
            chevronWrap.style.display = 'inline-flex';
            chevronWrap.style.alignItems = 'center';
            chevronWrap.style.justifyContent = 'flex-end';
            chevronWrap.innerHTML = '<i class="fas fa-chevron-right" style="font-size: 10px; opacity: 0.7;"></i>';
            el.appendChild(chevronWrap);

            let hoverTimeout: any;

            el.addEventListener('mouseenter', () => {
                if (item.disabled) return;

                // Close other open submenus at this level
                if (this.activeSubmenu) {
                    this.activeSubmenu.dispose();
                    this.activeSubmenu = null;
                }

                hoverTimeout = setTimeout(() => {
                    const rect = el.getBoundingClientRect();
                    this.activeSubmenu = new ContextMenu(item.items, rect.right, rect.top, this);
                }, 150);
            });

            el.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });
        } else {
            // Spacer if no chevron
            const spacer = document.createElement('span');
            spacer.style.width = '16px';
            el.appendChild(spacer);

            if (!item.disabled) {
                el.addEventListener('mouseenter', () => {
                    // Hovering a normal item closes any active submenu
                    if (this.activeSubmenu) {
                        this.activeSubmenu.dispose();
                        this.activeSubmenu = null;
                    }
                });

                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    (item as ContextMenuAction).action();
                    // Dispose the entire tree
                    let root: ContextMenu = this;
                    while (root.parentMenu) {
                        root = root.parentMenu;
                    }
                    root.dispose();
                });
            }
        }

        return el;
    }

    private onDocumentClick(e: MouseEvent): void {
        if (!this.container.contains(e.target as Node)) {
            this.dispose();
        }
    }

    public dispose(): void {
        if (!this.parentMenu) {
            document.removeEventListener('click', this.handleDocumentClick, { capture: true });
        }
        if (this.activeSubmenu) {
            this.activeSubmenu.dispose();
            this.activeSubmenu = null;
        }
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
