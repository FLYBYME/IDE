import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { IDE } from './IDE';

export class TerminalService {
    private ide: IDE;
    private terminals: Map<string, { terminal: Terminal, fitAddon: FitAddon, handler: (frame: any) => void }> = new Map();

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

        // Setup UCB connection
        const handler = this.connect(terminal, workspaceId);

        this.terminals.set(workspaceId, { terminal, fitAddon, handler });

        // Handle terminal input
        terminal.onData(data => {
            if (this.ide.ucb.isConnected()) {
                this.ide.ucb.send('terminal', 'data', data, workspaceId);
            }
        });

        // Handle resize from xterm side
        terminal.onResize(({ cols, rows }) => {
            if (this.ide.ucb.isConnected()) {
                this.ide.ucb.send('terminal', 'resize', { cols, rows }, workspaceId);
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

    private connect(terminal: Terminal, workspaceId: string): (frame: any) => void {
        this.ide.ucb.send('terminal', 'start', {}, workspaceId);

        const handler = (frame: any) => {
            if (frame.streamId !== workspaceId) return;

            if (frame.type === 'data') {
                terminal.write(frame.payload);
            } else if (frame.type === 'end') {
                console.log(`[TerminalService] Disconnected from ${workspaceId}`);
                terminal.write('\r\n\x1b[31m[Terminal Disconnected]\x1b[0m\r\n');
            } else if (frame.type === 'error') {
                console.error(`[TerminalService] Terminal Error:`, frame.payload);
                terminal.write(`\r\n\x1b[31m[Error: ${frame.payload}]\x1b[0m\r\n`);
            }
        };

        this.ide.ucb.subscribe('terminal', handler);
        return handler;
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
            this.ide.ucb.send('terminal', 'stop', {}, workspaceId);
            this.ide.ucb.unsubscribe('terminal', entry.handler);
            entry.terminal.dispose();
            this.terminals.delete(workspaceId);
        }
    }
}
