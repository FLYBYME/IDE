import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { IDE } from './IDE';

export class TerminalService {
    private ide: IDE;
    private terminals: Map<string, { terminal: Terminal, fitAddon: FitAddon, ws: WebSocket | null }> = new Map();

    constructor(ide: IDE) {
        this.ide = ide;
    }

    /**
     * Create and mount a terminal instance.
     */
    public createTerminal(container: HTMLElement, workspaceId: string): Terminal {
        const terminal = new Terminal({
            cursorBlink: true,
            theme: this.getTheme(),
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            convertEol: true
        });

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(container);

        // Initial fit
        setTimeout(() => fitAddon.fit(), 0);

        // Setup WebSocket
        const ws = this.connect(terminal, workspaceId);

        this.terminals.set(workspaceId, { terminal, fitAddon, ws });

        // Handle terminal input
        terminal.onData(data => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(data);
            }
        });

        // Handle resize from xterm side
        terminal.onResize(({ cols, rows }) => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ resize: { cols, rows } }));
            }
        });

        return terminal;
    }

    /**
     * Fit the terminal to its container.
     */
    public fit(workspaceId: string): void {
        const entry = this.terminals.get(workspaceId);
        if (entry) {
            entry.fitAddon.fit();
        }
    }

    /**
     * Fit all active terminals.
     */
    public fitAll(): void {
        this.terminals.forEach(entry => entry.fitAddon.fit());
    }

    /**
     * Connect to the backend terminal WebSocket.
     */
    private connect(terminal: Terminal, workspaceId: string): WebSocket | null {
        // Use the terminal port from config (usually 3003)
        // Since we are in the browser, we use the same host as the current page.
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = 3003; // Matches our backend terminalPort default

        // Get token from ApiService (using any casting for access)
        const token = (this.ide.api as any).token;

        const ws = new WebSocket(`${protocol}//${host}:${port}?workspaceId=${workspaceId}&token=${token}`);
        ws.binaryType = 'arraybuffer';

        ws.onopen = () => {
            console.log(`[TerminalService] Connected to ${workspaceId}`);
        };

        ws.onmessage = (event) => {
            terminal.write(new Uint8Array(event.data));
        };

        ws.onclose = (event) => {
            console.log(`[TerminalService] Disconnected from ${workspaceId}`, event.reason);
            terminal.write('\r\n\x1b[31m[Terminal Disconnected]\x1b[0m\r\n');
        };

        ws.onerror = (err) => {
            console.error(`[TerminalService] WebSocket Error:`, err);
            terminal.write('\r\n\x1b[31m[WebSocket Connection Error]\x1b[0m\r\n');
        };

        return ws;
    }

    private getTheme() {
        // Mocking theme translation for now.
        // In a real scenario, this would read from ThemeService or compute from CSS variables.
        return {
            background: '#1e1e1e',
            foreground: '#cccccc',
            cursor: '#cccccc',
            selectionBackground: '#264f78',
            black: '#000000',
            red: '#cd3131',
            green: '#0dbc79',
            yellow: '#e5e510',
            blue: '#2472c8',
            magenta: '#bc3fbc',
            cyan: '#11a8cd',
            white: '#e5e5e5',
            brightBlack: '#666666',
            brightRed: '#f14c4c',
            brightGreen: '#23d18b',
            brightYellow: '#f5f543',
            brightBlue: '#3b8eea',
            brightMagenta: '#d670d6',
            brightCyan: '#29b8db',
            brightWhite: '#e5e5e5'
        };
    }

    public destroy(workspaceId: string): void {
        const entry = this.terminals.get(workspaceId);
        if (entry) {
            entry.ws?.close();
            entry.terminal.dispose();
            this.terminals.delete(workspaceId);
        }
    }
}
