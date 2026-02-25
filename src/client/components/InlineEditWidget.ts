/**
 * InlineEditWidget - Inline AI prompt widget injected between editor lines
 * using Monaco's IViewZone API. Triggered via Ctrl+K.
 */

import { IDE } from '../core/IDE';

export interface InlineEditWidgetOptions {
    ide: IDE;
    editorId: string;
    lineNumber: number;
    onSubmit: (prompt: string, context: string) => Promise<void>;
    onCancel?: () => void;
}

export class InlineEditWidget {
    private ide: IDE;
    private editorId: string;
    private lineNumber: number;
    private zoneId: string | null = null;
    private domNode: HTMLElement;
    private input: HTMLInputElement;
    private generateBtn: HTMLButtonElement;
    private onSubmit: (prompt: string, context: string) => Promise<void>;
    private onCancel?: () => void;
    private isLoading: boolean = false;

    constructor(options: InlineEditWidgetOptions) {
        this.ide = options.ide;
        this.editorId = options.editorId;
        this.lineNumber = options.lineNumber;
        this.onSubmit = options.onSubmit;
        this.onCancel = options.onCancel;

        this.domNode = this.buildDOM();
        this.input = this.domNode.querySelector('.inline-llm-input') as HTMLInputElement;
        this.generateBtn = this.domNode.querySelector('.inline-llm-btn-generate') as HTMLButtonElement;

        // Inject via MonacoService
        this.zoneId = this.ide.monaco.showInlineWidget(
            this.editorId,
            this.lineNumber,
            this.domNode,
            3 // height in lines
        );

        // Auto-focus the input after a brief delay (ViewZone needs to render)
        requestAnimationFrame(() => {
            this.input.focus();
        });
    }

    private buildDOM(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'inline-llm-prompt';

        // Prevent Monaco from stealing our keyboard events
        container.addEventListener('keydown', (e) => e.stopPropagation());
        container.addEventListener('keypress', (e) => e.stopPropagation());
        container.addEventListener('keyup', (e) => e.stopPropagation());

        // Top row: icon + input
        const row = document.createElement('div');
        row.className = 'inline-llm-prompt-row';

        const icon = document.createElement('i');
        icon.className = 'fas fa-wand-magic-sparkles inline-llm-prompt-icon';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'inline-llm-input';
        input.placeholder = 'Ask AI to edit code...';
        input.spellcheck = false;
        input.autocomplete = 'off';

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !this.isLoading) {
                e.preventDefault();
                this.handleSubmit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.close();
            }
        });

        row.appendChild(icon);
        row.appendChild(input);
        container.appendChild(row);

        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'inline-llm-actions';

        const hint = document.createElement('span');
        hint.className = 'inline-llm-hint';
        hint.innerHTML = '<kbd>Enter</kbd> to generate · <kbd>Esc</kbd> to cancel';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'inline-llm-btn inline-llm-btn-cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => this.close());

        const generateBtn = document.createElement('button');
        generateBtn.className = 'inline-llm-btn inline-llm-btn-generate';
        generateBtn.textContent = 'Generate';
        generateBtn.addEventListener('click', () => this.handleSubmit());

        actions.appendChild(hint);
        actions.appendChild(cancelBtn);
        actions.appendChild(generateBtn);
        container.appendChild(actions);

        return container;
    }

    private gatherContext(): string {
        const editor = this.ide.monaco.getEditor(this.editorId);
        if (!editor) return '';
        const model = editor.getModel();
        if (!model) return '';

        // Gather surrounding lines as context (up to 20 lines above/below)
        const startLine = Math.max(1, this.lineNumber - 20);
        const endLine = Math.min(model.getLineCount(), this.lineNumber + 20);
        const lines: string[] = [];
        for (let i = startLine; i <= endLine; i++) {
            lines.push(model.getLineContent(i));
        }
        return lines.join('\n');
    }

    private async handleSubmit(): Promise<void> {
        const prompt = this.input.value.trim();
        if (!prompt || this.isLoading) return;

        this.setLoading(true);

        try {
            const context = this.gatherContext();
            await this.onSubmit(prompt, context);
        } catch (err) {
            console.error('InlineEditWidget: submit error', err);
        } finally {
            this.close();
        }
    }

    private setLoading(loading: boolean): void {
        this.isLoading = loading;
        this.input.disabled = loading;
        this.generateBtn.disabled = loading;

        if (loading) {
            this.generateBtn.innerHTML = '<span class="inline-llm-spinner"></span>';
        } else {
            this.generateBtn.textContent = 'Generate';
        }
    }

    public close(): void {
        if (this.zoneId) {
            this.ide.monaco.closeInlineWidget(this.zoneId);
            this.zoneId = null;
        }
        if (this.onCancel) {
            this.onCancel();
        }
    }
}
