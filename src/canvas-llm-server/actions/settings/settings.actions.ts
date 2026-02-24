import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import {
    SettingsUpdateInput,
    WorkspaceSettingsInput,
    WorkspaceSettingsUpdateInput,
} from '../../models/schemas';

// ── In-memory settings stores ────────────────────────
interface UserSettings {
    theme: string;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    tabSize: number;
    useSpaces: boolean;
    autoFormat: boolean;
    formatOnSave: boolean;
    autoSave: boolean;
    autoSaveDelay: number;
    wordWrap: boolean;
    minimap: boolean;
    lineNumbers: boolean;
}

const DEFAULT_USER_SETTINGS: UserSettings = {
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
    lineHeight: 1.6,
    tabSize: 2,
    useSpaces: true,
    autoFormat: true,
    formatOnSave: true,
    autoSave: true,
    autoSaveDelay: 1000,
    wordWrap: false,
    minimap: true,
    lineNumbers: true,
};

const userSettings: Map<string, UserSettings> = new Map();
const workspaceSettings: Map<string, Record<string, any>> = new Map();

function getUserSettings(userId: string): UserSettings {
    if (!userSettings.has(userId)) {
        userSettings.set(userId, { ...DEFAULT_USER_SETTINGS });
    }
    return userSettings.get(userId)!;
}

// ── settings.getUserSettings ─────────────────────────
export const getUserSettingsAction: ServiceAction = {
    name: 'settings.getUserSettings',
    version: 1,
    description: 'Get global user settings',
    domain: 'settings',
    tags: ['settings', 'user', 'read'],
    rest: { method: 'GET', path: '/settings', middleware: ['requireAuth'] },
    auth: { required: true },
    input: z.object({}),
    output: z.object({ user: z.any() }),
    handler: async (ctx) => {
        const userId = ctx.headers['x-user-id'];
        return { user: getUserSettings(userId) };
    },
};

// ── settings.updateUserSettings ──────────────────────
export const updateUserSettingsAction: ServiceAction = {
    name: 'settings.updateUserSettings',
    version: 1,
    description: 'Update user settings',
    domain: 'settings',
    tags: ['settings', 'user', 'update'],
    rest: { method: 'POST', path: '/settings', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SettingsUpdateInput,
    output: z.object({ updated: z.string(), settings: z.any() }),
    handler: async (ctx) => {
        const userId = ctx.headers['x-user-id'];
        const current = getUserSettings(userId);
        const updates = ctx.params as Partial<UserSettings>;

        // Remove nulls from updates to avoid overwriting with null if the type doesn't allow it
        for (const key of Object.keys(updates)) {
            if (updates[key as keyof UserSettings] === null) {
                delete updates[key as keyof UserSettings];
            }
        }

        Object.assign(current, updates);

        return { updated: new Date().toISOString(), settings: current };
    },
};

// ── settings.getWorkspaceSettings ────────────────────
export const getWorkspaceSettingsAction: ServiceAction = {
    name: 'settings.getWorkspaceSettings',
    version: 1,
    description: 'Get workspace-specific settings',
    domain: 'settings',
    tags: ['settings', 'workspace', 'read'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/settings', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceSettingsInput,
    output: z.object({ workspace: z.any() }),
    handler: async (ctx) => {
        const { workspaceId } = ctx.params as z.infer<typeof WorkspaceSettingsInput>;
        const ws = workspaceSettings.get(workspaceId) ?? {};
        return { workspace: ws };
    },
};

// ── settings.updateWorkspaceSettings ─────────────────
export const updateWorkspaceSettingsAction: ServiceAction = {
    name: 'settings.updateWorkspaceSettings',
    version: 1,
    description: 'Update workspace settings',
    domain: 'settings',
    tags: ['settings', 'workspace', 'update'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/settings', middleware: ['requireAuth'] },
    auth: { required: true },
    input: WorkspaceSettingsUpdateInput,
    output: z.object({ updated: z.string() }),
    handler: async (ctx) => {
        const { workspaceId, ...updates } = ctx.params as z.infer<typeof WorkspaceSettingsUpdateInput>;
        const current = workspaceSettings.get(workspaceId) ?? {};
        Object.assign(current, updates);
        workspaceSettings.set(workspaceId, current);

        return { updated: new Date().toISOString() };
    },
};

export default [
    getUserSettingsAction,
    updateUserSettingsAction,
    getWorkspaceSettingsAction,
    updateWorkspaceSettingsAction,
];
