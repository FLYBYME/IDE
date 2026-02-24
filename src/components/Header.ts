
import { MenuBar } from "./MenuBar";
import { TitleBar } from "./TitleBar";

export class Header {
    private container: HTMLElement;
    public menuBar: MenuBar;
    public titleBar: TitleBar;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'header-container';

        this.menuBar = new MenuBar();
        this.titleBar = new TitleBar();
        this.buildstructure();
    }

    private buildstructure(): void {
        // Container needs relative positioning for the absolute title
        this.container.style.position = 'relative';

        // Left side: Menu
        const leftSection = document.createElement('div');
        leftSection.style.display = 'flex';
        leftSection.style.alignItems = 'center';

        leftSection.appendChild(this.menuBar.getElement());
        this.container.appendChild(leftSection);

        // Center: TitleBar
        // We append it to the container, and CSS will absolutely position it
        this.container.appendChild(this.titleBar.getElement());
    }

    public getElement(): HTMLElement {
        return this.container;
    }
}
