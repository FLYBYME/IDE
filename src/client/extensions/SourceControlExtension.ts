import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

/**
 * Transforms an ISO date string or timestamp number into a relative time (e.g. "2 hours ago")
 */
function getRelativeTime(timestamp: number | string): string {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const elapsed = new Date(timestamp).getTime() - Date.now();

    const divBy = [
        { amount: 1000, name: 'second' },
        { amount: 60, name: 'minute' },
        { amount: 60, name: 'hour' },
        { amount: 24, name: 'day' },
        { amount: 7, name: 'week' },
        { amount: 4.34524, name: 'month' },
        { amount: 12, name: 'year' },
    ];
    let time = elapsed;
    for (const div of divBy) {
        if (Math.abs(time) < div.amount) {
            return rtf.format(Math.round(time), div.name as Intl.RelativeTimeFormatUnit);
        }
        time /= div.amount;
    }
    return rtf.format(Math.round(time), 'year');
}

export const SourceControlExtension: Extension = {
    id: 'core.sourceControl',
    name: 'Source Control',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        let providerContainer: HTMLElement | null = null;

        // Helper to safely execute a render loop if the view is active
        const safeRender = () => {
            if (providerContainer && context.ide.activeWorkspace) {
                renderFullView(providerContainer);
            }
        };

        // 1. Define ViewProvider
        const scmProvider: ViewProvider = {
            id: 'core.sourceControl.sidebar',
            name: 'Source Control',
            resolveView: (container: HTMLElement, disposables: any[]) => {
                providerContainer = container;
                renderFullView(container);

                // Add a disposable to clear our reference when unmounted
                disposables.push({ dispose: () => { providerContainer = null; } });
            }
        };

        const renderFullView = async (container: HTMLElement) => {
            const workspaceId = context.ide.activeWorkspace?.id;
            if (!workspaceId) return;

            // Show loading state initially
            container.innerHTML = `
                <div class="scm-loading" style="padding: 24px; color: var(--ide-text-secondary); display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 14px;">
                    <i class="fas fa-circle-notch fa-spin"></i> <span>Initializing source control...</span>
                </div>
            `;

            try {
                // Fetch data in parallel
                const [status, log, branches] = await Promise.all([
                    context.ide.api.getSourceControlStatus(workspaceId),
                    context.ide.api.getSourceControlHistory(workspaceId),
                    context.ide.api.getSourceControlBranches(workspaceId),
                ]);

                const hasChanges = status.modified.length > 0 || status.new.length > 0 || status.deleted.length > 0;
                const totalChangesCount = status.modified.length + status.new.length + status.deleted.length;
                let headName = branches.head.replace('refs/heads/', '');

                container.innerHTML = `
                    <div class="scm-container scm-fade-in">
                        <div class="scm-header">
                            <button class="scm-branch-btn" id="scm-branch-btn" title="Checkout Branch">
                                <i class="fas fa-code-branch" style="opacity: 0.8;"></i>
                                <span>${headName}</span>
                            </button>
                            <div style="display: flex; gap: 4px;">
                                <div class="scm-action" id="scm-refresh-btn" title="Refresh Status"><i class="fas fa-sync-alt"></i></div>
                                <div class="scm-action" id="scm-create-btn" title="Create Branch"><i class="fas fa-plus"></i></div>
                                <div class="scm-action" id="scm-merge-btn" title="Merge Branch Into Current"><i class="fas fa-code-commit"></i></div>
                            </div>
                        </div>
                        <div class="scm-changes-area">
                            <textarea class="scm-textarea" id="scm-commit-input" placeholder="Message (Press Cmd+Enter to commit)"></textarea>
                            <div style="margin-bottom: 20px;">
                                <button class="scm-btn-primary" id="scm-commit-btn" ${!hasChanges ? 'disabled' : ''}>
                                    <i class="fas fa-check"></i> Commit
                                </button>
                            </div>
                            
                            <div class="scm-section-title">
                                <i class="fas fa-layer-group"></i> Changes 
                                ${totalChangesCount > 0 ? `<span class="scm-badge-count">${totalChangesCount}</span>` : ''}
                            </div>
                            
                            <div class="scm-file-list" id="scm-file-list"></div>
                        </div>
                        <div class="scm-history-area">
                            <div class="scm-section-title">
                                <i class="fas fa-history"></i> Commits
                            </div>
                            <div class="scm-commit-list" id="scm-commit-list"></div>
                        </div>
                    </div>
                `;

                // Attach Event Listeners
                container.querySelector('#scm-branch-btn')?.addEventListener('click', () => context.ide.commands.execute('git.checkout'));
                container.querySelector('#scm-refresh-btn')?.addEventListener('click', () => safeRender());
                container.querySelector('#scm-create-btn')?.addEventListener('click', () => context.ide.commands.execute('git.createBranch'));
                container.querySelector('#scm-merge-btn')?.addEventListener('click', () => context.ide.commands.execute('git.merge'));

                const commitInput = container.querySelector('#scm-commit-input') as HTMLTextAreaElement;
                const commitBtn = container.querySelector('#scm-commit-btn') as HTMLButtonElement;

                commitBtn.addEventListener('click', () => {
                    if (hasChanges && commitInput.value.trim()) {
                        context.ide.commands.execute('git.commit', commitInput.value.trim());
                    } else if (hasChanges) {
                        context.ide.notifications.notify('Commit message cannot be empty', 'warning');
                    }
                });

                commitInput.addEventListener('keydown', (e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        commitBtn.click();
                    }
                });

                // Render File List
                const fileList = container.querySelector('#scm-file-list')!;
                if (!hasChanges) {
                    fileList.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 0; color: var(--ide-text-secondary); opacity: 0.8; gap: 12px; font-size: 13px;">
                            <i class="fas fa-check-circle" style="font-size: 24px; color: var(--ide-accent-success, #2ecc71);"></i>
                            <span>Working tree clean</span>
                        </div>
                    `;
                } else {
                    const renderFile = (p: string, type: 'M' | 'U' | 'D', color: string, icon: string) => {
                        const row = document.createElement('div');
                        row.className = 'scm-file-row';
                        const filename = p.split('/').pop() || p;

                        row.innerHTML = `
                            <div class="scm-file-row-left" title="${p}">
                                <i class="fas ${icon} scm-file-icon" style="color: ${color}"></i>
                                <span>${filename}</span>
                            </div>
                            <div class="scm-status-badge" style="color: ${color}">${type}</div>
                        `;

                        if (type !== 'D') {
                            row.onclick = () => context.ide.commands.execute('file:open', p);
                        } else {
                            row.style.opacity = '0.6';
                            row.style.textDecoration = 'line-through';
                            row.style.cursor = 'default';
                        }
                        fileList.appendChild(row);
                    };

                    status.modified.forEach((p: string) => renderFile(p, 'M', 'var(--ide-accent-warning, #f39c12)', 'fa-file-signature'));
                    status.new.forEach((p: string) => renderFile(p, 'U', 'var(--ide-accent-success, #2ecc71)', 'fa-file-medical'));
                    status.deleted.forEach((p: string) => renderFile(p, 'D', 'var(--ide-accent-error, #e74c3c)', 'fa-file-excel'));
                }

                // Render Log
                const logList = container.querySelector('#scm-commit-list')!;
                if (log.length === 0) {
                    logList.innerHTML = `<div style="padding: 16px; color: var(--ide-text-secondary); text-align: center; font-size: 13px; font-style: italic;">No commits yet</div>`;
                } else {
                    log.forEach((commit: any) => {
                        const cRow = document.createElement('div');
                        cRow.className = 'scm-commit-row';
                        cRow.innerHTML = `
                            <div class="scm-commit-header">
                                <div class="scm-commit-msg">${commit.message.split('\\n')[0]}</div>
                                <div class="scm-commit-hash">${commit.hash.substring(0, 7)}</div>
                            </div>
                            <div class="scm-commit-footer">
                                <div class="scm-commit-author">
                                    <i class="fas fa-user-circle" style="opacity: 0.7;"></i>
                                    ${commit.author.split('<')[0].trim()}
                                </div>
                                <div class="scm-time">${getRelativeTime(commit.timestamp)}</div>
                            </div>
                        `;
                        logList.appendChild(cRow);
                    });
                }
            } catch (err) {
                console.error('Failed to render Source Control view:', err);
                container.innerHTML = `
                    <div style="padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--ide-accent-error, #e74c3c); text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 24px;"></i>
                        <div>Failed to load source control data.</div>
                        <button class="scm-btn-primary" style="width: auto;" id="scm-retry-btn">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                `;
                container.querySelector('#scm-retry-btn')?.addEventListener('click', () => safeRender());
            }
        };

        // Register View Provider
        context.ide.views.registerProvider('left-panel', scmProvider);

        // 2. Add Activity Bar Icon Manually
        const activityBar = document.querySelector('.activity-bar');
        if (activityBar) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-code-branch';
            icon.title = 'Source Control';
            icon.style.cursor = 'pointer';
            icon.setAttribute('data-view-id', scmProvider.id);

            icon.addEventListener('click', () => {
                context.ide.views.renderView('left-panel', scmProvider.id);
            });

            // Insert after File Explorer (which is index 0)
            if (activityBar.children.length > 1) {
                activityBar.insertBefore(icon, activityBar.children[1]);
            } else {
                activityBar.appendChild(icon);
            }
        }

        // 3. Register Commands
        context.ide.commands.register({
            id: 'git.refreshStatus',
            label: 'Refresh Source Control Status',
            handler: async () => {
                safeRender();
            }
        });

        context.ide.commands.register({
            id: 'git.commit',
            label: 'Commit Source Control',
            handler: async (message: string) => {
                const workspaceId = context.ide.activeWorkspace?.id;
                if (!workspaceId || !message) return;
                try {
                    const res = await context.ide.api.commitSourceControl(workspaceId, message);
                    context.ide.notifications.notify(`Committed successfully (${res.hash.substring(0, 7)})`, 'success');
                    safeRender();
                } catch (err: any) {
                    context.ide.notifications.notify(`Commit failed: ${err.message}`, 'error');
                }
            }
        });

        context.ide.commands.register({
            id: 'git.createBranch',
            label: 'Create Branch',
            handler: async () => {
                const workspaceId = context.ide.activeWorkspace?.id;
                if (!workspaceId) return;

                const name = await context.ide.dialogs.prompt('Enter new branch name:');
                if (!name) return;

                try {
                    await context.ide.api.createSourceControlBranch(workspaceId, name);
                    context.ide.notifications.notify(`Branch '${name}' created`, 'success');

                    // Ask if they want to checkout immediately
                    const doCheckout = await context.ide.dialogs.confirm(`Checkout branch '${name}' now?`);
                    if (doCheckout) {
                        context.ide.commands.execute('git.checkout', name);
                    } else {
                        safeRender();
                    }
                } catch (err: any) {
                    context.ide.notifications.notify(`Failed to create branch: ${err.message}`, 'error');
                }
            }
        });

        context.ide.commands.register({
            id: 'git.checkout',
            label: 'Checkout Branch',
            handler: async (targetRef?: string) => {
                const workspaceId = context.ide.activeWorkspace?.id;
                if (!workspaceId) return;

                try {
                    // 1. Guard for uncommitted changes
                    const status = await context.ide.api.getSourceControlStatus(workspaceId);
                    const hasChanges = status.modified.length > 0 || status.new.length > 0 || status.deleted.length > 0;

                    if (hasChanges) {
                        const proceed = await context.ide.dialogs.confirm(
                            'You have uncommitted changes. Checking out will discard them. Proceed?',
                            { title: 'Warning: Uncommitted Changes', isDestructive: true }
                        );
                        if (!proceed) return;
                    }

                    let refToCheckout = targetRef;

                    // 2. Pick a branch if not provided
                    if (!refToCheckout) {
                        const branches = await context.ide.api.getSourceControlBranches(workspaceId);
                        const picks = branches.branches.map((b: any) => ({
                            id: b.name,
                            label: b.name,
                            description: b.commitHash.substring(0, 7),
                            icon: b.isCurrent ? 'fas fa-check text-green-500' : 'fas fa-code-branch'
                        }));

                        const pick = await context.ide.dialogs.showQuickPick(picks, { placeholder: 'Select branch to checkout' });
                        if (!pick) return;
                        refToCheckout = pick.id;
                    }

                    // 3. Perform checkout
                    await context.ide.api.checkoutSourceControlRef(workspaceId, refToCheckout);
                    context.ide.notifications.notify(`Checked out ${refToCheckout}`, 'success');
                    safeRender();

                } catch (err: any) {
                    context.ide.notifications.notify(`Checkout failed: ${err.message}`, 'error');
                }
            }
        });

        context.ide.commands.register({
            id: 'git.merge',
            label: 'Merge Branch',
            handler: async () => {
                const workspaceId = context.ide.activeWorkspace?.id;
                if (!workspaceId) return;

                try {
                    // Pick a branch to merge into current
                    const branches = await context.ide.api.getSourceControlBranches(workspaceId);

                    // Exclude current branch from options
                    const otherBranches = branches.branches.filter((b: any) => !b.isCurrent);
                    if (otherBranches.length === 0) {
                        context.ide.notifications.notify('No other branches to merge.', 'info');
                        return;
                    }

                    const picks = otherBranches.map((b: any) => ({
                        id: b.name,
                        label: b.name,
                        description: b.commitHash.substring(0, 7)
                    }));

                    const pick = await context.ide.dialogs.showQuickPick(picks, { placeholder: 'Select branch to merge into current' });
                    if (!pick) return;

                    // Attempt Merge
                    const res = await context.ide.api.mergeSourceControlBranch(workspaceId, pick.id);
                    context.ide.notifications.notify(res.result || 'Merge successful', 'success');
                    safeRender();

                } catch (err: any) {
                    if (err.message?.includes('Merge conflict')) {
                        context.ide.notifications.notify('Merge Conflict Detected!', 'error');

                        // Launch Diff Resolution dialog if possible, or instruct user via notification
                        await context.ide.dialogs.confirm(
                            err.message + `\\n\\nResolve the conflict in the editor and then commit the changes manually.`,
                            { title: 'Merge Conflict' }
                        );
                        safeRender();
                    } else {
                        context.ide.notifications.notify(`Merge failed: ${err.message}`, 'error');
                    }
                }
            }
        });

        // 4. Listen for VFS auto-syncs or file saves so the SCM view stays up to date
        import('../core/CommandRegistry').then(({ CommandEvents, CommandIds }) => {
            context.ide.commands.on(CommandEvents.COMMAND_EXECUTED, (e: any) => {
                if (e.commandId === CommandIds.FILE_SAVE || e.commandId === CommandIds.FILE_SAVE_ALL) {
                    safeRender();
                }
            });
        });

        // Also listen to VFS 'change' events emitted by our worker bridges if we can
        // The VFS worker sends SSE broadcasts that MonacoVFSBridge listens to.
        // For simplicity, we can also bind a generic UI refresh event
        context.ide.commands.on('vfs.sync.complete', () => safeRender());
    }
};
