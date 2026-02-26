import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

export const ExtensionBuilderExtension: Extension = {
    id: 'core.extensionBuilder',
    name: 'Extension Builder',
    version: '1.1.0',

    activate(context: ExtensionContext) {
        const { ide } = context;

        const builderProvider: ViewProvider = {
            id: 'core.extensionBuilder.view',
            name: 'Extension Builder',

            async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]) {
                container.innerHTML = '';

                // 1. Inject Scoped CSS
                if (!document.getElementById('ext-builder-styles')) {
                    const style = document.createElement('style');
                    style.id = 'ext-builder-styles';
                    style.innerHTML = `
                        .eb-card {
                            background: rgba(30, 30, 33, 0.6);
                            backdrop-filter: blur(16px);
                            -webkit-backdrop-filter: blur(16px);
                            border: 1px solid rgba(255, 255, 255, 0.06);
                            border-radius: 12px;
                            padding: 24px;
                            margin-bottom: 24px;
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                        }
                        .eb-form-group {
                            margin-bottom: 16px;
                        }
                        .eb-label {
                            display: block;
                            margin-bottom: 6px;
                            color: var(--text-main, #ccc);
                            font-size: 13px;
                            font-weight: 500;
                        }
                        .eb-btn-submit {
                            padding: 10px 20px;
                            background: linear-gradient(135deg, #007acc, #005f9e);
                            color: #fff;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                            transition: all 0.2s;
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            font-size: 13px;
                        }
                        .eb-btn-submit:hover:not(:disabled) {
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(0, 122, 204, 0.4);
                        }
                        .eb-btn-submit:disabled {
                            opacity: 0.6;
                            cursor: not-allowed;
                        }
                        .eb-logs {
                            background: #111111;
                            color: #d4d4d4;
                            padding: 16px;
                            border-radius: 8px;
                            height: 300px;
                            overflow-y: auto;
                            font-family: 'JetBrains Mono', monospace;
                            font-size: 12px;
                            border: 1px solid rgba(255,255,255,0.05);
                            margin: 0;
                            white-space: pre-wrap;
                        }
                        .eb-history-item {
                            padding: 12px 16px;
                            background: rgba(0, 0, 0, 0.2);
                            border-radius: 8px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border: 1px solid rgba(255, 255, 255, 0.05);
                            transition: all 0.2s ease;
                            cursor: pointer;
                        }
                        .eb-history-item:hover {
                            background: rgba(255, 255, 255, 0.03);
                            border-color: rgba(0, 122, 204, 0.4);
                        }
                        .eb-badge {
                            padding: 4px 10px;
                            border-radius: 12px;
                            font-size: 10px;
                            font-weight: bold;
                            letter-spacing: 0.5px;
                        }
                        .eb-badge.status-ready { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
                        .eb-badge.status-failed { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
                        .eb-badge.status-progress { background: rgba(217, 119, 6, 0.15); color: #fbbf24; border: 1px solid rgba(217, 119, 6, 0.3); }
                        .eb-badge.status-unknown { background: rgba(75, 85, 99, 0.15); color: #9ca3af; border: 1px solid rgba(75, 85, 99, 0.3); }
                        
                        .eb-icon-btn {
                            background: transparent;
                            border: none;
                            color: var(--text-muted, #888);
                            cursor: pointer;
                            padding: 8px;
                            border-radius: 4px;
                            transition: all 0.2s;
                        }
                        .eb-icon-btn:hover {
                            color: #ef4444;
                            background: rgba(239, 68, 68, 0.1);
                        }
                    `;
                    document.head.appendChild(style);
                }

                // 2. Base Layout Setup
                const wrapper = document.createElement('div');
                wrapper.className = 'settings-editor';
                wrapper.style.flex = '1';
                wrapper.style.overflowY = 'auto';

                wrapper.innerHTML = `
                    <div class="settings-header">
                        <h1 class="settings-title">Extension Builder</h1>
                        <p class="settings-subtitle">Submit a GitHub repository to build and publish a new extension to the marketplace.</p>
                    </div>
                    
                    <div class="settings-sections">
                        <div class="eb-card">
                            <div class="eb-form-group">
                                <label class="eb-label">Git Repository URL <span style="color:#ef4444">*</span></label>
                                <input type="text" id="eb-input-url" class="settings-search" style="width: 100%; box-sizing: border-box;" placeholder="https://github.com/user/repo.git">
                            </div>
                            <div class="eb-form-group">
                                <label class="eb-label">Git Branch</label>
                                <input type="text" id="eb-input-branch" class="settings-search" style="width: 100%; box-sizing: border-box;" value="main" placeholder="main">
                            </div>
                            <div class="eb-form-group">
                                <label class="eb-label">Manifest Path</label>
                                <input type="text" id="eb-input-manifest" class="settings-search" style="width: 100%; box-sizing: border-box;" value="/package.json" placeholder="/package.json">
                            </div>
                            <button id="eb-btn-submit" class="eb-btn-submit">
                                <i class="fas fa-cloud-upload-alt"></i> Submit Build
                            </button>
                        </div>

                        <div id="eb-monitor-card" class="eb-card" style="display: none;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <h3 style="margin: 0; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                                    <i class="fas fa-terminal" style="color: var(--accent);"></i> Build Status
                                </h3>
                                <span id="eb-status-badge" class="eb-badge status-unknown">WAITING</span>
                            </div>
                            <pre id="eb-logs-output" class="eb-logs">Waiting for build initialization...\n</pre>
                        </div>

                        <div class="eb-card">
                            <h3 style="margin: 0 0 16px 0; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-history" style="color: var(--accent);"></i> Build History
                            </h3>
                            <div id="eb-history-list" style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading history...</div>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(wrapper);

                // 3. DOM References
                const inputUrl = wrapper.querySelector('#eb-input-url') as HTMLInputElement;
                const inputBranch = wrapper.querySelector('#eb-input-branch') as HTMLInputElement;
                const inputManifest = wrapper.querySelector('#eb-input-manifest') as HTMLInputElement;
                const btnSubmit = wrapper.querySelector('#eb-btn-submit') as HTMLButtonElement;

                const monitorCard = wrapper.querySelector('#eb-monitor-card') as HTMLElement;
                const statusBadge = wrapper.querySelector('#eb-status-badge') as HTMLElement;
                const logsOutput = wrapper.querySelector('#eb-logs-output') as HTMLElement;

                const historyList = wrapper.querySelector('#eb-history-list') as HTMLElement;

                let pollInterval: any = null;

                // Cleanup polling on view close
                disposables.push({
                    dispose: () => {
                        if (pollInterval) clearInterval(pollInterval);
                    }
                });

                // 4. Polling Logic
                const pollStatus = async (buildId: string) => {
                    try {
                        const status = await ide.api.getExtensionBuildStatus(buildId);

                        // Update Badge Class
                        statusBadge.textContent = status.status;
                        statusBadge.className = 'eb-badge'; // reset

                        if (status.status === 'READY') {
                            statusBadge.classList.add('status-ready');
                            if (pollInterval) clearInterval(pollInterval);
                            ide.notifications.notify('Extension build completed successfully!', 'success');
                            loadHistory();
                        } else if (status.status === 'FAILED') {
                            statusBadge.classList.add('status-failed');
                            if (pollInterval) clearInterval(pollInterval);
                            ide.notifications.notify('Extension build failed.', 'error');
                            loadHistory();
                        } else {
                            statusBadge.classList.add('status-progress');
                        }

                        // Update Logs
                        if (status.buildLogs) {
                            logsOutput.textContent = status.buildLogs;
                            logsOutput.scrollTop = logsOutput.scrollHeight;
                        }
                    } catch (err: any) {
                        ide.notifications.notify(`Failed to fetch build status: ${err.message}`, 'error');
                        if (pollInterval) clearInterval(pollInterval);
                    }
                };

                // 5. History Rendering Logic
                const loadHistory = async () => {
                    try {
                        const result = await ide.api.listExtensionVersions();
                        const versions = result.versions || [];

                        if (versions.length === 0) {
                            historyList.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">No build history found.</div>';
                            return;
                        }

                        historyList.innerHTML = versions.map((v: any) => {
                            let badgeClass = 'status-progress';
                            if (v.status === 'READY') badgeClass = 'status-ready';
                            if (v.status === 'FAILED') badgeClass = 'status-failed';

                            return `
                                <div class="eb-history-item" data-id="${v.id}" data-status="${v.status}">
                                    <div style="display: flex; align-items: center; gap: 16px;">
                                        <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(0,122,204,0.1); color: #007acc; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-box"></i>
                                        </div>
                                        <div>
                                            <div style="font-weight: 600; font-size: 13px;">${v.extensionName} <span style="color: var(--text-muted); font-weight: normal;">(v${v.version})</span></div>
                                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${new Date(v.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span class="eb-badge ${badgeClass}">${v.status}</span>
                                        <button class="eb-icon-btn btn-delete-history" data-id="${v.id}" data-name="${v.extensionName}" data-version="${v.version}" title="Delete Version">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('');

                        // Attach Event Listeners to history items
                        historyList.querySelectorAll('.eb-history-item').forEach(item => {
                            item.addEventListener('click', (e) => {
                                // Ignore clicks on the delete button
                                if ((e.target as HTMLElement).closest('.btn-delete-history')) return;

                                const vid = item.getAttribute('data-id')!;
                                const vstatus = item.getAttribute('data-status')!;

                                monitorCard.style.display = 'block';
                                logsOutput.textContent = 'Loading logs...\n';
                                statusBadge.textContent = 'LOADING';
                                statusBadge.className = 'eb-badge status-unknown';

                                if (pollInterval) clearInterval(pollInterval);
                                if (['PENDING', 'CLONING', 'INSTALLING', 'BUILDING'].includes(vstatus)) {
                                    pollInterval = setInterval(() => pollStatus(vid), 3000);
                                }
                                pollStatus(vid);
                            });
                        });

                        // Attach Event Listeners to delete buttons
                        historyList.querySelectorAll('.btn-delete-history').forEach(btn => {
                            btn.addEventListener('click', async (e) => {
                                const id = btn.getAttribute('data-id')!;
                                const name = btn.getAttribute('data-name');
                                const version = btn.getAttribute('data-version');

                                if (!confirm(`Delete version v${version} of ${name}? This cannot be undone.`)) return;

                                try {
                                    (btn as HTMLButtonElement).disabled = true;
                                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                                    await ide.api.deleteExtensionVersion(id);
                                    ide.notifications.notify(`Deleted version v${version}`, 'success');
                                    loadHistory(); // refresh list
                                } catch (err: any) {
                                    ide.notifications.notify(`Failed to delete version: ${err.message}`, 'error');
                                    (btn as HTMLButtonElement).disabled = false;
                                    btn.innerHTML = '<i class="fas fa-trash"></i>';
                                }
                            });
                        });

                    } catch (err: any) {
                        historyList.innerHTML = `<div style="color: var(--error-color, #f44336); padding: 12px;">Failed to load history: ${err.message}</div>`;
                    }
                };

                // Initial load
                loadHistory();

                // 6. Form Submission
                btnSubmit.addEventListener('click', async () => {
                    const url = inputUrl.value.trim();
                    const branch = inputBranch.value.trim() || 'main';
                    const manifest = inputManifest.value.trim() || '/package.json';

                    // Basic URL validation
                    if (!url || !url.startsWith('http')) {
                        ide.notifications.notify('A valid Git Repository URL (http/https) is required.', 'error');
                        return;
                    }

                    try {
                        btnSubmit.disabled = true;
                        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

                        const { buildId } = await ide.api.submitExtension(url, branch, manifest);
                        ide.notifications.notify('Build submitted successfully', 'info');

                        // Reveal monitor & Reset UI
                        monitorCard.style.display = 'block';
                        logsOutput.textContent = 'Waiting for logs...\n';
                        statusBadge.textContent = 'PENDING';
                        statusBadge.className = 'eb-badge status-progress';

                        if (pollInterval) clearInterval(pollInterval);
                        pollInterval = setInterval(() => pollStatus(buildId), 3000);
                        pollStatus(buildId);

                        // Refresh history immediately to show the new pending build
                        loadHistory();

                    } catch (err: any) {
                        ide.notifications.notify(`Build submission failed: ${err.message}`, 'error');
                    } finally {
                        btnSubmit.disabled = false;
                        btnSubmit.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Submit Build';
                    }
                });
            },
        };

        ide.views.registerProvider('center-panel', builderProvider);

        const buildCmd = ide.commands.registerDisposable({
            id: 'extensions.build',
            label: 'Extension Builder',
            handler: () => {
                ide.views.renderView('center-panel', builderProvider.id);
            },
        });
        context.subscriptions.push(buildCmd);

        ide.activityBar.registerItem({
            id: 'extensions.builder.activityBar',
            location: 'left-panel',
            icon: 'fas fa-tools',
            title: 'Extension Builder',
            order: 999,
            onClick: () => ide.commands.execute('extensions.build')
        });
    },
};