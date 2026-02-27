import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import {
    SettingsUpdateInput,
    WorkspaceSettingsInput,
    WorkspaceSettingsUpdateInput,
    UserSettingsOutput,
    WorkspaceSettingsOutput,
} from '../../models/schemas';

import { prisma } from '../../core/prisma';

// ── In-memory settings stores (REMOVED) ──────────────

const DEFAULT_USER_SETTINGS = {
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
    output: z.object({ user: UserSettingsOutput }),
    handler: async (ctx) => {
        const userId = ctx.metadata.user.id;;

        let userSettings = await prisma.userSettings.upsert({
            where: { userId },
            create: { userId, ...DEFAULT_USER_SETTINGS },
            update: {}
        });

        // Prisma returns Decimal/BigInt depending on DB, but SQLite returns regular types.
        // Convert dates if any, or just return as is.
        return { user: userSettings };
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
    output: z.object({ updated: z.string(), settings: UserSettingsOutput }),
    handler: async (ctx) => {
        const userId = ctx.metadata.user.id;;
        const updates = ctx.params as any;

        // Remove nulls from updates to avoid overwriting with null if the type doesn't allow it
        for (const key of Object.keys(updates)) {
            if (updates[key] === null) {
                delete updates[key];
            }
        }

        const updatedSettings = await prisma.userSettings.upsert({
            where: { userId },
            create: { userId, ...DEFAULT_USER_SETTINGS, ...updates },
            update: updates,
        });

        return { updated: new Date().toISOString(), settings: updatedSettings };
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
    output: z.object({ workspace: WorkspaceSettingsOutput }),
    handler: async (ctx) => {
        const { workspaceId } = ctx.params as z.infer<typeof WorkspaceSettingsInput>;
        const wsSettings = await prisma.workspaceSettings.findUnique({
            where: { workspaceId }
        });

        let current = {};
        if (wsSettings && wsSettings.settings) {
            try {
                current = JSON.parse(wsSettings.settings);
            } catch (e) { }
        }

        return { workspace: current };
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

        const wsSettings = await prisma.workspaceSettings.findUnique({
            where: { workspaceId }
        });

        let current: Record<string, any> = {};
        if (wsSettings && wsSettings.settings) {
            try {
                current = JSON.parse(wsSettings.settings);
            } catch (e) { }
        }

        Object.assign(current, updates);

        await prisma.workspaceSettings.upsert({
            where: { workspaceId },
            create: { workspaceId, settings: JSON.stringify(current) },
            update: { settings: JSON.stringify(current) }
        });

        return { updated: new Date().toISOString() };
    },
};

export default [
    getUserSettingsAction,
    updateUserSettingsAction,
    getWorkspaceSettingsAction,
    updateWorkspaceSettingsAction,
];
