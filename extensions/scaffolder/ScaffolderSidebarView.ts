import { BaseComponent, Stack, Heading, TextInput, Checkbox, Button, Text, Divider, Row, Theme } from 'ide-core';
import { ScaffolderStateModel } from './ScaffolderState';
import { LayoutExamplesView } from './LayoutExamplesView';

export interface ScaffolderSidebarEvents {
    onNameChanged: (name: string) => void;
    onGitChanged: (checked: boolean) => void;
    onTsChanged: (checked: boolean) => void;
    onGenerateRequested: () => void;
}

type ViewType = 'layout' | 'generator';

export class ScaffolderSidebarView extends BaseComponent {
    private events: ScaffolderSidebarEvents;
    private generateBtn!: Button;
    private contentContainer!: Stack;
    private currentView: ViewType = 'layout';
    private lastState?: ScaffolderStateModel;

    constructor(events: ScaffolderSidebarEvents) {
        super('div');
        this.events = events;
        this.applyStyles({ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' });
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';

        // Tab Header
        const header = new Row({
            padding: 'xs',
            gap: 'xs',
            justify: 'center',
            children: [
                new Button({
                    label: 'LAYOUT',
                    variant: this.currentView === 'layout' ? 'primary' : 'secondary',
                    onClick: () => this.switchView('layout')
                }),
                new Button({
                    label: 'GENERATOR',
                    variant: this.currentView === 'generator' ? 'primary' : 'secondary',
                    onClick: () => this.switchView('generator')
                })
            ]
        });
        Object.assign(header.getElement().style, {
            borderBottom: `1px solid ${Theme.colors.border}`,
            flexShrink: '0'
        });

        this.contentContainer = new Stack({
            fill: true,
            scrollable: true,
            padding: 'none'
        });

        this.appendChildren(header, this.contentContainer);
        this.renderCurrentView();
    }

    private switchView(view: ViewType): void {
        if (this.currentView === view) return;
        this.currentView = view;
        this.render(); // Re-render to update button highlights
    }

    private renderCurrentView(): void {
        this.contentContainer.getElement().innerHTML = '';

        if (this.currentView === 'layout') {
            const layoutView = new LayoutExamplesView();
            this.contentContainer.appendChildren(layoutView);
        } else {
            this.renderGeneratorView();
        }
    }

    private renderGeneratorView(): void {
        const nameInput = new TextInput({
            placeholder: 'Project Name...',
            onChange: (val) => this.events.onNameChanged(val)
        });

        const gitCheck = new Checkbox({
            label: 'Initialize Git',
            checked: true,
            onChange: (val) => this.events.onGitChanged(val)
        });

        const tsCheck = new Checkbox({
            label: 'Use TypeScript',
            checked: true,
            onChange: (val) => this.events.onTsChanged(val)
        });

        this.generateBtn = new Button({
            label: 'Generate Boilerplate',
            variant: 'primary',
            icon: 'fas fa-hammer',
            onClick: () => this.events.onGenerateRequested()
        });

        const mainStack = new Stack({
            direction: 'column',
            gap: 'md',
            padding: 'md',
            children: [
                new Heading({ text: 'NEW PROJECT', level: 4, variant: 'muted' }),
                nameInput,
                new Divider(),
                gitCheck,
                tsCheck,
                new Divider(),
                this.generateBtn
            ]
        });

        this.contentContainer.appendChildren(mainStack);

        // Sync state if we have it
        if (this.lastState) {
            this.update(this.lastState);
        }
    }

    public update(state: ScaffolderStateModel): void {
        this.lastState = state;
        if (this.currentView !== 'generator' || !this.generateBtn) return;

        // Update UI based on state (e.g., disable button while generating)
        if (state.isGenerating) {
            this.generateBtn.updateProps({ label: 'Generating...', icon: 'fas fa-spinner fa-spin' });
            this.generateBtn.getElement().setAttribute('disabled', 'true');
        } else {
            this.generateBtn.updateProps({ label: 'Generate Boilerplate', icon: 'fas fa-hammer' });
            this.generateBtn.getElement().removeAttribute('disabled');
        }
    }
}