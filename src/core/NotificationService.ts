/**
 * NotificationService - Provides interactive toast notifications and status bar messages.
 *
 * Replaces raw `alert()` / `console.log` for user-facing feedback.
 */

import { StatusBar } from '../components/StatusBar';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';

export interface NotificationAction {
    label: string;
    action: () => void | Promise<void>;
    isPrimary?: boolean;
}

export interface NotificationSource {
    id: string;
    label: string;
}

export interface NotificationOptions {
    message: string;
    detail?: string;
    severity?: NotificationSeverity;
    source?: NotificationSource;
    actions?: NotificationAction[];
    timeout?: number;
    progress?: boolean;
}

export interface NotificationHandle {
    close: () => void;
    updateMessage: (newMessage: string) => void;
    updateProgress: (isProgressing: boolean) => void;
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
    private activeToasts: Set<HTMLElement> = new Set();

    constructor(statusBar: StatusBar) {
        this.statusBar = statusBar;

        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        document.body.appendChild(this.container);
    }

    /**
     * Show a toast notification.
     * Overloaded to accept a simple string or a full options object.
     */
    public notify(message: string, severity?: NotificationSeverity, timeout?: number): NotificationHandle;
    public notify(options: NotificationOptions): NotificationHandle;
    public notify(arg: string | NotificationOptions, severityOrConfig?: NotificationSeverity, timeoutOrConfig?: number): NotificationHandle {
        let opts: NotificationOptions;

        if (typeof arg === 'string') {
            opts = {
                message: arg,
                severity: severityOrConfig || 'info',
                timeout: timeoutOrConfig
            };
        } else {
            opts = arg;
        }

        return this.createToast(opts);
    }

    /**
     * Display a transient message in the status bar (no toast).
     */
    public setStatusMessage(message: string, timeout: number = 4000): void {
        const item = this.statusBar.getItem('notification-status');
        if (item) item.updateLabel(message);

        if (this.statusTimeout) clearTimeout(this.statusTimeout);

        this.statusTimeout = setTimeout(() => {
            if (item) item.updateLabel('');
            this.statusTimeout = null;
        }, timeout);
    }

    /**
     * Clears all active toast notifications immediately.
     */
    public clearAll(): void {
        this.activeToasts.forEach(toast => this.dismissToast(toast, true));
        this.activeToasts.clear();
    }

    // ── Private ──────────────────────────────────────────────

    private createToast(opts: NotificationOptions): NotificationHandle {
        const severity = opts.severity || 'info';
        const config = SEVERITY_CONFIG[severity];

        const toast = document.createElement('div');
        toast.className = `notification-toast severity-${severity}`;
        this.activeToasts.add(toast);

        // -- Main Row --
        const mainRow = document.createElement('div');
        mainRow.className = 'toast-main-row';

        const icon = document.createElement('i');
        icon.className = `notification-icon ${config.icon}`;
        mainRow.appendChild(icon);

        const msgSpan = document.createElement('span');
        msgSpan.className = 'toast-message';
        msgSpan.textContent = opts.message;
        mainRow.appendChild(msgSpan);

        const controls = document.createElement('div');
        controls.className = 'toast-controls';

        if (opts.source) {
            const gear = document.createElement('i');
            gear.className = 'fas fa-cog toast-action-icon';
            gear.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // We're taking source from the scope
                const source = opts.source!;
                const items: ContextMenuItem[] = [
                    {
                        label: `Manage Extension`,
                        icon: 'fas fa-puzzle-piece',
                        action: () => console.log('Manage extension:', source.id)
                    },
                    {
                        label: `Turn Off Notifications from '${source.label}'`,
                        icon: 'fas fa-bell-slash',
                        action: () => console.log('Disable notifications for:', source.id)
                    }
                ];
                new ContextMenu(items, e.clientX, e.clientY);
            });
            controls.appendChild(gear);
        }

        const hasExpandedArea = !!opts.detail || (opts.actions && opts.actions.length > 0);
        let chevron: HTMLElement | null = null;
        let expandedArea: HTMLElement | null = null;

        if (hasExpandedArea) {
            chevron = document.createElement('i');
            chevron.className = 'fas fa-chevron-down toast-action-icon';
            controls.appendChild(chevron);
        }

        const closeBtn = document.createElement('i');
        closeBtn.className = 'notification-close fas fa-times toast-action-icon';
        closeBtn.addEventListener('click', () => this.dismissToast(toast));
        controls.appendChild(closeBtn);

        mainRow.appendChild(controls);
        toast.appendChild(mainRow);

        // -- Expanded Area --
        if (hasExpandedArea) {
            expandedArea = document.createElement('div');
            expandedArea.className = 'toast-expanded-area';
            expandedArea.style.display = 'none'; // hidden by default

            if (opts.detail) {
                const detailP = document.createElement('p');
                detailP.className = 'toast-detail';
                detailP.textContent = opts.detail;
                expandedArea.appendChild(detailP);
            }

            if (opts.actions && opts.actions.length > 0) {
                const actionsRow = document.createElement('div');
                actionsRow.className = 'toast-actions-row';

                opts.actions.forEach(act => {
                    const btn = document.createElement('button');
                    btn.className = `toast-btn ${act.isPrimary ? 'toast-btn-primary' : ''}`;
                    btn.textContent = act.label;
                    btn.addEventListener('click', async () => {
                        try {
                            await Promise.resolve(act.action());
                        } catch (err) {
                            console.error('Action error', err);
                        } finally {
                            this.dismissToast(toast);
                        }
                    });
                    actionsRow.appendChild(btn);
                });
                expandedArea.appendChild(actionsRow);
            }

            toast.appendChild(expandedArea);

            chevron!.addEventListener('click', () => {
                const isHidden = expandedArea!.style.display === 'none';
                expandedArea!.style.display = isHidden ? 'block' : 'none';
                chevron!.className = `fas fa-chevron-${isHidden ? 'up' : 'down'} toast-action-icon`;
            });
        }

        // -- Footer --
        let progressBar: HTMLElement | null = null;

        if (opts.source || opts.progress) {
            const footer = document.createElement('div');
            footer.className = 'toast-footer';

            if (opts.source) {
                const sourceSpan = document.createElement('span');
                sourceSpan.className = 'toast-source';
                sourceSpan.textContent = `Source: ${opts.source.label}`;
                footer.appendChild(sourceSpan);
            }

            if (opts.progress) {
                progressBar = document.createElement('div');
                progressBar.className = 'notification-progress-bar active';
                footer.appendChild(progressBar);
            }

            toast.appendChild(footer);
        }

        this.container.appendChild(toast);

        // Reflow & Show
        void toast.offsetHeight;
        toast.classList.add('show');

        // -- Timeout Logic with Hover Pause --
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let timeRemaining = opts.timeout ?? config.defaultTimeout;
        let lastResumeTime = Date.now();

        const resumeTimer = () => {
            if (timeRemaining > 0) {
                lastResumeTime = Date.now();
                timeoutId = setTimeout(() => this.dismissToast(toast), timeRemaining);
            }
        };

        const pauseTimer = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
                timeRemaining -= (Date.now() - lastResumeTime);
            }
        };

        toast.addEventListener('mouseenter', pauseTimer);
        toast.addEventListener('mouseleave', resumeTimer);

        // Start initial timer
        resumeTimer();

        // Return a handle to the caller
        return {
            close: () => this.dismissToast(toast),
            updateMessage: (newMsg: string) => {
                msgSpan.textContent = newMsg;
            },
            updateProgress: (isProgressing: boolean) => {
                if (progressBar) {
                    progressBar.style.display = isProgressing ? 'block' : 'none';
                }
            }
        };
    }

    private dismissToast(toast: HTMLElement, immediate = false): void {
        if (!toast.parentNode) return;
        this.activeToasts.delete(toast);

        if (immediate) {
            toast.remove();
            return;
        }

        toast.classList.add('hide');
        toast.addEventListener('animationend', () => {
            toast.remove();
        }, { once: true });
    }
}
