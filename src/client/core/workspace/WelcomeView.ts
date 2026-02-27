import { WorkspaceStateModel } from './WorkspaceState';
import {
    BaseComponent,
    Theme,
    Stack,
    Heading,
    Text,
    Button,
    KeybindingLabel
} from '../../ui-lib';

export interface WelcomeViewEvents {
    onLoginRequested: () => void;
    onRegisterRequested: () => void;
    onCreateRequested: () => void;
    onOpenRequested: () => void;
    onLogoutRequested: () => void;
}

export interface WelcomeViewProps extends WelcomeViewEvents {
    state: WorkspaceStateModel;
}

export class WelcomeView extends BaseComponent<WelcomeViewProps> {
    constructor(props: WelcomeViewProps) {
        super('div', props);
        this.render();
    }

    public render(): void {
        const { state } = this.props;
        const loggedIn = !!state.currentUser;

        this.applyStyles({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '40px 20px',
            backgroundColor: Theme.colors.bgPrimary,
            color: Theme.colors.textMuted,
            fontFamily: Theme.font?.family || 'var(--font-ui)'
        });

        const mainStack = new Stack({
            align: 'center',
            justify: 'center',
            gap: 'lg',
            width: '420px',
        });

        // Logo & Title
        const headerStack = new Stack({
            align: 'center',
            gap: 'sm'
        });

        const logo = document.createElement('i');
        logo.className = 'fas fa-code';
        logo.style.cssText = `font-size: 48px; color: ${Theme.colors.accent}; margin-bottom: 8px;`;

        headerStack.appendChildren(
            logo,
            new Heading({ text: 'CanvasLLM IDE', level: 1 }),
            new Text({
                text: loggedIn ? 'Select or create a workspace to get started.' : 'Sign in to access your cloud workspaces.',
                variant: 'muted'
            })
        );

        // Actions
        const actionsStack = new Stack({
            width: '100%',
            gap: 'md'
        });

        if (loggedIn) {
            actionsStack.appendChildren(
                this.createActionCard('fas fa-folder-plus', 'New Workspace', 'Create a new project workspace', () => this.props.onCreateRequested()),
                this.createActionCard('fas fa-folder-open', 'Open Workspace', 'Open an existing workspace', () => this.props.onOpenRequested()),
                this.createActionCard('fas fa-sign-out-alt', 'Logout', 'Sign out of your account', () => this.props.onLogoutRequested())
            );
        } else {
            actionsStack.appendChildren(
                this.createActionCard('fas fa-sign-in-alt', 'Login', 'Sign in to access your workspaces', () => this.props.onLoginRequested()),
                this.createActionCard('fas fa-user-plus', 'Register', 'Create a new account', () => this.props.onRegisterRequested())
            );
        }

        // Footer
        const footer = new Stack({
            direction: 'row',
            align: 'center',
            justify: 'center',
            gap: 'xs',
            padding: 'md'
        });

        footer.appendChildren(
            new KeybindingLabel({ keys: ['Ctrl', 'Shift', 'P'] }),
            new Text({ text: ' to open the Command Palette', variant: 'muted', size: 'sm' })
        );

        mainStack.appendChildren(headerStack, actionsStack, footer);
        this.appendChildren(mainStack);
    }

    private createActionCard(icon: string, title: string, desc: string, action: () => void): Button {
        const card = new Button({
            variant: 'secondary',
            onClick: action
        });

        const el = card.getElement();
        el.style.width = '100%';
        el.style.height = 'auto';
        el.style.padding = '14px 18px';
        el.style.justifyContent = 'flex-start';
        el.style.textAlign = 'left';

        const content = new Stack({ align: 'flex-start', gap: 'none' });
        content.appendChildren(
            new Text({ text: title, weight: '600' }),
            new Text({ text: desc, variant: 'muted', size: 'sm' })
        );

        const iconEl = document.createElement('i');
        iconEl.className = icon;
        iconEl.style.cssText = `font-size: 20px; color: ${Theme.colors.accent}; width: 24px; text-align: center; margin-right: 14px;`;

        el.innerHTML = ''; // Clear default Button content
        el.appendChild(iconEl);
        card.appendChildren(content);

        return card;
    }

    public update(state: WorkspaceStateModel): void {
        this.updateProps({ state });
    }
}
