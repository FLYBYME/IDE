import { Extension, ExtensionContext } from './Extension';
import { IDE } from '../IDE';

export class ExtensionManager {
    private ide: IDE;
    private extensions: Map<string, Extension> = new Map();
    private activeContexts: Map<string, ExtensionContext> = new Map();

    constructor(ide: IDE) {
        this.ide = ide;
    }

    /**
     * Register a new extension with the IDE.
     */
    public register(extension: Extension): void {
        if (this.extensions.has(extension.id)) {
            console.warn(`ExtensionManager: Extension "${extension.id}" is already registered.`);
            return;
        }
        this.extensions.set(extension.id, extension);
        this.ide.notifications?.setStatusMessage(`Registered extension: ${extension.name} v${extension.version}`);
    }

    /**
     * Activate all registered extensions.
     */
    public async activateAll(): Promise<void> {
        for (const id of this.extensions.keys()) {
            await this.activate(id);
        }
    }

    /**
     * Activate a specific extension by ID.
     */
    public async activate(id: string): Promise<void> {
        const extension = this.extensions.get(id);
        if (!extension || this.activeContexts.has(id)) return;

        try {
            const context: ExtensionContext = {
                ide: this.ide,
                subscriptions: [],
                registerConfiguration: (node) => {
                    this.ide.configurationRegistry.registerConfiguration(node);
                    context.subscriptions.push({
                        dispose: () => this.ide.configurationRegistry.unregisterConfiguration(node.id),
                    });
                },
            };

            await extension.activate(context);
            this.activeContexts.set(id, context);
            this.ide.notifications?.setStatusMessage(`Activated extension: ${extension.name}`);
        } catch (error) {
            console.error(`❌ Failed to activate extension "${id}":`, error);
        }
    }

    /**
     * Deactivate a specific extension and clean up its resources.
     */
    public async deactivate(id: string): Promise<void> {
        const extension = this.extensions.get(id);
        const context = this.activeContexts.get(id);

        if (!extension || !context) return;

        try {
            if (extension.deactivate) {
                await extension.deactivate();
            }

            // Clean up subscriptions (commands, events, etc.)
            context.subscriptions.forEach(sub => sub.dispose());
            this.activeContexts.delete(id);
            this.ide.notifications?.setStatusMessage(`Deactivated extension: ${extension.name}`);
        } catch (error) {
            console.error(`❌ Error deactivating extension "${id}":`, error);
        }
    }
}
