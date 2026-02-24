/**
 * NotificationService - Provides toast notifications and status bar messages.
 *
 * Replaces raw `alert()` / `console.log` for user-facing feedback.
 */

import { StatusBar } from '../components/StatusBar';

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';

interface ToastOptions {
    message: string;
    severity: NotificationSeverity;
    timeout: number;
}

const SEVERITY_CONFIG: Record<NotificationSeverity, { icon: string; defaultTimeout: number }> = {
    info: { icon: 'fas fa-info-circle', defaultTimeout: 5000 },
    success: { icon: 'fas fa-check-circle', defaultTimeout: 4000 },
    warning: { icon: 'fas fa-exclamation-triangle', defaultTimeout: 6000 },
    error: { icon: 'fas fa-times-circle', defaultTimeout: 8000 },
};

export class NotificationService {
    private container: HTMLElement;
    private statusBar: StatusBar;
    private statusTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor(statusBar: StatusBar) {
        this.statusBar = statusBar;

        // Create the toast container and append to <body>
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        document.body.appendChild(this.container);
    }

    /**
     * Show a toast notification.
     */
    public notify(message: string, severity: NotificationSeverity = 'info', timeout?: number): void {
        const config = SEVERITY_CONFIG[severity];
        const opts: ToastOptions = {
            message,
            severity,
            timeout: timeout ?? config.defaultTimeout,
        };
        this.createToast(opts);
    }

    /**
     * Display a transient message in the status bar (no toast).
     * Reverts after `timeout` ms (default 4 s).
     */
    public setStatusMessage(message: string, timeout: number = 4000): void {
        const item = this.statusBar.getItem('notification-status');
        if (item) {
            item.updateLabel(message);
        }

        if (this.statusTimeout) {
            clearTimeout(this.statusTimeout);
        }

        this.statusTimeout = setTimeout(() => {
            if (item) {
                item.updateLabel('');
            }
            this.statusTimeout = null;
        }, timeout);
    }

    // ── Private ──────────────────────────────────────────────

    private createToast(opts: ToastOptions): void {
        const toast = document.createElement('div');
        toast.className = `notification-toast severity-${opts.severity}`;

        const config = SEVERITY_CONFIG[opts.severity];

        // Icon
        const icon = document.createElement('i');
        icon.className = `notification-icon ${config.icon}`;
        toast.appendChild(icon);

        // Message
        const msg = document.createElement('span');
        msg.className = 'notification-message';
        msg.textContent = opts.message;
        toast.appendChild(msg);

        // Close button
        const close = document.createElement('i');
        close.className = 'notification-close fas fa-times';
        close.addEventListener('click', () => this.dismissToast(toast));
        toast.appendChild(close);

        this.container.appendChild(toast);

        // Trigger reflow so CSS transition kicks in
        void toast.offsetHeight;
        toast.classList.add('show');

        // Auto-dismiss
        if (opts.timeout > 0) {
            setTimeout(() => this.dismissToast(toast), opts.timeout);
        }
    }

    private dismissToast(toast: HTMLElement): void {
        if (!toast.parentNode) return; // already removed
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => {
            toast.remove();
        }, { once: true });
    }
}
