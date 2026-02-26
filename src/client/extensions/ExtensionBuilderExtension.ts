import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

export const ExtensionBuilderExtension: Extension = {
    id: 'core.extensionBuilder',
    name: 'Extension Builder',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        const { ide } = context;

        const builderProvider: ViewProvider = {
            id: 'core.extensionBuilder.view',
            name: 'Extension Builder',

            async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]) {
                container.innerHTML = '';

                const wrapper = document.createElement('div');
                wrapper.className = 'settings-editor'; // Reuse layout styles
                wrapper.style.flex = '1';
                wrapper.style.minHeight = '0';
                wrapper.style.overflowY = 'auto';
                wrapper.style.padding = '20px';
                container.appendChild(wrapper);

                // ── Header ─────────────────────────────────
                const header = document.createElement('div');
                header.className = 'settings-header';

                const title = document.createElement('h1');
                title.className = 'settings-title';
                title.textContent = 'Extension Builder';
                header.appendChild(title);

                const subtitle = document.createElement('p');
                subtitle.className = 'settings-subtitle';
                subtitle.textContent = 'Submit a GitHub repository to build and publish a new extension to the marketplace.';
                header.appendChild(subtitle);

                wrapper.appendChild(header);

                // ── Submission Form ────────────────────────
                const formWrap = document.createElement('div');
                formWrap.style.background = 'rgba(30,30,30,0.6)';
                formWrap.style.backdropFilter = 'blur(10px)';
                formWrap.style.border = '1px solid rgba(255,255,255,0.1)';
                formWrap.style.padding = '24px';
                formWrap.style.borderRadius = '12px';
                formWrap.style.marginBottom = '24px';
                formWrap.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';

                const createInput = (labelTxt: string, placeholder: string, defaultValue: string = '') => {
                    const group = document.createElement('div');
                    group.style.marginBottom = '15px';
                    const label = document.createElement('label');
                    label.textContent = labelTxt;
                    label.style.display = 'block';
                    label.style.marginBottom = '5px';
                    label.style.color = '#ccc';
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'settings-search'; // Reuse input style
                    input.style.width = '100%';
                    input.style.boxSizing = 'border-box';
                    input.placeholder = placeholder;
                    input.value = defaultValue;
                    group.appendChild(label);
                    group.appendChild(input);
                    return { group, input };
                };

                const { group: urlGroup, input: urlInput } = createInput('Git Repository URL (*)', 'https://github.com/user/repo.git');
                const { group: branchGroup, input: branchInput } = createInput('Git Branch', 'main', 'main');
                const { group: manifestGroup, input: manifestInput } = createInput('Manifest Path', '/package.json', '/package.json');

                formWrap.appendChild(urlGroup);
                formWrap.appendChild(branchGroup);
                formWrap.appendChild(manifestGroup);

                const submitBtn = document.createElement('button');
                submitBtn.innerHTML = '<i class="fas fa-cloud-upload-alt" style="margin-right: 8px;"></i> Submit Build';
                submitBtn.style.padding = '12px 24px';
                submitBtn.style.background = 'linear-gradient(135deg, #007acc, #005f9e)';
                submitBtn.style.color = '#fff';
                submitBtn.style.border = 'none';
                submitBtn.style.borderRadius = '6px';
                submitBtn.style.cursor = 'pointer';
                submitBtn.style.fontWeight = 'bold';
                submitBtn.style.transition = 'all 0.3s ease';
                submitBtn.style.boxShadow = '0 4px 15px rgba(0,122,204,0.4)';

                submitBtn.addEventListener('mouseenter', () => {
                    submitBtn.style.transform = 'translateY(-2px)';
                    submitBtn.style.boxShadow = '0 6px 20px rgba(0,122,204,0.6)';
                });
                submitBtn.addEventListener('mouseleave', () => {
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 4px 15px rgba(0,122,204,0.4)';
                });

                submitBtn.addEventListener('mousedown', () => {
                    submitBtn.style.transform = 'translateY(1px)';
                    submitBtn.style.boxShadow = '0 2px 10px rgba(0,122,204,0.4)';
                });

                formWrap.appendChild(submitBtn);
                wrapper.appendChild(formWrap);

                // ── Build Monitor ──────────────────────────
                const monitorWrap = document.createElement('div');
                monitorWrap.style.display = 'none';
                monitorWrap.style.flexDirection = 'column';
                monitorWrap.style.gap = '10px';
                wrapper.appendChild(monitorWrap);

                const statusHeader = document.createElement('div');
                statusHeader.style.display = 'flex';
                statusHeader.style.justifyContent = 'space-between';
                statusHeader.style.alignItems = 'center';

                const statusTitle = document.createElement('h3');
                statusTitle.textContent = 'Build Status';
                statusTitle.style.margin = '0';

                const statusBadge = document.createElement('span');
                statusBadge.style.padding = '4px 8px';
                statusBadge.style.borderRadius = '4px';
                statusBadge.style.fontSize = '12px';
                statusBadge.style.fontWeight = 'bold';

                statusHeader.appendChild(statusTitle);
                statusHeader.appendChild(statusBadge);
                monitorWrap.appendChild(statusHeader);

                const logsOutput = document.createElement('pre');
                logsOutput.style.background = '#1e1e1e';
                logsOutput.style.color = '#d4d4d4';
                logsOutput.style.padding = '15px';
                logsOutput.style.borderRadius = '6px';
                logsOutput.style.height = '300px';
                logsOutput.style.overflowY = 'auto';
                logsOutput.style.fontFamily = 'monospace';
                logsOutput.style.fontSize = '12px';
                logsOutput.style.margin = '0';
                monitorWrap.appendChild(logsOutput);

                // ── Build History ──────────────────────────
                const historyWrap = document.createElement('div');
                historyWrap.style.marginTop = '24px';
                historyWrap.style.background = 'rgba(30,30,30,0.6)';
                historyWrap.style.backdropFilter = 'blur(10px)';
                historyWrap.style.border = '1px solid rgba(255,255,255,0.1)';
                historyWrap.style.padding = '24px';
                historyWrap.style.borderRadius = '12px';
                historyWrap.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';

                const historyTitle = document.createElement('h3');
                historyTitle.textContent = 'Build History';
                historyTitle.style.marginTop = '0';
                historyTitle.style.marginBottom = '20px';
                historyTitle.style.display = 'flex';
                historyTitle.style.alignItems = 'center';
                historyTitle.style.gap = '8px';
                historyTitle.innerHTML = '<i class="fas fa-history" style="color: #007acc;"></i> Build History';
                historyWrap.appendChild(historyTitle);

                const historyList = document.createElement('div');
                historyList.style.display = 'flex';
                historyList.style.flexDirection = 'column';
                historyList.style.gap = '10px';
                historyWrap.appendChild(historyList);

                wrapper.appendChild(historyWrap);

                // Polling Logic
                let pollInterval: any = null;

                disposables.push({
                    dispose: () => {
                        if (pollInterval) clearInterval(pollInterval);
                    }
                });

                const pollStatus = async (buildId: string) => {
                    try {
                        const status = await ide.api.getExtensionBuildStatus(buildId);

                        // Update Badge
                        statusBadge.textContent = status.status;
                        switch (status.status) {
                            case 'PENDING':
                            case 'CLONING':
                            case 'INSTALLING':
                            case 'BUILDING':
                                statusBadge.style.background = 'rgba(217, 119, 6, 0.2)'; // Orange
                                statusBadge.style.color = '#fbbf24';
                                statusBadge.style.border = '1px solid rgba(217, 119, 6, 0.5)';
                                break;
                            case 'READY':
                                statusBadge.style.background = 'rgba(16, 185, 129, 0.2)'; // Green
                                statusBadge.style.color = '#34d399';
                                statusBadge.style.border = '1px solid rgba(16, 185, 129, 0.5)';
                                if (pollInterval) clearInterval(pollInterval);
                                ide.notifications.notify('Extension build completed successfully!', 'success');
                                loadHistory();
                                break;
                            case 'FAILED':
                                statusBadge.style.background = 'rgba(239, 68, 68, 0.2)'; // Red
                                statusBadge.style.color = '#f87171';
                                statusBadge.style.border = '1px solid rgba(239, 68, 68, 0.5)';
                                if (pollInterval) clearInterval(pollInterval);
                                ide.notifications.notify('Extension build failed.', 'error');
                                loadHistory();
                                break;
                            default:
                                statusBadge.style.background = 'rgba(75, 85, 99, 0.2)'; // Gray
                                statusBadge.style.color = '#9ca3af';
                                statusBadge.style.border = '1px solid rgba(75, 85, 99, 0.5)';
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

                const loadHistory = async () => {
                    historyList.innerHTML = '<div style="color: #888;">Loading history...</div>';
                    try {
                        const result = await ide.api.listExtensionVersions();
                        historyList.innerHTML = '';
                        const versions = result.versions || [];

                        if (versions.length === 0) {
                            historyList.innerHTML = '<div style="color: #888;">No build history.</div>';
                        }

                        for (const v of versions) {
                            const item = document.createElement('div');
                            item.style.padding = '12px 16px';
                            item.style.background = 'rgba(20,20,20,0.5)';
                            item.style.borderRadius = '8px';
                            item.style.display = 'flex';
                            item.style.justifyContent = 'space-between';
                            item.style.alignItems = 'center';
                            item.style.border = '1px solid rgba(255,255,255,0.05)';
                            item.style.transition = 'all 0.2s ease';

                            item.addEventListener('mouseenter', () => {
                                item.style.background = 'rgba(30,30,30,0.8)';
                                item.style.transform = 'translateX(4px)';
                                item.style.border = '1px solid rgba(0, 122, 204, 0.5)';
                            });
                            item.addEventListener('mouseleave', () => {
                                item.style.background = 'rgba(20,20,20,0.5)';
                                item.style.transform = 'translateX(0)';
                                item.style.border = '1px solid rgba(255,255,255,0.05)';
                            });

                            const leftWrap = document.createElement('div');
                            leftWrap.style.display = 'flex';
                            leftWrap.style.alignItems = 'center';
                            leftWrap.style.gap = '16px';
                            leftWrap.style.cursor = 'pointer';
                            leftWrap.style.flex = '1';

                            const iconWrap = document.createElement('div');
                            iconWrap.style.width = '32px';
                            iconWrap.style.height = '32px';
                            iconWrap.style.borderRadius = '8px';
                            iconWrap.style.background = 'rgba(0,122,204,0.1)';
                            iconWrap.style.color = '#007acc';
                            iconWrap.style.display = 'flex';
                            iconWrap.style.alignItems = 'center';
                            iconWrap.style.justifyContent = 'center';
                            iconWrap.innerHTML = '<i class="fas fa-box"></i>';
                            leftWrap.appendChild(iconWrap);

                            const info = document.createElement('div');
                            const nameEl = document.createElement('div');
                            nameEl.textContent = `${v.extensionName} (v${v.version})`;
                            nameEl.style.fontWeight = 'bold';
                            nameEl.style.fontSize = '14px';

                            const dateEl = document.createElement('div');
                            dateEl.textContent = new Date(v.createdAt).toLocaleString();
                            dateEl.style.fontSize = '11px';
                            dateEl.style.color = '#888';

                            info.appendChild(nameEl);
                            info.appendChild(dateEl);
                            leftWrap.appendChild(info);

                            leftWrap.addEventListener('click', () => {
                                monitorWrap.style.display = 'flex';
                                logsOutput.textContent = 'Loading logs...\n';
                                statusBadge.textContent = 'LOADING';
                                statusBadge.style.background = 'rgba(75, 85, 99, 0.2)';
                                statusBadge.style.color = '#9ca3af';
                                statusBadge.style.border = '1px solid rgba(75, 85, 99, 0.5)';

                                if (pollInterval) clearInterval(pollInterval);
                                if (['PENDING', 'CLONING', 'INSTALLING', 'BUILDING'].includes(v.status)) {
                                    pollInterval = setInterval(() => pollStatus(v.id), 3000);
                                }
                                pollStatus(v.id);
                            });

                            const rightWrap = document.createElement('div');
                            rightWrap.style.display = 'flex';
                            rightWrap.style.alignItems = 'center';
                            rightWrap.style.gap = '12px';

                            const badge = document.createElement('span');
                            badge.textContent = v.status;
                            badge.style.padding = '4px 8px';
                            badge.style.borderRadius = '12px';
                            badge.style.fontSize = '10px';
                            badge.style.fontWeight = 'bold';
                            badge.style.letterSpacing = '0.05em';

                            switch (v.status) {
                                case 'READY':
                                    badge.style.background = 'rgba(16, 185, 129, 0.2)';
                                    badge.style.color = '#34d399';
                                    badge.style.border = '1px solid rgba(16, 185, 129, 0.5)';
                                    break;
                                case 'FAILED':
                                    badge.style.background = 'rgba(239, 68, 68, 0.2)';
                                    badge.style.color = '#f87171';
                                    badge.style.border = '1px solid rgba(239, 68, 68, 0.5)';
                                    break;
                                default:
                                    badge.style.background = 'rgba(217, 119, 6, 0.2)';
                                    badge.style.color = '#fbbf24';
                                    badge.style.border = '1px solid rgba(217, 119, 6, 0.5)';
                                    break;
                            }
                            rightWrap.appendChild(badge);

                            const deleteBtn = document.createElement('button');
                            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                            deleteBtn.title = 'Delete Version';
                            deleteBtn.style.background = 'transparent';
                            deleteBtn.style.border = 'none';
                            deleteBtn.style.color = '#ef4444';
                            deleteBtn.style.cursor = 'pointer';
                            deleteBtn.style.padding = '8px';
                            deleteBtn.style.borderRadius = '4px';
                            deleteBtn.style.transition = 'all 0.2s ease';
                            deleteBtn.style.opacity = '0.7';

                            deleteBtn.addEventListener('mouseenter', () => {
                                deleteBtn.style.background = 'rgba(239, 68, 68, 0.1)';
                                deleteBtn.style.opacity = '1';
                            });
                            deleteBtn.addEventListener('mouseleave', () => {
                                deleteBtn.style.background = 'transparent';
                                deleteBtn.style.opacity = '0.7';
                            });

                            deleteBtn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                if (!confirm(`Delete version v${v.version} of ${v.extensionName}? This cannot be undone.`)) return;
                                try {
                                    deleteBtn.disabled = true;
                                    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                                    await ide.api.deleteExtensionVersion(v.id);
                                    ide.notifications.notify(`Deleted version v${v.version}`, 'success');
                                    loadHistory();
                                } catch (err: any) {
                                    ide.notifications.notify(`Failed to delete version: ${err.message}`, 'error');
                                    deleteBtn.disabled = false;
                                    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                                }
                            });
                            rightWrap.appendChild(deleteBtn);

                            item.appendChild(leftWrap);
                            item.appendChild(rightWrap);

                            historyList.appendChild(item);
                        }
                    } catch (err: any) {
                        historyList.innerHTML = `<div style="color: #f44336;">Failed to load history: ${err.message}</div>`;
                    }
                };

                loadHistory();

                // Submit Action
                submitBtn.addEventListener('click', async () => {
                    const url = urlInput.value.trim();
                    const branch = branchInput.value.trim() || 'main';
                    const manifest = manifestInput.value.trim() || '/package.json';

                    if (!url) {
                        ide.notifications.notify('Git Repository URL is required', 'error');
                        return;
                    }

                    try {
                        submitBtn.disabled = true;
                        submitBtn.style.opacity = '0.5';
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Submitting...';

                        const { buildId } = await ide.api.submitExtension(url, branch, manifest);

                        ide.notifications.notify('Build submitted successfully', 'info');

                        // Reset UI for polling
                        monitorWrap.style.display = 'flex';
                        logsOutput.textContent = 'Waiting for logs...\n';
                        statusBadge.textContent = 'PENDING';
                        statusBadge.style.background = 'rgba(217, 119, 6, 0.2)';
                        statusBadge.style.color = '#fbbf24';
                        statusBadge.style.border = '1px solid rgba(217, 119, 6, 0.5)';

                        if (pollInterval) clearInterval(pollInterval);
                        pollInterval = setInterval(() => pollStatus(buildId), 3000);
                        pollStatus(buildId); // initial poll

                        // Optional: refresh history occasionally or once after submission
                        loadHistory();

                    } catch (err: any) {
                        ide.notifications.notify(`Build submission failed: ${err.message}`, 'error');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = '<i class="fas fa-cloud-upload-alt" style="margin-right: 8px;"></i> Submit Build';
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
