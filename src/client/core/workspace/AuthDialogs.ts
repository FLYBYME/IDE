import { FormDialog, PromptDialog } from '../../ui-lib';

export class AuthDialogs {
    constructor() { }

    public async showLogin(): Promise<{ username: string; password: string; rememberMe: boolean } | null> {
        const result = await FormDialog.show({
            fields: [
                { id: 'username', label: 'Username', required: true, placeholder: 'username' },
                { id: 'password', label: 'Password', type: 'password', required: true },
                { id: 'rememberMe', label: 'Remember Me', type: 'checkbox', value: true },
            ],
            title: 'Login',
            validateForm: async (values: Record<string, any>) => {
                if (values.username.includes(' ')) return 'Username cannot contain spaces.';
                return null; // OK
            }
        });

        if (!result) return null;

        return { username: result.username, password: result.password, rememberMe: !!result.rememberMe };
    }

    public async showRegister(): Promise<{ username: string; email: string; password: string } | null> {
        const result = await FormDialog.show({
            fields: [
                { id: 'username', label: 'Username', required: true, placeholder: 'username' },
                { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'email@example.com' },
                { id: 'password', label: 'Password', type: 'password', required: true },
            ],
            title: 'Create Account',
            validateForm: async (values: Record<string, any>) => {
                if (values.username.includes(' ')) return 'Username cannot contain spaces.';
                if (!values.email.includes('@')) return 'Please enter a valid email.';
                return null;
            }
        });

        if (!result) return null;

        return { username: result.username, email: result.email, password: result.password };
    }

    public async showAccount(user: { username: string; email?: string; bio?: string }): Promise<{ email?: string; bio?: string } | null> {
        const result = await FormDialog.show({
            fields: [
                { id: 'username', label: 'Username (Read-only)', value: user.username, disabled: true },
                { id: 'email', label: 'Email', value: user.email || '', placeholder: 'your@email.com' },
                { id: 'bio', label: 'Bio', type: 'textarea', value: user.bio || '', placeholder: 'Tell us about yourself...' },
            ],
            title: 'Account Settings',
        });

        if (!result) return null;

        return { email: result.email, bio: result.bio };
    }

    public async showCreateWorkspace(): Promise<string | null> {
        return PromptDialog.show({
            message: 'Workspace name:',
            title: 'New Workspace',
            placeholder: 'my-project',
        });
    }
}
