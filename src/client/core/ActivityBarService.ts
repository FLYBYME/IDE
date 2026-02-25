import { ViewLocation } from './extensions/ViewProvider';
import { IDE } from './IDE';

export interface ActivityBarItem {
    id: string;                  // Unique ID, usually matching the ViewProvider ID
    location: ViewLocation;      // 'left-panel' | 'right-panel' | 'bottom-panel'
    icon: string;                // FontAwesome class (e.g., 'fas fa-terminal')
    title: string;               // Tooltip text
    order?: number;              // For sorting icons (lower = first)
    onClick?: () => void;        // Optional custom handler. Defaults to toggling the view.
}

export class ActivityBarService {
    private ide: IDE;
    private items: Map<string, ActivityBarItem> = new Map();
    private containers: Map<ViewLocation, HTMLElement> = new Map();

    constructor(ide: IDE) {
        this.ide = ide;
    }

    /**
     * Called by LayoutManager to register a DOM container for an activity bar location.
     */
    public mount(location: ViewLocation, container: HTMLElement): void {
        this.containers.set(location, container);
        this.render(location);
    }

    /**
     * Register a new item in the activity bar.
     */
    public registerItem(item: ActivityBarItem): void {
        this.items.set(item.id, item);
        this.render(item.location);
    }

    /**
     * Unregister an item.
     */
    public unregisterItem(id: string): void {
        const item = this.items.get(id);
        if (item) {
            this.items.delete(id);
            this.render(item.location);
        }
    }

    /**
     * Set the active (highlighted) state for an icon in a specific location.
     */
    public setActive(location: ViewLocation, activeId: string | null): void {
        const container = this.containers.get(location);
        if (!container) return;

        container.querySelectorAll('i').forEach(icon => {
            const viewId = icon.getAttribute('data-view-id');
            if (viewId === activeId) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    }

    /**
     * Render the items into the specified container.
     */
    private render(location: ViewLocation): void {
        const container = this.containers.get(location);
        if (!container) return;

        // Clear existing
        container.innerHTML = '';

        // Get items for this location and sort them
        const locationItems = Array.from(this.items.values())
            .filter(item => item.location === location)
            .sort((a, b) => (a.order || 100) - (b.order || 100));

        locationItems.forEach(item => {
            const icon = document.createElement('i');
            icon.className = `${item.icon}`;
            icon.title = item.title;
            icon.style.cursor = 'pointer';
            icon.setAttribute('data-view-id', item.id);

            icon.addEventListener('click', () => {
                if (item.onClick) {
                    item.onClick();
                } else {
                    this.ide.views.renderView(item.location, item.id);
                }
            });

            container.appendChild(icon);
        });
    }
}
