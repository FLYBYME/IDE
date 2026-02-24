/**
 * ConfigurationService - Runtime settings engine.
 * Manages user overrides, merges them with schema defaults,
 * handles read/write, and emits events when settings change.
 */

import { IDE } from '../IDE';
import { ConfigurationRegistry } from './ConfigurationRegistry';

export const ConfigurationEvents = {
    CHANGED: 'configuration.changed',
};

export class ConfigurationService {
    private ide: IDE;
    private registry: ConfigurationRegistry;
    private userSettings: Record<string, any> = {};
    private readonly STORAGE_KEY = 'ide-settings-v1';

    constructor(ide: IDE, registry: ConfigurationRegistry) {
        this.ide = ide;
        this.registry = registry;
        this.load();
    }

    /**
     * Get a setting value.
     * Priority: user override → schema default → undefined
     */
    public get<T>(key: string): T {
        if (key in this.userSettings) {
            return this.userSettings[key] as T;
        }
        const defaults = this.registry.getDefaults();
        return defaults[key] as T;
    }

    /**
     * Get a setting value with an explicit fallback
     */
    public getWithDefault<T>(key: string, fallback: T): T {
        const value = this.get<T>(key);
        return value !== undefined ? value : fallback;
    }

    /**
     * Update a setting and notify subscribers via EventBus
     */
    public async update(key: string, value: any): Promise<void> {
        const oldValue = this.get(key);
        this.userSettings[key] = value;
        this.save();

        this.ide.commands.emit(ConfigurationEvents.CHANGED, {
            key,
            value,
            oldValue,
        });
    }

    /**
     * Reset a single setting back to its default
     */
    public async reset(key: string): Promise<void> {
        if (key in this.userSettings) {
            delete this.userSettings[key];
            this.save();

            const defaults = this.registry.getDefaults();
            this.ide.commands.emit(ConfigurationEvents.CHANGED, {
                key,
                value: defaults[key],
                oldValue: this.userSettings[key],
            });
        }
    }

    /**
     * Reset all settings to defaults
     */
    public async resetAll(): Promise<void> {
        this.userSettings = {};
        this.save();
    }

    /**
     * Get all user overrides (useful for exporting settings)
     */
    public getUserSettings(): Record<string, any> {
        return { ...this.userSettings };
    }

    /**
     * Get the fully resolved settings (defaults merged with user overrides)
     */
    public getResolved(): Record<string, any> {
        return { ...this.registry.getDefaults(), ...this.userSettings };
    }

    /**
     * Load user settings from localStorage
     */
    private load(): void {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this.userSettings = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('ConfigurationService: Failed to load settings', e);
            this.userSettings = {};
        }
    }

    /**
     * Persist user settings to localStorage
     */
    private save(): void {
        try {
            localStorage.setItem(
                this.STORAGE_KEY,
                JSON.stringify(this.userSettings)
            );
        } catch (e) {
            console.warn('ConfigurationService: Failed to save settings', e);
        }
    }
}
