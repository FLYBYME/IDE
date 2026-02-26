import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';

export const ExtensionsManagerExtension: Extension = {
    id: 'core.extensionsManager',
    name: 'Extensions Manager',
    version: '1.1.0',

    activate(context: ExtensionContext) {
        const { ide } = context;

        const extensionsProvider: ViewProvider = {
            id: 'core.extensionsManager.view',
            name: 'Extensions',

            async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]) {
                container.innerHTML = '';

                // Main wrapper using settings-editor layout
                const wrapper = document.createElement('div');
                wrapper.className = 'settings-editor';
                wrapper.style.flex = '1';
                wrapper.style.minHeight = '0';
                wrapper.style.overflowY = 'auto';
                container.appendChild(wrapper);

                // ── Header ─────────────────────────────────
                const header = document.createElement('div');
                header.className = 'settings-header';

                const titleWrap = document.createElement('div');
                titleWrap.style.display = 'flex';
                titleWrap.style.justifyContent = 'space-between';
                titleWrap.style.alignItems = 'flex-start';

                const textWrap = document.createElement('div');
                const title = document.createElement('h1');
                title.className = 'settings-title';
                title.textContent = 'Extension Marketplace';

                const subtitle = document.createElement('p');
                subtitle.className = 'settings-subtitle';
                subtitle.textContent = 'Discover and manage extensions to customize your IDE.';

                textWrap.appendChild(title);
                textWrap.appendChild(subtitle);
                titleWrap.appendChild(textWrap);

                // Filter controls
                const filterWrap = document.createElement('div');
                filterWrap.style.display = 'flex';
                filterWrap.style.alignItems = 'center';
                filterWrap.style.gap = '8px';

                const installedFilterLabel = document.createElement('label');
                installedFilterLabel.style.fontSize = '13px';
                installedFilterLabel.style.color = 'var(--text-muted)';
                installedFilterLabel.style.cursor = 'pointer';
                installedFilterLabel.style.display = 'flex';
                installedFilterLabel.style.alignItems = 'center';
                installedFilterLabel.style.gap = '6px';

                const installedFilterCb = document.createElement('input');
                installedFilterCb.type = 'checkbox';
                installedFilterCb.style.cursor = 'pointer';

                installedFilterLabel.appendChild(installedFilterCb);
                installedFilterLabel.appendChild(document.createTextNode('Installed Only'));
                filterWrap.appendChild(installedFilterLabel);
                titleWrap.appendChild(filterWrap);
                header.appendChild(titleWrap);

                // ── Search bar ─────────────────────────────
                const searchWrap = document.createElement('div');
                searchWrap.className = 'settings-search-wrap';
                searchWrap.style.marginTop = '12px';

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
                const gridWrapper = document.createElement('div');
                gridWrapper.className = 'settings-sections'; // Leverage padding from CSS

                const grid = document.createElement('div');
                grid.className = 'extensions-grid';
                gridWrapper.appendChild(grid);
                wrapper.appendChild(gridWrapper);

                // ── Data Loading Logic ──────────────────────
                const loadExtensions = async () => {
                    grid.innerHTML = '<div style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px;"><i class="fas fa-circle-notch fa-spin"></i> Loading extensions...</div>';
                    try {
                        const query = searchInput.value.trim();
                        const result = query
                            ? await ide.api.searchExtensions({ q: query })
                            : await ide.api.listExtensions();

                        grid.innerHTML = '';
                        let exts = result.extensions || [];

                        // Apply local filter
                        if (installedFilterCb.checked) {
                            exts = exts.filter((ext: any) => ext.isInstalled || ext.installedVersionId);
                        }

                        if (exts.length === 0) {
                            grid.innerHTML = '<div style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px;">No extensions found matching your criteria.</div>';
                            return;
                        }

                        for (const ext of exts) {
                            const card = createExtensionCard(ext, ide, loadExtensions);
                            grid.appendChild(card);
                        }
                    } catch (err: any) {
                        grid.innerHTML = `<div style="color: var(--error-color, #f44336); grid-column: 1 / -1; padding: 20px; text-align: center;"><i class="fas fa-exclamation-triangle"></i> Error loading extensions: ${err.message}</div>`;
                    }
                };

                // ── Event Listeners ────────────────────────
                // Bound ONCE during setup to prevent memory leaks
                let searchTimeout: any = null;
                searchInput.addEventListener('input', () => {
                    if (searchTimeout) clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        loadExtensions();
                    }, 300);
                });

                installedFilterCb.addEventListener('change', () => {
                    loadExtensions();
                });

                // Initial Load
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

// ── UI Helper: Card Generation ─────────────────────────────

function createExtensionCard(ext: any, ide: any, onRefresh: () => void): HTMLElement {
    const card = document.createElement('div');
    card.className = 'extension-card';

    // 1. Card Header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'extension-card-header';

    const nameWrap = document.createElement('div');
    const nameEl = document.createElement('h3');
    nameEl.className = 'extension-card-title';
    nameEl.textContent = ext.name;

    const authorEl = document.createElement('div');
    authorEl.className = 'extension-card-author';
    authorEl.innerHTML = `<i class="fas fa-user-circle"></i> ${ext.author}`;

    nameWrap.appendChild(nameEl);
    nameWrap.appendChild(authorEl);

    if (ext.installedVersionId) {
        const installedV = (ext.versions || []).find((v: any) => v.id === ext.installedVersionId);
        if (installedV) {
            const vLabel = document.createElement('div');
            vLabel.className = 'extension-card-version-label';
            vLabel.innerHTML = `<i class="fas fa-check-circle"></i> Installed: v${installedV.version}`;
            nameWrap.appendChild(vLabel);
        }
    }
    cardHeader.appendChild(nameWrap);
    card.appendChild(cardHeader);

    // 2. Description Area (Display & Edit)
    const descWrap = document.createElement('div');
    descWrap.className = 'extension-card-desc-wrap';

    const descDisplayWrap = document.createElement('div');
    descDisplayWrap.className = 'extension-card-desc-display';

    const descText = document.createElement('p');
    descText.className = 'extension-card-desc';
    descText.textContent = ext.description || 'No description provided.';
    descDisplayWrap.appendChild(descText);

    // Only allow edit if current user is author (frontend optimization, backend still enforces)
    // Assuming ide.api exposes current user, or we just render it and let backend reject.
    const editDescBtn = document.createElement('button');
    editDescBtn.className = 'extension-card-edit-btn';
    editDescBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editDescBtn.title = 'Edit Description';
    descDisplayWrap.appendChild(editDescBtn);

    const descEditWrap = document.createElement('div');
    descEditWrap.className = 'extension-card-desc-edit';

    const descInput = document.createElement('textarea');
    descInput.value = ext.description || '';
    descInput.className = 'extension-card-textarea';
    descEditWrap.appendChild(descInput);

    const saveDescBtn = document.createElement('button');
    saveDescBtn.className = 'extension-card-btn extension-card-btn-primary';
    saveDescBtn.style.alignSelf = 'flex-start';
    saveDescBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    descEditWrap.appendChild(saveDescBtn);

    editDescBtn.addEventListener('click', () => {
        descDisplayWrap.style.display = 'none';
        descEditWrap.style.display = 'flex';
        descInput.focus();
    });

    saveDescBtn.addEventListener('click', async () => {
        saveDescBtn.disabled = true;
        saveDescBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
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
            saveDescBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        }
    });

    descWrap.appendChild(descDisplayWrap);
    descWrap.appendChild(descEditWrap);
    card.appendChild(descWrap);

    // 3. Actions Area
    const versionWrap = document.createElement('div');
    versionWrap.className = 'extension-card-actions';

    const versionSelect = document.createElement('select');
    versionSelect.className = 'extension-card-select';

    const versions = ext.versions || [];
    if (versions.length === 0) {
        const opt = document.createElement('option');
        opt.textContent = 'No versions available';
        opt.value = '';
        versionSelect.appendChild(opt);
        versionSelect.disabled = true;
    } else {
        const sortedVersions = versions.sort((a: any, b: any) => (b.createdAt > a.createdAt) ? 1 : -1);
        for (const v of sortedVersions) {
            const opt = document.createElement('option');
            const readySuffix = v.status === 'READY' ? '' : ` (${v.status})`;
            opt.textContent = `v${v.version}${readySuffix}`;
            opt.value = v.id;
            versionSelect.appendChild(opt);
        }
        if (ext.installedVersionId) versionSelect.value = ext.installedVersionId;
    }

    const installBtn = document.createElement('button');
    installBtn.className = 'extension-card-btn extension-card-btn-primary';
    installBtn.innerHTML = ext.installedVersionId ? '<i class="fas fa-sync-alt"></i> Update' : '<i class="fas fa-download"></i> Install';
    if (versions.length === 0) installBtn.disabled = true;

    installBtn.addEventListener('click', async () => {
        const selectedVersionId = versionSelect.value;
        if (!selectedVersionId) return;

        installBtn.disabled = true;
        installBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Installing...';
        try {
            await ide.api.installExtension(selectedVersionId);
            ide.notifications.notify(`Installed extension: ${ext.name}`, 'success');

            await ide.extensions.deactivate(ext.id);

            const selectedVersion = versions.find((v: any) => v.id === selectedVersionId);
            if (selectedVersion && selectedVersion.entryPointUrl) {
                await ide.extensions.loadFromUrl(selectedVersion.entryPointUrl);
                await ide.extensions.activate(ext.id);
            } else {
                console.warn('Backend did not provide entryPointUrl, cannot load dynamically.');
            }

            onRefresh();
        } catch (err: any) {
            ide.notifications.notify(`Failed to install extension: ${err.message}`, 'error');
            installBtn.innerHTML = ext.installedVersionId ? '<i class="fas fa-sync-alt"></i> Update' : '<i class="fas fa-download"></i> Install';
            installBtn.disabled = false;
        }
    });

    versionWrap.appendChild(versionSelect);
    versionWrap.appendChild(installBtn);

    // Contextual Actions (If installed)
    if (ext.installedVersionId) {
        const disableBtn = document.createElement('button');
        disableBtn.className = 'extension-card-btn extension-card-btn-secondary';
        disableBtn.innerHTML = ext.active ? '<i class="fas fa-power-off"></i> Disable' : '<i class="fas fa-play"></i> Enable';

        disableBtn.addEventListener('click', async () => {
            disableBtn.disabled = true;
            try {
                await ide.api.toggleExtension(ext.id, !ext.active);
                ide.notifications.notify(`${ext.active ? 'Disabled' : 'Enabled'} extension: ${ext.name}`, 'info');
                if (ext.active) {
                    await ide.extensions.deactivate(ext.id);
                }
                onRefresh();
            } catch (err: any) {
                ide.notifications.notify(`Failed to toggle extension: ${err.message}`, 'error');
                disableBtn.disabled = false;
            }
        });
        versionWrap.appendChild(disableBtn);

        const uninstallBtn = document.createElement('button');
        uninstallBtn.className = 'extension-card-btn extension-card-btn-danger';
        uninstallBtn.innerHTML = '<i class="fas fa-trash"></i> Uninstall';

        uninstallBtn.addEventListener('click', async () => {
            if (!confirm(`Are you sure you want to uninstall ${ext.name}?`)) return;
            uninstallBtn.disabled = true;
            try {
                await ide.api.uninstallExtension(ext.id);
                ide.notifications.notify(`Uninstalled extension: ${ext.name}`, 'info');
                await ide.extensions.deactivate(ext.id);
                onRefresh();
            } catch (err: any) {
                ide.notifications.notify(`Failed to uninstall extension: ${err.message}`, 'error');
                uninstallBtn.disabled = false;
            }
        });
        versionWrap.appendChild(uninstallBtn);
    }

    // Secondary Actions
    const rebuildBtn = document.createElement('button');
    rebuildBtn.className = 'extension-card-btn extension-card-btn-secondary';
    rebuildBtn.innerHTML = '<i class="fas fa-hammer"></i> Rebuild';
    rebuildBtn.title = 'Trigger a new build from the source repository';
    rebuildBtn.addEventListener('click', async () => {
        try {
            rebuildBtn.disabled = true;
            rebuildBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Triggering...';
            const { buildId } = await ide.api.rebuildExtension(ext.id);
            ide.notifications.notify(`Build triggered for ${ext.name}. Build ID: ${buildId}`, 'info');
        } catch (err: any) {
            ide.notifications.notify(`Failed to trigger build: ${err.message}`, 'error');
        } finally {
            rebuildBtn.disabled = false;
            rebuildBtn.innerHTML = '<i class="fas fa-hammer"></i> Rebuild';
        }
    });
    versionWrap.appendChild(rebuildBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'extension-card-btn extension-card-btn-danger';
    deleteBtn.style.marginTop = '10px';
    deleteBtn.style.width = '100%';
    deleteBtn.innerHTML = '<i class="fas fa-eraser"></i> Delete from Marketplace';
    deleteBtn.title = 'Delete this extension completely (Must be author)';
    deleteBtn.addEventListener('click', async () => {
        if (!confirm(`WARNING: Are you sure you want to completely DELETE ${ext.name} from the marketplace? This cannot be undone.`)) return;
        try {
            deleteBtn.disabled = true;
            await ide.api.deleteExtension(ext.id);
            ide.notifications.notify(`Deleted extension: ${ext.name}`, 'success');
            onRefresh();
        } catch (err: any) {
            ide.notifications.notify(`Failed to delete extension: ${err.message}`, 'error');
            deleteBtn.disabled = false;
        }
    });
    versionWrap.appendChild(deleteBtn);

    card.appendChild(versionWrap);
    return card;
}