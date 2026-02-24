/**
 * DialogService – Themed modal dialogs that replace native prompt() and confirm().
 *
 * All methods return Promises so callers can `await` them just like their
 * native counterparts.
 *
 *   const name = await ide.dialogs.prompt('Rename to:', oldName);
 *   const ok   = await ide.dialogs.confirm('Delete this file?');
 */

export type DialogResult<T> = T | null;

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

export interface QuickPickItem {
    id: string;             // Unique identifier for the selection
    label: string;          // Primary text 
    icon?: string;          // FontAwesome class 
    description?: string;   // Secondary text, usually faded
    detail?: string;        // Third line of text for extra info
    category?: string;      // Used to group items
    alwaysShow?: boolean;   // If true, bypasses the search filter
}

export interface QuickPickOptions {
    placeholder?: string;   // Text shown in the empty input box
    title?: string;         // Optional title shown above the input
    matchOnDescription?: boolean; // Whether fuzzy search checks the description field
    matchOnDetail?: boolean;      // Whether fuzzy search checks the detail field
}

export class DialogService {

    // ── confirm() ───────────────────────────────────────────

    /**
     * Show a confirmation dialog.
     * Resolves `true` if the user clicks OK, `false` otherwise.
     */
    public confirm(message: string, options?: ConfirmOptions): Promise<boolean> {
        return new Promise((resolve) => {
            const title = options?.title || 'Confirm';
            const { overlay, body, footer, card } = this.scaffold(title);

            const msg = document.createElement('p');
            msg.className = 'dialog-message';
            msg.textContent = message;
            body.appendChild(msg);

            if (options?.detail) {
                const detailMsg = document.createElement('p');
                detailMsg.className = 'dialog-detail';
                detailMsg.style.fontSize = '12px';
                detailMsg.style.opacity = '0.8';
                detailMsg.style.marginTop = '8px';
                detailMsg.textContent = options.detail;
                body.appendChild(detailMsg);
            }

            const cancelBtn = this.button('Cancel', 'secondary');
            const okBtn = this.button(options?.primaryLabel || 'OK', 'primary');

            if (options?.isDestructive) {
                okBtn.classList.add('dialog-btn-danger');
            }

            footer.appendChild(cancelBtn);
            footer.appendChild(okBtn);

            let isClosing = false;
            const doResolve = (val: boolean) => {
                if (isClosing) return;
                isClosing = true;
                this.close(overlay);
                resolve(val);
            };

            cancelBtn.addEventListener('click', () => doResolve(false));
            okBtn.addEventListener('click', () => doResolve(true));

            // ESC = cancel, Enter = confirm
            const onKey = (e: KeyboardEvent) => {
                if (e.key === 'Escape') doResolve(false);
                if (e.key === 'Enter') doResolve(true);
            };
            overlay.addEventListener('keydown', onKey);

            document.body.appendChild(overlay);

            this.trapFocus(card);
            okBtn.focus();
        });
    }

    // ── prompt() ────────────────────────────────────────────

    /**
     * Show an input dialog.
     * Resolves the entered string, or `null` if the user cancels.
     */
    public prompt(message: string, options?: PromptOptions): Promise<string | null> {
        return new Promise((resolve) => {
            const title = options?.title || 'Input';
            const { overlay, body, footer, card } = this.scaffold(title);

            const msg = document.createElement('p');
            msg.className = 'dialog-message';
            msg.textContent = message;
            body.appendChild(msg);

            const input = document.createElement('input');
            input.type = options?.password ? 'password' : 'text';
            input.className = 'dialog-input';
            input.value = options?.defaultValue || '';
            if (options?.placeholder) {
                input.placeholder = options.placeholder;
            }
            input.id = 'dialog-prompt-input';
            body.appendChild(input);

            const errorMsg = document.createElement('p');
            errorMsg.className = 'dialog-error-text';
            errorMsg.style.color = '#f44336';
            errorMsg.style.fontSize = '12px';
            errorMsg.style.marginTop = '8px';
            errorMsg.style.display = 'none';
            body.appendChild(errorMsg);

            const cancelBtn = this.button('Cancel', 'secondary');
            const okBtn = this.button(options?.okLabel || 'OK', 'primary');

            footer.appendChild(cancelBtn);
            footer.appendChild(okBtn);

            let isClosing = false;
            const doResolve = (val: string | null) => {
                if (isClosing) return;
                isClosing = true;
                this.close(overlay);
                resolve(val);
            };

            const submit = async () => {
                if (options?.validateInput) {
                    okBtn.disabled = true;
                    // Note: validateInput can be async
                    const error = await Promise.resolve(options.validateInput(input.value));
                    okBtn.disabled = false;

                    if (error) {
                        errorMsg.textContent = error;
                        errorMsg.style.display = 'block';
                        input.classList.add('error');
                        input.focus();
                        return; // Prevent closing
                    }
                }
                doResolve(input.value);
            };
            const cancel = () => doResolve(null);

            cancelBtn.addEventListener('click', cancel);
            okBtn.addEventListener('click', submit);

            input.addEventListener('input', () => {
                // Clear error on next type
                errorMsg.style.display = 'none';
                input.classList.remove('error');
            });

            overlay.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') cancel();
            });

            document.body.appendChild(overlay);

            this.trapFocus(card);

            // Focus & select input text
            requestAnimationFrame(() => { input.focus(); input.select(); });
        });
    }

    // ── Internals ───────────────────────────────────────────

    private scaffold(title: string) {
        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';

        // Card
        const card = document.createElement('div');
        card.className = 'dialog-card';

        // Header
        const header = document.createElement('div');
        header.className = 'dialog-header';
        header.textContent = title;
        card.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'dialog-body';
        card.appendChild(body);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'dialog-footer';
        card.appendChild(footer);

        overlay.appendChild(card);

        // Prevent clicks on the backdrop from bubbling into the IDE
        overlay.addEventListener('mousedown', (e) => {
            if (e.target === overlay) e.stopPropagation();
        });

        return { overlay, card, body, footer };
    }

    private button(label: string, variant: 'primary' | 'secondary'): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.className = `dialog-btn dialog-btn-${variant}`;
        btn.textContent = label;
        return btn;
    }

    private close(overlay: HTMLElement): void {
        overlay.classList.add('dialog-closing');
        overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
        // Fallback if animation doesn't fire
        setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 300);
    }

    private trapFocus(element: HTMLElement) {
        const focusableEls = element.querySelectorAll<HTMLElement>(
            'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="password"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
        );

        if (focusableEls.length === 0) return;

        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];

        element.addEventListener('keydown', (e) => {
            const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

            if (!isTabPressed) {
                return;
            }

            if (e.shiftKey) { /* shift + tab */
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
            } else { /* tab */
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }
        });
    }

    // ── showQuickPick() ─────────────────────────────────────

    /**
     * Shows a selection list.
     * Resolves with the selected item, or null if the user hits Escape or clicks away.
     */
    public showQuickPick(items: QuickPickItem[] | Promise<QuickPickItem[]>, options?: QuickPickOptions): Promise<QuickPickItem | null> {
        return new QuickInputController().show(items, options);
    }
}

// ── QuickInputController ─────────────────────────────────────────────

class QuickInputController {
    private overlay!: HTMLElement;
    private input!: HTMLInputElement;
    private listContainer!: HTMLElement;

    private allItems: QuickPickItem[] = [];
    private visibleItems: QuickPickItem[] = [];
    private activeIndex: number = -1;
    private resolvePromise!: (item: QuickPickItem | null) => void;

    private matchOnDescription = false;
    private matchOnDetail = false;

    public show(items: QuickPickItem[] | Promise<QuickPickItem[]>, options?: QuickPickOptions): Promise<QuickPickItem | null> {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.matchOnDescription = !!options?.matchOnDescription;
            this.matchOnDetail = !!options?.matchOnDetail;

            this.scaffold(options);

            // Fetch items
            if (items instanceof Promise) {
                this.input.placeholder = 'Loading...';
                this.renderLoading();
                items.then(resolvedItems => {
                    this.allItems = resolvedItems;
                    this.input.placeholder = options?.placeholder || 'Type to search...';
                    this.filterAndRender('');
                }).catch(err => {
                    console.error('Failed to load QuickPick items', err);
                    this.resolvePromise(null);
                    this.dispose();
                });
            } else {
                this.allItems = items;
                this.filterAndRender('');
            }
        });
    }

    private scaffold(options?: QuickPickOptions) {
        this.overlay = document.createElement('div');
        this.overlay.className = 'quick-pick-overlay';

        // Clicking outside closes the palette
        this.overlay.addEventListener('mousedown', (e) => {
            if (e.target === this.overlay) {
                e.stopPropagation();
                this.resolvePromise(null);
                this.dispose();
            }
        });

        const widget = document.createElement('div');
        widget.className = 'quick-pick-widget';

        if (options?.title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'quick-pick-title';
            titleEl.textContent = options.title;
            widget.appendChild(titleEl);
        }

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'quick-pick-input';
        this.input.placeholder = options?.placeholder || 'Type to search...';
        widget.appendChild(this.input);

        this.listContainer = document.createElement('div');
        this.listContainer.className = 'quick-pick-list';
        widget.appendChild(this.listContainer);

        this.overlay.appendChild(widget);
        document.body.appendChild(this.overlay);

        // Bind events
        this.input.addEventListener('input', () => this.filterAndRender(this.input.value));
        this.input.addEventListener('keydown', (e) => this.onKeyDown(e));

        // Focus
        requestAnimationFrame(() => this.input.focus());
    }

    private onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.resolvePromise(null);
            this.dispose();
            return;
        }

        if (this.visibleItems.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.activeIndex = (this.activeIndex + 1) % this.visibleItems.length;
            this.renderHighlight();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.activeIndex = (this.activeIndex - 1 + this.visibleItems.length) % this.visibleItems.length;
            this.renderHighlight();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = this.visibleItems[this.activeIndex];
            if (selected) {
                this.resolvePromise(selected);
                this.dispose();
            }
        }
    }

    private filterAndRender(query: string) {
        query = query.toLowerCase().trim();

        if (!query) {
            this.visibleItems = [...this.allItems];
        } else {
            this.visibleItems = this.allItems.filter(item => {
                if (item.alwaysShow) return true;
                if (item.label.toLowerCase().includes(query)) return true;
                if (this.matchOnDescription && item.description && item.description.toLowerCase().includes(query)) return true;
                if (this.matchOnDetail && item.detail && item.detail.toLowerCase().includes(query)) return true;
                return false;
            });
        }

        this.activeIndex = this.visibleItems.length > 0 ? 0 : -1;
        this.renderList();
    }

    private renderLoading() {
        this.listContainer.innerHTML = '<div class="quick-pick-message">Loading...</div>';
    }

    private renderList() {
        this.listContainer.innerHTML = '';

        if (this.visibleItems.length === 0) {
            this.listContainer.innerHTML = '<div class="quick-pick-message">No matching results</div>';
            return;
        }

        let currentCategory: string | undefined = undefined;

        this.visibleItems.forEach((item, index) => {
            if (item.category && item.category !== currentCategory) {
                const catHeader = document.createElement('div');
                catHeader.className = 'quick-pick-category';
                catHeader.textContent = item.category;
                this.listContainer.appendChild(catHeader);
                currentCategory = item.category;
            }

            const itemEl = document.createElement('div');
            itemEl.className = 'quick-pick-item';
            itemEl.dataset.index = String(index);

            // Icon
            const iconWrap = document.createElement('div');
            iconWrap.className = 'quick-pick-item-icon';
            if (item.icon) {
                const img = document.createElement('i');
                img.className = item.icon;
                iconWrap.appendChild(img);
            } else {
                // Add a placeholder spacer
                iconWrap.style.width = '16px';
            }
            itemEl.appendChild(iconWrap);

            // Content container (Label + Desc row, Detail row)
            const contentCont = document.createElement('div');
            contentCont.className = 'quick-pick-item-content';

            const topRow = document.createElement('div');
            topRow.className = 'quick-pick-item-top';

            const labelEl = document.createElement('span');
            labelEl.className = 'quick-pick-item-label';
            labelEl.textContent = item.label;
            topRow.appendChild(labelEl);

            if (item.description) {
                const descEl = document.createElement('span');
                descEl.className = 'quick-pick-item-description';
                descEl.textContent = item.description;
                topRow.appendChild(descEl);
            }
            contentCont.appendChild(topRow);

            if (item.detail) {
                const detailEl = document.createElement('div');
                detailEl.className = 'quick-pick-item-detail';
                detailEl.textContent = item.detail;
                contentCont.appendChild(detailEl);
            }

            itemEl.appendChild(contentCont);

            // Mouse hover support
            itemEl.addEventListener('mouseenter', () => {
                this.activeIndex = index;
                this.renderHighlight();
            });

            // Click support
            itemEl.addEventListener('click', () => {
                this.resolvePromise(item);
                this.dispose();
            });

            this.listContainer.appendChild(itemEl);
        });

        this.renderHighlight();
    }

    private renderHighlight() {
        const items = Array.from(this.listContainer.querySelectorAll('.quick-pick-item'));
        items.forEach((el, idx) => {
            if (idx === this.activeIndex) {
                el.classList.add('active');
                (el as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                el.classList.remove('active');
            }
        });
    }

    private dispose() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}
