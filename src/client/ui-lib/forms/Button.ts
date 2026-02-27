// ui-lib/forms/Button.ts

import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';

export interface ButtonProps {
    label?: string;
    icon?: string; // e.g., 'fas fa-play' or 'lucide-play'
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'base' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: (e: MouseEvent) => void;
}

export class Button extends BaseComponent<ButtonProps> {
    constructor(props: ButtonProps) {
        super('button', props);
        this.render();
    }

    public render(): void {
        const {
            label,
            icon,
            variant = 'secondary',
            disabled = false,
            onClick
        } = this.props;

        // Base styles for all buttons
        this.applyStyles({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Theme.spacing.sm,
            padding: `${Theme.spacing.xs} ${Theme.spacing.sm}`,
            borderRadius: Theme.radius,
            border: '1px solid transparent',
            fontSize: Theme.font?.sizeBase || '13px',
            fontFamily: 'inherit',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? '0.5' : '1',
            outline: 'none',
            userSelect: 'none',
            transition: 'background-color 0.1s, border-color 0.1s'
        });

        // Variant-specific styles
        if (variant === 'primary') {
            this.applyStyles({
                backgroundColor: Theme.colors.accent,
                color: '#ffffff', // Primary text is usually forced white/light
            });
        } else if (variant === 'secondary') {
            this.applyStyles({
                backgroundColor: Theme.colors.bgTertiary,
                color: Theme.colors.textMain,
                border: `1px solid ${Theme.colors.border}`,
            });
        } else if (variant === 'ghost') {
            this.applyStyles({
                backgroundColor: 'transparent',
                color: Theme.colors.textMain,
            });
        }

        // Add Hover Effects (using standard DOM events since we can't use CSS pseudo-classes inline)
        if (!disabled) {
            this.element.onmouseenter = () => {
                if (variant === 'ghost') this.applyStyles({ backgroundColor: Theme.colors.bgTertiary });
                else if (variant === 'secondary') this.applyStyles({ backgroundColor: Theme.colors.border });
                // Primary hover can be handled by adjusting opacity or a specific hover token
            };
            this.element.onmouseleave = () => {
                if (variant === 'ghost') this.applyStyles({ backgroundColor: 'transparent' });
                else if (variant === 'secondary') this.applyStyles({ backgroundColor: Theme.colors.bgTertiary });
            };
        }

        // Structure the content
        if (icon) {
            const i = document.createElement('i');
            i.className = icon;
            this.element.appendChild(i);
        }

        if (label) {
            const span = document.createElement('span');
            span.textContent = label;
            this.element.appendChild(span);
        }

        // Attach event listener
        if (onClick && !disabled) {
            this.element.onclick = onClick;
        }
    }
}