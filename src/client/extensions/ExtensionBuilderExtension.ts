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
