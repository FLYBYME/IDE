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
                            cardHeader.appendChild(nameWrap);

                            // Toggle
                            const toggle = document.createElement('label');
                            toggle.className = 'settings-toggle'; // Reuse toggle styles

                            const cb = document.createElement('input');
                            cb.type = 'checkbox';
                            cb.checked = ext.active;

                            cb.addEventListener('change', async () => {
                                const isEnabled = cb.checked;
                                try {
                                    await ide.api.toggleExtension(ext.id, isEnabled);
                                    if (isEnabled) {
                                        ide.notifications.notify(`Enabled extension: ${ext.name}`, 'success');
                                        // Wait, the client-side ExtensionManager doesn't hot-load arbitrary bundles yet.
                                        // But we can call ide.extensions.activate(ext.id) if it is pre-registered.
                                        await ide.extensions.activate(ext.id);
                                    } else {
                                        ide.notifications.notify(`Disabled extension: ${ext.name}`, 'info');
                                        await ide.extensions.deactivate(ext.id);
                                    }
                                } catch (err: any) {
                                    cb.checked = !isEnabled; // revert UI
                                    ide.notifications.notify(`Failed to toggle extension: ${err.message}`, 'error');
                                }
                            });

                            const slider = document.createElement('span');
                            slider.className = 'settings-toggle-slider';

                            toggle.appendChild(cb);
                            toggle.appendChild(slider);
                            cardHeader.appendChild(toggle);

                            card.appendChild(cardHeader);

                            const desc = document.createElement('p');
                            desc.textContent = ext.description || 'No description provided.';
                            desc.style.margin = '0';
                            desc.style.fontSize = '13px';
                            desc.style.color = '#ccc';
                            desc.style.flex = '1';
                            card.appendChild(desc);

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
