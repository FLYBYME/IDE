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

export class DialogService {

    // ── confirm() ───────────────────────────────────────────

    /**
     * Show a confirmation dialog.
     * Resolves `true` if the user clicks OK, `false` otherwise.
     */
    public confirm(message: string, title = 'Confirm'): Promise<boolean> {
        return new Promise((resolve) => {
            const { overlay, body, footer } = this.scaffold(title);

            const msg = document.createElement('p');
            msg.className = 'dialog-message';
            msg.textContent = message;
            body.appendChild(msg);

            const cancelBtn = this.button('Cancel', 'secondary');
            const okBtn = this.button('OK', 'primary');

            footer.appendChild(cancelBtn);
            footer.appendChild(okBtn);

            cancelBtn.addEventListener('click', () => { this.close(overlay); resolve(false); });
            okBtn.addEventListener('click', () => { this.close(overlay); resolve(true); });

            // ESC = cancel
            const onKey = (e: KeyboardEvent) => {
                if (e.key === 'Escape') { this.close(overlay); resolve(false); }
                if (e.key === 'Enter') { this.close(overlay); resolve(true); }
            };
            document.addEventListener('keydown', onKey, { once: true });

            document.body.appendChild(overlay);
            okBtn.focus();
        });
    }

    // ── prompt() ────────────────────────────────────────────

    /**
     * Show an input dialog.
     * Resolves the entered string, or `null` if the user cancels.
     */
    public prompt(message: string, defaultValue = '', title = 'Input'): Promise<string | null> {
        return new Promise((resolve) => {
            const { overlay, body, footer } = this.scaffold(title);

            const msg = document.createElement('p');
            msg.className = 'dialog-message';
            msg.textContent = message;
            body.appendChild(msg);

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'dialog-input';
            input.value = defaultValue;
            input.id = 'dialog-prompt-input';
            body.appendChild(input);

            const cancelBtn = this.button('Cancel', 'secondary');
            const okBtn = this.button('OK', 'primary');

            footer.appendChild(cancelBtn);
            footer.appendChild(okBtn);

            const submit = () => { this.close(overlay); resolve(input.value); };
            const cancel = () => { this.close(overlay); resolve(null); };

            cancelBtn.addEventListener('click', cancel);
            okBtn.addEventListener('click', submit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') cancel();
            });

            document.body.appendChild(overlay);

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
}
