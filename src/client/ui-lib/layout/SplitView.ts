// ui-lib/layout/SplitView.ts

import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';

export interface SplitViewProps {
    orientation?: 'horizontal' | 'vertical';
    panes: (BaseComponent<any> | Node)[];
    initialSizes?: number[]; // Percentages e.g. [30, 70]
    minSizes?: number[]; // Pixels e.g. [100, 100]
}

export class SplitView extends BaseComponent<SplitViewProps> {
    private paneElements: HTMLElement[] = [];
    private sashes: HTMLElement[] = [];

    constructor(props: SplitViewProps) {
        super('div', props);
        this.render();
    }

    public render(): void {
        const {
            orientation = 'horizontal',
            panes,
            initialSizes = [],
            minSizes = []
        } = this.props;

        this.applyStyles({
            display: 'flex',
            flexDirection: orientation === 'horizontal' ? 'row' : 'column',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
        });

        this.element.innerHTML = '';
        this.paneElements = [];
        this.sashes = [];

        panes.forEach((pane, index) => {
            const paneWrapper = document.createElement('div');
            Object.assign(paneWrapper.style, {
                flex: index < initialSizes.length ? `0 0 ${initialSizes[index]}%` : '1',
                overflow: 'hidden',
                position: 'relative',
                minWidth: orientation === 'horizontal' ? (minSizes[index] ? `${minSizes[index]}px` : '0') : '0',
                minHeight: orientation === 'vertical' ? (minSizes[index] ? `${minSizes[index]}px` : '0') : '0'
            });

            if (pane instanceof BaseComponent) {
                paneWrapper.appendChild(pane.getElement());
            } else {
                paneWrapper.appendChild(pane);
            }

            this.element.appendChild(paneWrapper);
            this.paneElements.push(paneWrapper);

            // Add sash after each pane except the last one
            if (index < panes.length - 1) {
                const sash = document.createElement('div');
                Object.assign(sash.style, {
                    width: orientation === 'horizontal' ? '4px' : '100%',
                    height: orientation === 'vertical' ? '4px' : '100%',
                    backgroundColor: 'transparent',
                    cursor: orientation === 'horizontal' ? 'col-resize' : 'row-resize',
                    zIndex: '10',
                    flexShrink: '0',
                    transition: 'background-color 0.2s'
                });

                sash.onmouseenter = () => sash.style.backgroundColor = Theme.colors.accent;
                sash.onmouseleave = () => sash.style.backgroundColor = 'transparent';

                this.setupDrag(sash, index);
                this.element.appendChild(sash);
                this.sashes.push(sash);
            }
        });
    }

    private setupDrag(sash: HTMLElement, leftPaneIndex: number): void {
        let startPos = 0;
        let leftPaneStartSize = 0;
        let rightPaneStartSize = 0;

        const onMouseMove = (e: MouseEvent) => {
            const delta = (this.props.orientation === 'vertical' ? e.clientY : e.clientX) - startPos;
            const leftPane = this.paneElements[leftPaneIndex];
            const rightPane = this.paneElements[leftPaneIndex + 1];

            const leftSize = leftPaneStartSize + delta;
            const rightSize = rightPaneStartSize - delta;

            if (leftSize > 50 && rightSize > 50) { // Simple min size check
                leftPane.style.flex = `0 0 ${leftSize}px`;
                rightPane.style.flex = `1 1 auto`;
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.cursor = '';
        };

        sash.onmousedown = (e: MouseEvent) => {
            e.preventDefault();
            startPos = this.props.orientation === 'vertical' ? e.clientY : e.clientX;
            leftPaneStartSize = this.props.orientation === 'vertical' ? this.paneElements[leftPaneIndex].offsetHeight : this.paneElements[leftPaneIndex].offsetWidth;
            rightPaneStartSize = this.props.orientation === 'vertical' ? this.paneElements[leftPaneIndex + 1].offsetHeight : this.paneElements[leftPaneIndex + 1].offsetWidth;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.body.style.cursor = this.props.orientation === 'horizontal' ? 'col-resize' : 'row-resize';
        };
    }
}
