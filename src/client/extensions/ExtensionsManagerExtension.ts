import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

export const ExtensionsManagerExtension: Extension = {
    id: 'core.extensionsManager',
    name: 'Extensions Manager',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        const { ide } = context;

        const extensionsProvider: ViewProvider = {
            id: 'core.extensionsManager.view',
            name: 'Extensions',

            async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]) {
                container.innerHTML = '';

                const wrapper = document.createElement('div');
                wrapper.className = 'settings-editor'; // Reuse some layout styles
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
                title.textContent = 'Extension Marketplace';
                header.appendChild(title);

                const subtitle = document.createElement('p');
                subtitle.className = 'settings-subtitle';
                subtitle.textContent = 'Discover and manage extensions to customize your IDE.';
                header.appendChild(subtitle);

                // ── Search bar ─────────────────────────────
                const searchWrap = document.createElement('div');
                searchWrap.className = 'settings-search-wrap';
                const searchIcon = document.createElement('i');
                searchIcon.className = 'fas fa-search settings-search-icon';
                searchWrap.appendChild(searchIcon);

                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = 'Search extensions...';
                searchInput.className = 'settings-search';
                searchWrap.appendChild(searchInput);
                header.appendChild(searchWrap);

                wrapper.appendChild(header);

                // ── Grid ───────────────────────────────────
                const grid = document.createElement('div');
                grid.className = 'extensions-grid';
                grid.style.display = 'grid';
                grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
                grid.style.gap = '20px';
                grid.style.marginTop = '20px';
                wrapper.appendChild(grid);

                // Load Extensions Action
                const loadExtensions = async () => {
                    grid.innerHTML = '<div style="color: #888;">Loading extensions...</div>';
                    try {
                        const result = await ide.api.listExtensions();
                        grid.innerHTML = '';
                        const exts = result.extensions || [];

                        if (exts.length === 0) {
                            grid.innerHTML = '<div style="color: #888;">No extensions found.</div>';
                        }

                        for (const ext of exts) {
                            const card = document.createElement('div');
                            card.className = 'extension-card';
                            card.style.background = '#2a2a2a';
                            card.style.border = '1px solid #333';
                            card.style.borderRadius = '6px';
                            card.style.padding = '15px';
                            card.style.display = 'flex';
                            card.style.flexDirection = 'column';
                            card.style.gap = '10px';

                            // Card Header: Name + Toggle
                            const cardHeader = document.createElement('div');
                            cardHeader.style.display = 'flex';
                            cardHeader.style.justifyContent = 'space-between';
                            cardHeader.style.alignItems = 'flex-start';

                            const nameWrap = document.createElement('div');
                            const nameEl = document.createElement('h3');
                            nameEl.textContent = ext.name;
                            nameEl.style.margin = '0 0 5px 0';
                            nameEl.style.fontSize = '16px';

                            const authorEl = document.createElement('div');
                            authorEl.textContent = ext.author;
                            authorEl.style.fontSize = '12px';
                            authorEl.style.color = '#888';
                            nameWrap.appendChild(nameEl);
                            nameWrap.appendChild(authorEl);

                            if (ext.installedVersionId) {
                                const installedV = (ext.versions || []).find((v: any) => v.id === ext.installedVersionId);
                                if (installedV) {
                                    const vLabel = document.createElement('div');
                                    vLabel.textContent = `Installed: v${installedV.version}`;
                                    vLabel.style.fontSize = '12px';
                                    vLabel.style.color = '#4caf50'; // Green text
                                    vLabel.style.marginTop = '4px';
                                    nameWrap.appendChild(vLabel);
                                }
                            }

                            cardHeader.appendChild(nameWrap);

                            // Version Selector
                            const versionWrap = document.createElement('div');
                            versionWrap.style.display = 'flex';
                            versionWrap.style.gap = '10px';
                            versionWrap.style.alignItems = 'center';

                            const versionSelect = document.createElement('select');
                            versionSelect.className = 'settings-input'; // Reuse input styles
                            versionSelect.style.padding = '4px 8px';

                            const versions = ext.versions || [];
                            if (versions.length === 0) {
                                const opt = document.createElement('option');
                                opt.textContent = 'No versions available';
                                opt.value = '';
                                versionSelect.appendChild(opt);
                                versionSelect.disabled = true;
                            } else {
                                // Sort versions descending (assumes semantic versioning or just rely on array order)
                                const sortedVersions = versions.sort((a: any, b: any) =>
                                    (b.createdAt > a.createdAt) ? 1 : -1
                                );

                                for (const v of sortedVersions) {
                                    const opt = document.createElement('option');
                                    // Make it clear if it's not ready
                                    const readySuffix = v.status === 'READY' ? '' : ` (${v.status})`;
                                    opt.textContent = `v${v.version}${readySuffix}`;
                                    opt.value = v.id;
                                    versionSelect.appendChild(opt);
                                }

                                if (ext.installedVersionId) {
                                    versionSelect.value = ext.installedVersionId;
                                }
                            }

                            const installBtn = document.createElement('button');
                            installBtn.className = 'settings-button';
                            installBtn.textContent = ext.active ? 'Update / Reinstall' : 'Install';
                            if (versions.length === 0) {
                                installBtn.disabled = true;
                            }

                            installBtn.addEventListener('click', async () => {
                                const selectedVersionId = versionSelect.value;
                                if (!selectedVersionId) return;

                                installBtn.disabled = true;
                                installBtn.textContent = 'Installing...';
                                try {
                                    await ide.api.installExtension(selectedVersionId);
                                    ide.notifications.notify(`Installed extension: ${ext.name}`, 'success');

                                    // Make sure we forcefully unregister the old version if it was active
                                    await ide.extensions.deactivate(ext.id);

                                    // Load new version dynamically
                                    const selectedVersion = versions.find((v: any) => v.id === selectedVersionId);
                                    if (selectedVersion && selectedVersion.entryPointUrl) {
                                        await ide.extensions.loadFromUrl(selectedVersion.entryPointUrl);
                                        await ide.extensions.activate(ext.id);
                                    } else {
                                        console.warn('Backend did not provide entryPointUrl, cannot load dynamically.');
                                    }

                                    loadExtensions(); // Refresh UI fully
                                } catch (err: any) {
                                    ide.notifications.notify(`Failed to install extension: ${err.message}`, 'error');
                                    installBtn.textContent = 'Install';
                                } finally {
                                    installBtn.disabled = false;
                                }
                            });

                            versionWrap.appendChild(versionSelect);
                            versionWrap.appendChild(installBtn);

                            // Also add an uninstall/disable button if active
                            if (ext.active) {
                                const disableBtn = document.createElement('button');
                                disableBtn.className = 'settings-button settings-button-danger';
                                disableBtn.textContent = 'Disable';
                                disableBtn.style.background = '#f44336';
                                disableBtn.style.color = 'white';
                                disableBtn.style.border = 'none';
                                disableBtn.addEventListener('click', async () => {
                                    try {
                                        await ide.api.toggleExtension(ext.id, false);
                                        ide.notifications.notify(`Disabled extension: ${ext.name}`, 'info');
                                        await ide.extensions.deactivate(ext.id);
                                        loadExtensions(); // Reload the whole list to update buttons
                                    } catch (err: any) {
                                        ide.notifications.notify(`Failed to disable extension: ${err.message}`, 'error');
                                    }
                                });
                                versionWrap.appendChild(disableBtn);
                            }

                            cardHeader.appendChild(versionWrap);

                            card.appendChild(cardHeader);

                            const descWrap = document.createElement('div');
                            descWrap.style.display = 'flex';
                            descWrap.style.flexDirection = 'column';
                            descWrap.style.gap = '5px';
                            descWrap.style.flex = '1';

                            const descDisplayWrap = document.createElement('div');
                            descDisplayWrap.style.display = 'flex';
                            descDisplayWrap.style.justifyContent = 'space-between';
                            descDisplayWrap.style.alignItems = 'flex-start';
                            descDisplayWrap.style.gap = '10px';

                            const descText = document.createElement('p');
                            descText.textContent = ext.description || 'No description provided.';
                            descText.style.margin = '0';
                            descText.style.fontSize = '13px';
                            descText.style.color = '#ccc';
                            descText.style.flex = '1';
                            descDisplayWrap.appendChild(descText);

                            const editDescBtn = document.createElement('button');
                            editDescBtn.innerHTML = '<i class="fas fa-edit"></i>';
                            editDescBtn.style.background = 'transparent';
                            editDescBtn.style.border = 'none';
                            editDescBtn.style.color = '#888';
                            editDescBtn.style.cursor = 'pointer';
                            editDescBtn.title = 'Edit Description';
                            descDisplayWrap.appendChild(editDescBtn);

                            const descEditWrap = document.createElement('div');
                            descEditWrap.style.display = 'none';
                            descEditWrap.style.flexDirection = 'column';
                            descEditWrap.style.gap = '5px';

                            const descInput = document.createElement('textarea');
                            descInput.value = ext.description || '';
                            descInput.className = 'settings-input';
                            descInput.style.minHeight = '60px';
                            descInput.style.resize = 'vertical';
                            descEditWrap.appendChild(descInput);

                            const saveDescBtn = document.createElement('button');
                            saveDescBtn.className = 'settings-button';
                            saveDescBtn.textContent = 'Save Description';
                            saveDescBtn.style.alignSelf = 'flex-start';
                            descEditWrap.appendChild(saveDescBtn);

                            editDescBtn.addEventListener('click', () => {
                                descDisplayWrap.style.display = 'none';
                                descEditWrap.style.display = 'flex';
                                descInput.focus();
                            });

                            saveDescBtn.addEventListener('click', async () => {
                                saveDescBtn.disabled = true;
                                saveDescBtn.textContent = 'Saving...';
                                try {
                                    await ide.api.updateExtension(ext.id, { description: descInput.value });
                                    descText.textContent = descInput.value || 'No description provided.';
                                    ide.notifications.notify('Description updated', 'success');
                                    descEditWrap.style.display = 'none';
                                    descDisplayWrap.style.display = 'flex';
                                } catch (err: any) {
                                    ide.notifications.notify(`Failed to update description: ${err.message}`, 'error');
                                } finally {
                                    saveDescBtn.disabled = false;
                                    saveDescBtn.textContent = 'Save Description';
                                }
                            });

                            descWrap.appendChild(descDisplayWrap);
                            descWrap.appendChild(descEditWrap);
                            card.appendChild(descWrap);

                            // Bottom actions
                            const actions = document.createElement('div');
                            actions.style.display = 'flex';
                            actions.style.justifyContent = 'flex-end';
                            actions.style.marginTop = '10px';

                            grid.appendChild(card);
                        }

                        // Filtering logic
                        searchInput.addEventListener('input', () => {
                            const q = searchInput.value.toLowerCase().trim();
                            const cards = grid.querySelectorAll('.extension-card') as NodeListOf<HTMLElement>;
                            for (let i = 0; i < cards.length; i++) {
                                const text = cards[i].textContent || '';
                                cards[i].style.display = text.toLowerCase().includes(q) ? 'flex' : 'none';
                            }
                        });


                    } catch (err: any) {
                        grid.innerHTML = `<div style="color: #f44336;">Error loading extensions: ${err.message}</div>`;
                    }
                };

                loadExtensions();
            },
        };

        ide.views.registerProvider('center-panel', extensionsProvider);

        const manageCmd = ide.commands.registerDisposable({
            id: 'extensions.manage',
            label: 'Manage Extensions',
            handler: () => {
                ide.views.renderView('center-panel', extensionsProvider.id);
            },
        });
        context.subscriptions.push(manageCmd);

        ide.layout.header.menuBar.addMenuItem({
            id: 'extensions-menu',
            label: 'Extensions',
            items: [
                {
                    id: 'extensions-menu:manage',
                    label: 'Marketplace',
                    icon: 'fas fa-puzzle-piece',
                    onClick: () => ide.commands.execute('extensions.manage'),
                },
            ],
        });

        ide.activityBar.registerItem({
            id: 'extensions.activityBar',
            location: 'left-panel',
            icon: 'fas fa-puzzle-piece',
            title: 'Extensions',
            order: 998,
            onClick: () => ide.commands.execute('extensions.manage')
        });
    },
};
