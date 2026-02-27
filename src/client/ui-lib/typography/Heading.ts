// ui-lib/typography/Heading.ts

import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';

export interface HeadingProps {
    text: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6; // Maps to h1-h6
    variant?: 'main' | 'muted';
    transform?: 'none' | 'uppercase' | 'capitalize';
}

export class Heading extends BaseComponent<HeadingProps> {
    constructor(props: HeadingProps) {
        // Dynamically create the correct header tag
        super(`h${props.level || 3}`, props);
        this.render();
    }

    public render(): void {
        const {
            text,
            level = 3,
            variant = 'main',
            transform = 'none'
        } = this.props;

        const color = variant === 'muted' ? Theme.colors.textMuted : Theme.colors.textMain;

        // Calculate size based on heading level (IDE headings are usually quite small)
        const sizes = {
            1: '24px',
            2: '18px',
            3: '14px',  // Standard Panel Title
            4: '12px',  // Uppercase section headers
            5: '11px',
            6: '10px'
        };

        this.applyStyles({
            color,
            fontSize: sizes[level],
            fontWeight: level <= 3 ? '600' : 'bold',
            textTransform: transform,
            margin: '0', // Reset default browser margins
            padding: `0 0 ${Theme.spacing.sm} 0`, // Slight bottom padding
            userSelect: 'none'
        });

        this.element.textContent = text;
    }
}