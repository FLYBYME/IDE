// ui-lib/layout/Spacer.ts
import { BaseComponent } from '../BaseComponent';

/**
 * An invisible component that absorbs remaining flex space.
 * Perfect for pushing a toolbar to the left and a settings icon to the right.
 */
export class Spacer extends BaseComponent {
    constructor() {
        super('div');
        this.render();
    }

    public render(): void {
        this.applyStyles({
            flex: '1',
            pointerEvents: 'none'
        });
    }
}

