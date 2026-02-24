/**
 * ConfigurationRegistry - Schema definition store for IDE settings.
 * The core IDE and extensions declare what settings exist,
 * their data types, default values, and descriptions.
 */

export type ConfigurationType = 'string' | 'number' | 'boolean' | 'enum';

export interface ConfigurationProperty<T = any> {
    type: ConfigurationType;
    default: T;
    description: string;
    enum?: string[]; // For 'enum' type — dropdown options
}

export interface ConfigurationNode {
    id: string;       // e.g., 'editor', 'files', 'terminal'
    title: string;    // Human-readable section title
    properties: Record<string, ConfigurationProperty>;
}

export class ConfigurationRegistry {
    private nodes: Map<string, ConfigurationNode> = new Map();

    /**
     * Register a configuration node (a group of related settings).
     * Called by the core IDE and by extensions in their activate() method.
     */
    public registerConfiguration(node: ConfigurationNode): void {
        if (this.nodes.has(node.id)) {
            // Merge properties into existing node
            const existing = this.nodes.get(node.id)!;
            existing.properties = { ...existing.properties, ...node.properties };
        } else {
            this.nodes.set(node.id, { ...node });
        }
    }

    /**
     * Get a flat map of all default values: { 'editor.fontSize': 14, ... }
     */
    public getDefaults(): Record<string, any> {
        const defaults: Record<string, any> = {};
        for (const node of this.nodes.values()) {
            for (const [key, prop] of Object.entries(node.properties)) {
                defaults[key] = prop.default;
            }
        }
        return defaults;
    }

    /**
     * Get the property schema for a specific setting key
     */
    public getProperty(key: string): ConfigurationProperty | undefined {
        for (const node of this.nodes.values()) {
            if (key in node.properties) {
                return node.properties[key];
            }
        }
        return undefined;
    }

    /**
     * Get all registered configuration nodes
     */
    public getAll(): ConfigurationNode[] {
        return Array.from(this.nodes.values());
    }

    /**
     * Get a specific configuration node by ID
     */
    public getNode(id: string): ConfigurationNode | undefined {
        return this.nodes.get(id);
    }
}
