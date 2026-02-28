import { BaseComponent, ScrollArea, Stack, Text, Theme } from 'ide-core';
import { ScaffolderStateModel } from './ScaffolderState';

export class ScaffolderLogView extends BaseComponent {
    private logStack!: Stack;

    constructor() {
        super('div');
        this.applyStyles({ height: '100%', width: '100%', backgroundColor: Theme.colors.bgPrimary });
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';

        this.logStack = new Stack({
            direction: 'column',
            gap: 'xs',
            padding: 'sm'
        });

        const scrollArea = new ScrollArea({ fill: true, children: [this.logStack] });
        this.appendChildren(scrollArea);
    }

    public update(state: ScaffolderStateModel): void {
        this.logStack.getElement().innerHTML = '';

        if (state.logs.length === 0) {
            this.logStack.appendChildren(new Text({ text: 'Waiting to generate...', variant: 'muted', size: 'sm' }));
            return;
        }

        state.logs.forEach(log => {
            this.logStack.appendChildren(new Text({ text: `> ${log}`, monospace: true, size: 'sm' }));
        });

        // Auto-scroll to bottom
        const el = this.logStack.getElement().parentElement;
        if (el) el.scrollTop = el.scrollHeight;
    }
}