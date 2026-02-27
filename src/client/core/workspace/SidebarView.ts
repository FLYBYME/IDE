import {
    BaseComponent, Stack, Row, ScrollArea, Button,
    Text, Heading, Divider, Theme, Spacer, Spinner
} from '../../ui-lib';
import { WorkspaceStateModel, Workspace } from './WorkspaceState';

export interface SidebarViewEvents {
    onLoginRequested: () => void;
    onRegisterRequested: () => void;
    onAccountRequested: () => void;
    onLogoutRequested: () => void;
    onWorkspaceSelected: (id: string, name: string) => void;
    onCreateWorkspaceRequested: () => void;
}

export class SidebarView extends BaseComponent {
    private events: SidebarViewEvents;

    constructor(events: SidebarViewEvents) {
        super('div');
        this.events = events;
        this.applyStyles({ height: '100%', width: '100%' });
    }

    /**
     * Maps the WorkspaceStateModel to the UI structure [cite: 4]
     */
    public render(): void {
        // This method will be called via updateProps or manual triggers
    }

    public update(state: WorkspaceStateModel): void {
        this.element.innerHTML = '';

        const mainStack = new Stack({
            direction: 'column',
            fill: true,
            children: [
                this.renderProfile(state),
                this.renderActiveWorkspace(state),
                new ScrollArea({
                    fill: true,
                    children: [this.renderWorkspaceList(state)]
                })
            ]
        });

        this.appendChildren(mainStack);
    }

    private renderProfile(state: WorkspaceStateModel): BaseComponent<any> {
        if (!state.currentUser) {
            return new Stack({
                padding: 'lg',
                align: 'center',
                gap: 'md',
                children: [
                    new Text({ text: '', size: 'lg', variant: 'muted', monospace: true }), // Font-awesome icon mock
                    new Text({
                        text: 'Sign in to access your cloud workspaces',
                        variant: 'muted',
                        size: 'sm'
                    }),
                    new Button({
                        label: 'Login',
                        variant: 'primary',
                        onClick: () => this.events.onLoginRequested()
                    }),
                    new Button({
                        label: 'Register',
                        variant: 'secondary',
                        onClick: () => this.events.onRegisterRequested()
                    })
                ]
            });
        }

        return new Stack({
            children: [
                new Row({
                    padding: 'md',
                    justify: 'space-between',
                    align: 'center',
                    children: [
                        new Row({
                            gap: 'sm',
                            children: [
                                new Text({ text: '', variant: 'accent' }),
                                new Text({
                                    text: state.currentUser.username,
                                    weight: 'bold',
                                    selectable: true
                                })
                            ]
                        }),
                        new Button({
                            icon: 'fas fa-sign-out-alt',
                            variant: 'ghost',
                            onClick: () => this.events.onLogoutRequested()
                        })
                    ]
                }),
                new Divider()
            ]
        });
    }

    private renderActiveWorkspace(state: WorkspaceStateModel): BaseComponent<any> | string {
        if (!state.activeWorkspace) return '';

        return new Stack({
            padding: 'md',
            gap: 'xs',
            children: [
                new Heading({
                    text: 'ACTIVE WORKSPACE',
                    level: 4,
                    variant: 'muted',
                    transform: 'uppercase'
                }),
                new Row({
                    gap: 'sm',
                    children: [
                        new Text({ text: '', variant: 'accent' }),
                        new Text({ text: state.activeWorkspace.name, weight: '600', variant: 'accent' })
                    ]
                }),
                new Divider()
            ]
        });
    }

    private renderWorkspaceList(state: WorkspaceStateModel): BaseComponent<any> {
        const children: (BaseComponent<any> | string)[] = [];

        // Header
        children.push(new Row({
            padding: 'md',
            justify: 'space-between',
            children: [
                new Heading({ text: 'YOUR WORKSPACES', level: 4, variant: 'muted' }),
                new Button({
                    icon: 'fas fa-plus',
                    variant: 'ghost',
                    onClick: () => this.events.onCreateWorkspaceRequested()
                })
            ]
        }));

        if (state.isLoading) {
            children.push(new Stack({ align: 'center', children: [new Spinner({ size: 'sm' })] }));
        } else if (state.workspaces.length === 0) {
            children.push(new Text({ text: 'No workspaces found.', variant: 'muted', size: 'sm' }));
        } else {
            state.workspaces.forEach(ws => {
                const isActive = state.activeWorkspace?.id === ws.id;
                const item = new Button({
                    label: ws.name,
                    icon: 'fas fa-folder',
                    variant: isActive ? 'secondary' : 'ghost',
                    onClick: () => this.events.onWorkspaceSelected(ws.id, ws.name)
                });

                // Custom override for list-item style
                item.getElement().style.width = '100%';
                item.getElement().style.justifyContent = 'flex-start';
                children.push(item);
            });
        }

        return new Stack({ gap: 'xs', children });
    }
}