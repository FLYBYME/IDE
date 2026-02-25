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
                formWrap.style.background = '#2a2a2a';
                formWrap.style.padding = '20px';
                formWrap.style.borderRadius = '6px';
                formWrap.style.marginBottom = '20px';

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
                submitBtn.textContent = 'Submit Build';
                submitBtn.style.padding = '10px 15px';
                submitBtn.style.background = '#007acc';
                submitBtn.style.color = '#fff';
                submitBtn.style.border = 'none';
                submitBtn.style.borderRadius = '4px';
                submitBtn.style.cursor = 'pointer';
                submitBtn.style.fontWeight = 'bold';

                submitBtn.addEventListener('mouseenter', () => submitBtn.style.background = '#005f9e');
                submitBtn.addEventListener('mouseleave', () => submitBtn.style.background = '#007acc');

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
                historyWrap.style.marginTop = '20px';
                historyWrap.style.background = '#2a2a2a';
                historyWrap.style.padding = '20px';
                historyWrap.style.borderRadius = '6px';

                const historyTitle = document.createElement('h3');
                historyTitle.textContent = 'Build History';
                historyTitle.style.marginTop = '0';
                historyTitle.style.marginBottom = '15px';
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
                                statusBadge.style.background = '#d97706'; // Orange
                                statusBadge.style.color = '#fff';
                                break;
                            case 'READY':
                                statusBadge.style.background = '#10b981'; // Green
                                statusBadge.style.color = '#fff';
                                if (pollInterval) clearInterval(pollInterval);
                                ide.notifications.notify('Extension build completed successfully!', 'success');
                                break;
                            case 'FAILED':
                                statusBadge.style.background = '#ef4444'; // Red
                                statusBadge.style.color = '#fff';
                                if (pollInterval) clearInterval(pollInterval);
                                ide.notifications.notify('Extension build failed.', 'error');
                                break;
                            default:
                                statusBadge.style.background = '#4b5563'; // Gray
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
                            item.style.padding = '10px';
                            item.style.background = '#1e1e1e';
                            item.style.borderRadius = '4px';
                            item.style.cursor = 'pointer';
                            item.style.display = 'flex';
                            item.style.justifyContent = 'space-between';
                            item.style.alignItems = 'center';
                            item.style.border = '1px solid transparent';

                            item.addEventListener('mouseenter', () => item.style.border = '1px solid #007acc');
                            item.addEventListener('mouseleave', () => item.style.border = '1px solid transparent');

                            const left = document.createElement('div');
                            const nameEl = document.createElement('div');
                            nameEl.textContent = `${v.extensionName} (v${v.version})`;
                            nameEl.style.fontWeight = 'bold';

                            const dateEl = document.createElement('div');
                            dateEl.textContent = new Date(v.createdAt).toLocaleString();
                            dateEl.style.fontSize = '12px';
                            dateEl.style.color = '#888';

                            left.appendChild(nameEl);
                            left.appendChild(dateEl);

                            const badge = document.createElement('span');
                            badge.textContent = v.status;
                            badge.style.padding = '4px 6px';
                            badge.style.borderRadius = '4px';
                            badge.style.fontSize = '10px';
                            badge.style.fontWeight = 'bold';

                            switch (v.status) {
                                case 'READY': badge.style.background = '#10b981'; badge.style.color = '#fff'; break;
                                case 'FAILED': badge.style.background = '#ef4444'; badge.style.color = '#fff'; break;
                                default: badge.style.background = '#d97706'; badge.style.color = '#fff'; break;
                            }

                            item.appendChild(left);
                            item.appendChild(badge);

                            item.addEventListener('click', () => {
                                monitorWrap.style.display = 'flex';
                                logsOutput.textContent = 'Loading logs...\n';
                                statusBadge.textContent = 'LOADING';
                                statusBadge.style.background = '#4b5563';

                                if (pollInterval) clearInterval(pollInterval);
                                if (['PENDING', 'CLONING', 'INSTALLING', 'BUILDING'].includes(v.status)) {
                                    pollInterval = setInterval(() => pollStatus(v.id), 3000);
                                }
                                pollStatus(v.id);
                            });

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
                        submitBtn.textContent = 'Submitting...';

                        const { buildId } = await ide.api.submitExtension(url, branch, manifest);

                        ide.notifications.notify('Build submitted successfully', 'info');

                        // Reset UI for polling
                        monitorWrap.style.display = 'flex';
                        logsOutput.textContent = 'Waiting for logs...\n';
                        statusBadge.textContent = 'PENDING';
                        statusBadge.style.background = '#d97706';

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
                        submitBtn.textContent = 'Submit Build';
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
