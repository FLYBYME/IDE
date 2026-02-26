import { Extension, ExtensionContext } from '../core/extensions/Extension';
import { ViewProvider } from '../core/extensions/ViewProvider';
import { IDE } from '../core/IDE';

/**
 * GlobalSearchExtension - Adds a "Find in Files" capability to the sidebar.
 */
export const GlobalSearchExtension: Extension = {
    id: 'core.globalSearch',
    name: 'Global Search',
    version: '1.0.0',

    activate(context: ExtensionContext) {
        const { ide } = context;

        const searchView: ViewProvider = {
            id: 'core.globalSearch.sidebar',
            name: 'Search',
            resolveView: (container: HTMLElement, disposables: { dispose: () => void }[]) => {
                container.innerHTML = '';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.height = '100%';
                container.style.background = '#1e1e1e';
                container.style.color = '#ccc';

                const style = document.createElement('style');
                style.textContent = `
                    .search-container {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
                    }
                    .search-header {
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        border-bottom: 1px solid #333;
                    }
                    .search-input-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                    }
                    .search-input {
                        width: 100%;
                        background: #3c3c3c;
                        border: 1px solid #3c3c3c;
                        color: #fff;
                        padding: 4px 25px 4px 8px;
                        font-size: 13px;
                        outline: none;
                    }
                    .search-input:focus {
                        border-color: #007acc;
                    }
                    .search-input-icon {
                        position: absolute;
                        right: 8px;
                        cursor: pointer;
                        font-size: 12px;
                        color: #888;
                        transition: color 0.2s;
                    }
                    .search-input-icon.active {
                        color: #007acc;
                    }
                    .search-filters {
                        display: flex;
                        gap: 10px;
                        font-size: 11px;
                        color: #888;
                    }
                    .search-filter {
                        cursor: pointer;
                        padding: 2px 4px;
                        border-radius: 2px;
                    }
                    .search-filter.active {
                        color: #fff;
                        background: #333;
                    }
                    .search-results-meta {
                        padding: 8px 10px;
                        font-size: 11px;
                        color: #888;
                        border-bottom: 1px solid #252525;
                    }
                    .search-results-list {
                        flex: 1;
                        overflow-y: auto;
                        padding: 0;
                    }
                    .search-file-node {
                        cursor: pointer;
                    }
                    .search-file-header {
                        display: flex;
                        align-items: center;
                        padding: 4px 10px;
                        gap: 6px;
                        font-size: 13px;
                    }
                    .search-file-header:hover {
                        background: #2a2d2e;
                    }
                    .search-file-icon {
                        font-size: 14px;
                        color: #888;
                    }
                    .search-file-name {
                        flex: 1;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .search-match-count {
                        font-size: 11px;
                        background: #333;
                        padding: 0 6px;
                        border-radius: 10px;
                        color: #888;
                    }
                    .search-matches {
                        padding-left: 20px;
                    }
                    .search-match-node {
                        display: flex;
                        padding: 4px 10px;
                        gap: 8px;
                        font-size: 12px;
                        cursor: pointer;
                        color: #aaa;
                    }
                    .search-match-node:hover {
                        background: #2a2d2e;
                        color: #fff;
                    }
                    .search-match-line {
                        color: #888;
                        min-width: 20px;
                        text-align: right;
                    }
                    .search-match-snippet {
                        white-space: pre;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .search-match-snippet mark {
                        background: #613214;
                        color: #fff;
                    }
                    .search-empty {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        color: #888;
                        gap: 10px;
                        text-align: center;
                        padding: 20px;
                    }
                    .search-empty i {
                        font-size: 32px;
                        opacity: 0.5;
                    }
                    .search-loading {
                        padding: 20px;
                        display: flex;
                        justify-content: center;
                    }
                `;
                container.appendChild(style);

                const wrapper = document.createElement('div');
                wrapper.className = 'search-container';
                container.appendChild(wrapper);

                const header = document.createElement('div');
                header.className = 'search-header';
                wrapper.appendChild(header);

                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'search-input-wrapper';
                header.appendChild(inputWrapper);

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'search-input';
                input.placeholder = 'Search';
                inputWrapper.appendChild(input);

                const caseToggle = document.createElement('i');
                caseToggle.className = 'fas fa-font search-input-icon';
                caseToggle.title = 'Match Case';
                inputWrapper.appendChild(caseToggle);

                const filters = document.createElement('div');
                filters.className = 'search-filters';
                header.appendChild(filters);

                const createFilter = (label: string, type: string, active = false) => {
                    const f = document.createElement('div');
                    f.className = `search-filter ${active ? 'active' : ''}`;
                    f.textContent = label;
                    f.dataset.type = type;
                    return f;
                };

                const filterAll = createFilter('All', 'both', true);
                const filterFiles = createFilter('Files', 'name');
                const filterContent = createFilter('Content', 'content');
                filters.appendChild(filterAll);
                filters.appendChild(filterFiles);
                filters.appendChild(filterContent);

                const meta = document.createElement('div');
                meta.className = 'search-results-meta';
                meta.textContent = 'No search results.';
                wrapper.appendChild(meta);

                const resultsList = document.createElement('div');
                resultsList.className = 'search-results-list';
                wrapper.appendChild(resultsList);

                const showEmpty = () => {
                    resultsList.innerHTML = `
                        <div class="search-empty">
                            <i class="fas fa-search"></i>
                            <div>Search in workspace</div>
                        </div>
                    `;
                };
                showEmpty();

                let searchType = 'both';
                let caseSensitive = false;
                let debounceTimer: any = null;

                const executeSearch = async () => {
                    const query = input.value.trim();
                    if (!query) {
                        meta.textContent = 'No search results.';
                        showEmpty();
                        return;
                    }

                    if (!ide.activeWorkspace) {
                        meta.textContent = 'Open a workspace to search.';
                        return;
                    }

                    resultsList.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i></div>';

                    try {
                        const results = await ide.api.searchFiles(ide.activeWorkspace.id, {
                            query,
                            type: searchType as any,
                            caseSensitive,
                            limit: 100
                        });
                        renderResults(results);
                    } catch (err) {
                        console.error('Search failed:', err);
                        resultsList.innerHTML = '<div class="search-empty">Error performing search.</div>';
                    }
                };

                const renderResults = (data: any) => {
                    resultsList.innerHTML = '';
                    const total = data.total || 0;
                    const files = data.results || [];

                    if (total === 0) {
                        meta.textContent = 'No results found.';
                        resultsList.innerHTML = '<div class="search-empty"><i class="fas fa-search-minus"></i><div>No matches found</div></div>';
                        return;
                    }

                    meta.textContent = `Found ${total} results in ${files.length} files.`;

                    files.forEach((file: any) => {
                        const fileNode = document.createElement('div');
                        fileNode.className = 'search-file-node';

                        const fileHeader = document.createElement('div');
                        fileHeader.className = 'search-file-header';

                        const icon = document.createElement('i');
                        icon.className = 'fas fa-chevron-down search-file-icon';

                        const name = document.createElement('span');
                        name.className = 'search-file-name';
                        name.textContent = file.path.split('/').pop() || file.path;
                        name.title = file.path;

                        const count = document.createElement('span');
                        count.className = 'search-match-count';
                        count.textContent = file.matches.length;

                        fileHeader.appendChild(icon);
                        fileHeader.appendChild(name);
                        fileHeader.appendChild(count);
                        fileNode.appendChild(fileHeader);

                        const matchesContainer = document.createElement('div');
                        matchesContainer.className = 'search-matches';
                        fileNode.appendChild(matchesContainer);

                        file.matches.forEach((match: any) => {
                            const matchNode = document.createElement('div');
                            matchNode.className = 'search-match-node';

                            const line = document.createElement('span');
                            line.className = 'search-match-line';
                            line.textContent = match.line;

                            const snippet = document.createElement('span');
                            snippet.className = 'search-match-snippet';
                            const query = input.value;
                            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, caseSensitive ? 'g' : 'gi');
                            snippet.innerHTML = match.snippet.replace(regex, '<mark>$1</mark>');

                            matchNode.appendChild(line);
                            matchNode.appendChild(snippet);
                            matchesContainer.appendChild(matchNode);

                            matchNode.addEventListener('click', () => {
                                ide.commands.execute('editor.openFile', {
                                    path: file.path,
                                    line: match.line,
                                    column: match.column || 1
                                });
                            });
                        });

                        fileHeader.addEventListener('click', () => {
                            const collapsed = matchesContainer.style.display === 'none';
                            matchesContainer.style.display = collapsed ? 'block' : 'none';
                            icon.className = collapsed ? 'fas fa-chevron-right search-file-icon' : 'fas fa-chevron-down search-file-icon';
                        });

                        resultsList.appendChild(fileNode);
                    });
                };

                input.addEventListener('input', () => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => executeSearch(), 300);
                });

                caseToggle.addEventListener('click', () => {
                    caseSensitive = !caseSensitive;
                    caseToggle.classList.toggle('active', caseSensitive);
                    executeSearch();
                });

                filters.addEventListener('click', (e: any) => {
                    const filter = e.target.closest('.search-filter');
                    if (filter) {
                        filters.querySelectorAll('.search-filter').forEach(f => f.classList.remove('active'));
                        filter.classList.add('active');
                        searchType = filter.dataset.type;
                        executeSearch();
                    }
                });

                const workspaceLoadedSub = ide.commands.on('workspace:loaded', () => {
                    input.value = '';
                    meta.textContent = 'No search results.';
                    showEmpty();
                });
                disposables.push({
                    dispose: () => {
                        ide.commands.off(workspaceLoadedSub);
                    }
                });
            }
        };

        ide.views.registerProvider('left-panel', searchView);
        ide.activityBar.registerItem({
            id: 'core.globalSearch.sidebar',
            location: 'left-panel',
            icon: 'fas fa-search',
            title: 'Search',
        });
    }
};

export default GlobalSearchExtension;
