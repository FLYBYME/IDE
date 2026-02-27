import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';
import { CommandEvents } from '../core/CommandRegistry';

export const CommandRegistryViewerExtension: Extension = {
    id: 'core.commandRegistryViewer',
    name: 'Command Explorer',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        const { ide } = context;

        const viewProvider: ViewProvider = {
            id: 'core.commandRegistry.view',
            name: 'Command Explorer',

            async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]) {
                container.innerHTML = '';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.height = '100%';
                container.style.backgroundColor = 'var(--bg-default, #1e1e1e)';
                container.style.color = 'var(--text-normal, #cccccc)';
                container.style.padding = '20px';
                container.style.overflow = 'hidden';

                // ── Header ─────────────────────────────────
                const header = document.createElement('div');
                header.style.marginBottom = '20px';

                const title = document.createElement('h1');
                title.textContent = 'Command Explorer';
                title.style.margin = '0 0 8px 0';
                title.style.fontSize = '24px';

                const subtitle = document.createElement('p');
                subtitle.textContent = 'Inspect registered commands, trigger executions, and view history.';
                subtitle.style.margin = '0 0 16px 0';
                subtitle.style.color = 'var(--text-muted, #888)';

                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = 'Search by ID, label, or description...';
                searchInput.style.width = '100%';
                searchInput.style.padding = '8px';
                searchInput.style.background = 'var(--input-bg, #2d2d2d)';
                searchInput.style.color = '#fff';
                searchInput.style.border = '1px solid var(--border-color, #444)';

                header.appendChild(title);
                header.appendChild(subtitle);
                header.appendChild(searchInput);
                container.appendChild(header);

                // ── Content Layout (Split View) ────────────
                const splitContainer = document.createElement('div');
                splitContainer.style.display = 'flex';
                splitContainer.style.flexDirection = 'column';
                splitContainer.style.gap = '20px';
                splitContainer.style.flex = '1';
                splitContainer.style.overflow = 'hidden';

                // Commands Table
                const commandsSection = document.createElement('div');
                commandsSection.style.flex = '2';
                commandsSection.style.overflowY = 'auto';
                commandsSection.style.border = '1px solid var(--border-color, #444)';

                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.innerHTML = `
                    <thead style="background: var(--bg-secondary, #252526); position: sticky; top: 0;">
                        <tr>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color, #444);">ID</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color, #444);">Label</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color, #444);">Category</th>
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid var(--border-color, #444);">Keybinding</th>
                            <th style="padding: 10px; text-align: center; border-bottom: 1px solid var(--border-color, #444);">Action</th>
                        </tr>
                    </thead>
                    <tbody id="commands-tbody"></tbody>
                `;
                commandsSection.appendChild(table);

                // History Log
                const historySection = document.createElement('div');
                historySection.style.flex = '1';
                historySection.style.overflowY = 'auto';
                historySection.style.border = '1px solid var(--border-color, #444)';
                historySection.style.background = 'var(--bg-secondary, #252526)';

                const historyHeader = document.createElement('div');
                historyHeader.textContent = 'Execution History (Live)';
                historyHeader.style.padding = '10px';
                historyHeader.style.fontWeight = 'bold';
                historyHeader.style.borderBottom = '1px solid var(--border-color, #444)';
                historyHeader.style.position = 'sticky';
                historyHeader.style.top = '0';
                historyHeader.style.background = 'var(--bg-secondary, #252526)';

                const historyList = document.createElement('div');
                historyList.style.padding = '10px';
                historyList.style.fontFamily = 'monospace';
                historyList.style.fontSize = '12px';

                historySection.appendChild(historyHeader);
                historySection.appendChild(historyList);

                splitContainer.appendChild(commandsSection);
                splitContainer.appendChild(historySection);
                container.appendChild(splitContainer);

                // ── Render Logic ───────────────────────────
                const tbody = table.querySelector('#commands-tbody') as HTMLElement;

                const renderCommands = (query = '') => {
                    tbody.innerHTML = '';
                    const commands = query ? ide.commands.search(query) : ide.commands.getAll();

                    if (commands.length === 0) {
                        tbody.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">No commands found.</td></tr>`;
                        return;
                    }

                    commands.sort((a, b) => a.id.localeCompare(b.id)).forEach(cmd => {
                        const tr = document.createElement('tr');
                        tr.style.borderBottom = '1px solid var(--border-color, #333)';

                        const isAvailable = cmd.when ? cmd.when() : true;

                        tr.innerHTML = `
                            <td style="padding: 8px; font-family: monospace;">${cmd.id}</td>
                            <td style="padding: 8px;" title="${cmd.description || ''}">${cmd.label}</td>
                            <td style="padding: 8px;"><span style="background: var(--badge-bg, #3a3d41); padding: 2px 6px; border-radius: 10px; font-size: 11px;">${cmd.category || 'Uncategorized'}</span></td>
                            <td style="padding: 8px; font-family: monospace; color: var(--text-accent, #569cd6);">${cmd.keybinding || '-'}</td>
                            <td style="padding: 8px; text-align: center;"></td>
                        `;

                        const btnCell = tr.lastElementChild as HTMLElement;
                        const execBtn = document.createElement('button');
                        execBtn.textContent = '▶ Run';
                        execBtn.style.cursor = isAvailable ? 'pointer' : 'not-allowed';
                        execBtn.style.opacity = isAvailable ? '1' : '0.5';
                        execBtn.style.background = 'var(--btn-primary, #007acc)';
                        execBtn.style.color = '#fff';
                        execBtn.style.border = 'none';
                        execBtn.style.padding = '4px 8px';
                        execBtn.style.borderRadius = '3px';

                        if (isAvailable) {
                            execBtn.addEventListener('click', () => ide.commands.execute(cmd.id));
                        } else {
                            execBtn.title = "Not available in current context";
                        }

                        btnCell.appendChild(execBtn);
                        tbody.appendChild(tr);
                    });
                };

                const renderHistory = () => {
                    historyList.innerHTML = '';
                    const history = ide.commands.getHistory();

                    if (history.length === 0) {
                        historyList.innerHTML = '<span style="color: var(--text-muted);">No commands executed yet.</span>';
                        return;
                    }

                    // Render newest first
                    [...history].reverse().forEach(entry => {
                        const time = new Date(entry.timestamp).toLocaleTimeString();
                        const color = entry.success ? 'var(--success-color, #89d185)' : 'var(--error-color, #f48771)';
                        const icon = entry.success ? '✓' : '✗';

                        const item = document.createElement('div');
                        item.style.marginBottom = '4px';
                        item.innerHTML = `
                            <span style="color: var(--text-muted);">[${time}]</span> 
                            <span style="color: ${color}; font-weight: bold;">${icon}</span> 
                            <span style="color: var(--text-accent, #569cd6);">${entry.commandId}</span>
                            ${entry.error ? `<span style="color: ${color};"> - ${entry.error.message}</span>` : ''}
                        `;
                        historyList.appendChild(item);
                    });
                };

                // ── Event Listeners ────────────────────────
                searchInput.addEventListener('input', (e) => {
                    renderCommands((e.target as HTMLInputElement).value);
                });

                // Listen to live execution events to update history panel
                const onExecuted = () => renderHistory();
                const onError = () => renderHistory();

                const executedListener = ide.commands.on(CommandEvents.COMMAND_EXECUTED, onExecuted);
                const errorListener = ide.commands.on(CommandEvents.COMMAND_ERROR, onError);

                // Cleanup listeners when view is disposed
                disposables.push({
                    dispose: () => {
                        ide.commands.off(executedListener);
                        ide.commands.off(errorListener);
                    }
                });

                // Initial Render
                renderCommands();
                renderHistory();
            }
        };

        // Register the view provider
        ide.views.registerProvider('center-panel', viewProvider);

        // Register the command to open this view
        const openCmd = ide.commands.registerDisposable({
            id: 'developer.showCommandExplorer',
            label: 'Show Command Explorer',
            category: 'Developer',
            icon: 'fas fa-terminal',
            handler: () => {
                ide.views.renderView('center-panel', viewProvider.id);
            }
        });
        context.subscriptions.push(openCmd);

        // Add to Menu
        ide.layout.header.menuBar.addMenuItem({
            id: 'command-explorer-menu',
            label: 'Command Explorer',
            items: [{
                id: 'command-explorer:commandExplorer',
                label: 'Command Explorer',
                onClick: () => ide.commands.execute('developer.showCommandExplorer')
            }
            ]
        });
    }
};