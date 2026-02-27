import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';
import { Badge } from '../feedback/Badge';
import { Popover } from '../overlays/Popover';

export interface MultiSelectProps {
    options: { label: string; value: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}

export class MultiSelectTagInput extends BaseComponent<MultiSelectProps> {
    private container: HTMLDivElement;

    constructor(props: MultiSelectProps) {
        super('div', props);
        this.container = document.createElement('div');
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';
        const { options, selectedValues, placeholder = 'Select items...' } = this.props;

        this.applyStyles({
            display: 'flex',
            flexDirection: 'column',
            gap: Theme.spacing.xs,
            width: '100%'
        });

        Object.assign(this.container.style, {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            padding: Theme.spacing.xs,
            backgroundColor: Theme.colors.bgTertiary, // 
            border: `1px solid ${Theme.colors.border}`,
            borderRadius: Theme.radius,
            minHeight: '30px',
            cursor: 'pointer'
        });

        if (selectedValues.length === 0) {
            const placeholderEl = document.createElement('span');
            placeholderEl.textContent = placeholder;
            placeholderEl.style.color = Theme.colors.textMuted;
            placeholderEl.style.fontSize = Theme.font.sizeBase;
            this.container.appendChild(placeholderEl);
        } else {
            selectedValues.forEach(val => {
                const option = options.find(o => o.value === val);
                if (option) {
                    const badge = new Badge({
                        count: option.label,
                        variant: 'accent',
                        size: 'md'
                    });
                    const badgeEl = badge.getElement();
                    badgeEl.style.cursor = 'pointer';
                    badgeEl.onclick = (e) => {
                        e.stopPropagation();
                        this.props.onChange(selectedValues.filter(v => v !== val));
                    };
                    this.container.appendChild(badgeEl);
                }
            });
        }

        this.container.onclick = () => this.showDropdown();
        this.element.appendChild(this.container);
    }

    private showDropdown(): void {
        const items = this.props.options.map(opt => {
            const isSelected = this.props.selectedValues.includes(opt.value);
            const el = document.createElement('div');
            Object.assign(el.style, {
                padding: `4px ${Theme.spacing.md}`,
                cursor: 'pointer',
                backgroundColor: isSelected ? Theme.colors.bgSecondary : 'transparent',
                color: Theme.colors.textMain
            });

            el.onclick = () => {
                const next = isSelected
                    ? this.props.selectedValues.filter(v => v !== opt.value)
                    : [...this.props.selectedValues, opt.value];
                this.props.onChange(next);
            };
            el.textContent = opt.label;
            return el;
        });

        const popover = new Popover({
            anchor: this.container,
            content: items,
            placement: 'bottom'
        });
        popover.show();
    }
}