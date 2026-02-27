import {
    Modal,
    Button,
    TextInput,
    TextArea,
    Checkbox,
    Select,
    Stack,
    Text,
    SearchInput,
    VirtualList,
    BaseComponent
} from '../ui-lib'; // Adjust path as needed [cite: 336, 337, 344]

// ── Types and Interfaces ──

export type InputValidator = (value: string) => string | null | Promise<string | null>;

export interface PromptOptions {
    title?: string;
    defaultValue?: string;
    placeholder?: string;
    password?: boolean;
    validateInput?: InputValidator;
    okLabel?: string;
}

export interface ConfirmOptions {
    title?: string;
    detail?: string;
    primaryLabel?: string;
    isDestructive?: boolean;
}

export interface FormField {
    id: string;
    label: string;
    type?: 'text' | 'password' | 'checkbox' | 'select' | 'email' | 'textarea';
    defaultValue?: any;
    value?: any;
    placeholder?: string;
    options?: { label: string; value: string }[];
    required?: boolean;
    disabled?: boolean;
}

export interface FormOptions {
    title?: string;
    message?: string;
    okLabel?: string;
    validateForm?: (values: Record<string, any>) => string | null | Promise<string | null>;
}

// ── Service Implementation ──

export class DialogService {

    /**
     * Replaces native confirm() using Modal and Button components[cite: 585, 122].
     */
    public confirm(message: string, options?: ConfirmOptions): Promise<boolean> {
        return new Promise((resolve) => {
            const body = new Stack({ gap: 'sm', padding: 'none' });
            body.appendChildren(new Text({ text: message }));

            if (options?.detail) {
                body.appendChildren(new Text({ text: options.detail, variant: 'muted', size: 'sm' }));
            }

            const modal = new Modal({
                title: options?.title || 'Confirm',
                children: [body],
                width: '400px',
                footer: [
                    new Button({
                        label: 'Cancel',
                        variant: 'secondary',
                        onClick: () => { modal.hide(); resolve(false); }
                    }),
                    new Button({
                        label: options?.primaryLabel || 'OK',
                        variant: 'primary',
                        onClick: () => { resolve(true); modal.hide(); }
                    })
                ],
                onClose: () => resolve(false)
            });

            modal.show();
        });
    }

    /**
     * Replaces native prompt() using TextInput and Modal components[cite: 278, 585].
     */
    public prompt(message: string, options?: PromptOptions): Promise<string | null> {
        return new Promise((resolve) => {
            let currentValue = options?.defaultValue || '';
            const input = new TextInput({
                placeholder: options?.placeholder,
                value: currentValue,
                type: options?.password ? 'password' : 'text',
                onChange: (val) => { currentValue = val; }
            });

            const body = new Stack({
                gap: 'md', children: [
                    new Text({ text: message }),
                    input
                ]
            });

            const modal = new Modal({
                title: options?.title || 'Input',
                children: [body],
                footer: [
                    new Button({
                        label: 'Cancel',
                        variant: 'secondary',
                        onClick: () => { modal.hide(); resolve(null); }
                    }),
                    new Button({
                        label: options?.okLabel || 'OK',
                        variant: 'primary',
                        onClick: () => { resolve(currentValue); modal.hide(); }
                    })
                ],
                onClose: () => resolve(null)
            });

            modal.show();
        });
    }

    /**
     * Multi-input form dialog using core form components[cite: 140, 234, 278].
     */
    public form(fields: FormField[], options?: FormOptions): Promise<Record<string, any> | null> {
        return new Promise((resolve) => {
            const values: Record<string, any> = {};
            const formStack = new Stack({ gap: 'md' });
            const errorText = new Text({ text: '', variant: 'error', size: 'sm' });
            errorText.getElement().style.display = 'none';

            if (options?.message) {
                formStack.appendChildren(new Text({ text: options.message, variant: 'muted' }));
            }

            formStack.appendChildren(errorText);

            fields.forEach(field => {
                let control: BaseComponent<any>;
                values[field.id] = field.value ?? field.defaultValue ?? '';

                if (field.type === 'checkbox') {
                    control = new Checkbox({
                        label: field.label,
                        checked: !!values[field.id],
                        disabled: field.disabled,
                        onChange: (val) => values[field.id] = val
                    });
                } else if (field.type === 'select') {
                    control = new Select({
                        options: field.options || [],
                        value: values[field.id],
                        disabled: field.disabled,
                        onChange: (val) => values[field.id] = val
                    });
                } else if (field.type === 'textarea') {
                    control = new TextArea({
                        placeholder: field.placeholder,
                        value: values[field.id],
                        disabled: field.disabled,
                        onChange: (val) => values[field.id] = val
                    });
                } else {
                    control = new TextInput({
                        type: field.type === 'password' ? 'password' : (field.type === 'email' ? 'email' : 'text'),
                        placeholder: field.placeholder,
                        value: values[field.id],
                        disabled: field.disabled,
                        onChange: (val) => values[field.id] = val
                    });
                }

                const fieldRow = new Stack({ gap: 'xs' });
                if (field.type !== 'checkbox') {
                    fieldRow.appendChildren(new Text({ text: field.label, weight: 'bold', size: 'sm' }));
                }
                fieldRow.appendChildren(control);
                formStack.appendChildren(fieldRow);
            });

            const modal = new Modal({
                title: options?.title || 'Form',
                children: [formStack],
                footer: [
                    new Button({
                        label: 'Cancel',
                        variant: 'secondary',
                        onClick: () => { modal.hide(); resolve(null); }
                    }),
                    new Button({
                        label: options?.okLabel || 'Submit',
                        variant: 'primary',
                        onClick: async () => {
                            if (options?.validateForm) {
                                const error = await options.validateForm(values);
                                if (error) {
                                    errorText.updateProps({ text: error });
                                    errorText.getElement().style.display = 'block';
                                    return;
                                }
                            }
                            resolve(values);
                            modal.hide();
                        }
                    })
                ],
                onClose: () => resolve(null)
            });

            modal.show();
        });
    }

    /**
     * Shows a quick pick dialog for selecting from a list of items.
     */
    public showQuickPick<T extends { id: string; label: string; description?: string; icon?: string }>(
        items: T[],
        options?: { placeholder?: string; title?: string }
    ): Promise<T | null> {
        return new Promise((resolve) => {
            let filteredItems = [...items];
            const list = new VirtualList({
                items: filteredItems,
                itemHeight: 32,
                height: '300px',
                renderItem: (item) => {
                    const row = document.createElement('div');
                    row.style.cssText = `
                        padding: 4px 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        border-radius: 4px;
                    `;
                    row.onmouseenter = () => row.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    row.onmouseleave = () => row.style.backgroundColor = 'transparent';
                    row.onclick = () => { resolve(item); modal.hide(); };

                    if (item.icon) {
                        const icon = document.createElement('i');
                        icon.className = item.icon;
                        icon.style.width = '16px';
                        icon.style.textAlign = 'center';
                        row.appendChild(icon);
                    }

                    const label = document.createElement('span');
                    label.textContent = item.label;
                    row.appendChild(label);

                    if (item.description) {
                        const desc = document.createElement('span');
                        desc.textContent = item.description;
                        desc.style.opacity = '0.5';
                        desc.style.fontSize = '0.9em';
                        desc.style.marginLeft = 'auto';
                        row.appendChild(desc);
                    }

                    return row;
                }
            });

            const searchInput = new SearchInput({
                placeholder: options?.placeholder || 'Search...',
                onChange: (val) => {
                    const term = val.toLowerCase();
                    filteredItems = items.filter(i =>
                        i.label.toLowerCase().includes(term) ||
                        (i.description && i.description.toLowerCase().includes(term))
                    );
                    list.setItems(filteredItems);
                }
            });

            const body = new Stack({
                gap: 'sm',
                children: [searchInput, list]
            });

            const modal = new Modal({
                title: options?.title || 'Select',
                children: [body],
                width: '500px',
                onClose: () => resolve(null)
            });

            modal.show();
            // Focus search input after a short delay to ensure DOM is ready
            setTimeout(() => {
                const input = searchInput.getElement().querySelector('input');
                if (input) input.focus();
            }, 50);
        });
    }
}