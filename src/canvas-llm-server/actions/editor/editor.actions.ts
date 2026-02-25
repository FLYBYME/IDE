import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import * as crypto from 'crypto';
import {
    EditorStateInput,
    EditorSaveStateInput,
    EditorOpenFileInput,
    EditorCloseFileInput,
    EditorAutosaveInput,
} from '../../models/schemas';
import { vfsManager } from '../../core/vfs-manager';

import { prisma } from '../../core/prisma';

async function getState(workspaceId: string) {
    let state = await prisma.editorState.findUnique({
        where: { workspaceId },
        include: { tabs: true },
    });
    if (!state) {
        state = await prisma.editorState.create({
            data: { workspaceId },
            include: { tabs: true },
        });
    }
    return state;
}

// ── editor.getState ──────────────────────────────────
export const getEditorStateAction: ServiceAction = {
    name: 'editor.getState',
    version: 1,
    description: 'Get editor state (open tabs, cursor position)',
    domain: 'editor',
    tags: ['editor', 'state', 'read'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/editor/state', middleware: ['requireAuth'] },
    auth: { required: true },
    input: EditorStateInput,
    output: z.object({ tabs: z.array(z.any()), activeTabId: z.string().optional().nullable(), lastSaved: z.string().optional().nullable() }),
    handler: async (ctx) => {
        const { workspaceId } = ctx.params as z.infer<typeof EditorStateInput>;
        const state = await getState(workspaceId);
        return {
            ...state,
            lastSaved: state.lastSaved?.toISOString()
        };
    },
};

// ── editor.saveState ─────────────────────────────────
export const saveEditorStateAction: ServiceAction = {
    name: 'editor.saveState',
    version: 1,
    description: 'Save editor state (session restore)',
    domain: 'editor',
    tags: ['editor', 'state', 'save'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/editor/state', middleware: ['requireAuth'] },
    auth: { required: true },
    input: EditorSaveStateInput,
    output: z.object({ saved: z.string() }),
    handler: async (ctx) => {
        const { workspaceId, tabs, activeTabPath } = ctx.params as z.infer<typeof EditorSaveStateInput>;

        // Ensure state exists
        await getState(workspaceId);

        const now = new Date();

        await prisma.$transaction([
            prisma.tabState.deleteMany({ where: { editorStateId: workspaceId } }),
            prisma.editorState.update({
                where: { workspaceId },
                data: {
                    lastSaved: now,
                    tabs: {
                        create: tabs.map((t) => ({
                            id: crypto.randomUUID(),
                            path: t.path,
                            title: t.path.split('/').pop() || t.path,
                            isDirty: false,
                            isActive: t.path === activeTabPath,
                            cursorLine: t.cursorLine,
                            cursorColumn: t.cursorColumn,
                            scrollTop: t.scrollTop,
                        })),
                    },
                },
            }),
        ]);

        const updatedState = await prisma.editorState.findUnique({
            where: { workspaceId },
            include: { tabs: true },
        });

        if (activeTabPath && updatedState) {
            const activeTab = updatedState.tabs.find((t) => t.path === activeTabPath);
            if (activeTab) {
                await prisma.editorState.update({
                    where: { workspaceId },
                    data: { activeTabId: activeTab.id },
                });
            }
        }

        return { saved: now.toISOString() };
    },
};

// ── editor.openFile ──────────────────────────────────
export const openFileAction: ServiceAction = {
    name: 'editor.openFile',
    version: 1,
    description: 'Open a file in the editor',
    domain: 'editor',
    tags: ['editor', 'open'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/editor/openFile', middleware: ['requireAuth'] },
    auth: { required: true },
    input: EditorOpenFileInput,
    output: z.object({
        tabId: z.string(),
        path: z.string(),
        content: z.string(),
        language: z.string(),
        size: z.number(),
    }),
    handler: async (ctx) => {
        const { workspaceId, path: filePath, activate } = ctx.params as z.infer<typeof EditorOpenFileInput>;
        const vfs = await vfsManager.getVFS(workspaceId);
        const file = vfs.read(filePath);
        if (!file) throw new Error(`File not found: ${filePath}`);

        const state = await getState(workspaceId);
        let tab = state.tabs.find((t) => t.path === filePath);

        if (!tab) {
            tab = await prisma.tabState.create({
                data: {
                    editorStateId: workspaceId,
                    path: filePath,
                    title: filePath.split('/').pop() || filePath,
                    isDirty: false,
                    isActive: false,
                    cursorLine: 1,
                    cursorColumn: 1,
                    scrollTop: 0,
                },
            });
        }

        if (activate !== false) {
            await prisma.tabState.updateMany({
                where: { editorStateId: workspaceId },
                data: { isActive: false },
            });
            await prisma.tabState.update({
                where: { id: tab.id },
                data: { isActive: true },
            });
            await prisma.editorState.update({
                where: { workspaceId },
                data: { activeTabId: tab.id },
            });
        }

        return {
            tabId: tab.id,
            path: filePath,
            content: file.content,
            language: file.context?.language || 'text',
            size: file.content.length,
        };
    },
};

// ── editor.closeFile ─────────────────────────────────
export const closeFileAction: ServiceAction = {
    name: 'editor.closeFile',
    version: 1,
    description: 'Close a tab',
    domain: 'editor',
    tags: ['editor', 'close'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/editor/closeFile', middleware: ['requireAuth'] },
    auth: { required: true },
    input: EditorCloseFileInput,
    output: z.object({ success: z.boolean(), hadUnsavedChanges: z.boolean() }),
    handler: async (ctx) => {
        const { workspaceId, tabId, force } = ctx.params as z.infer<typeof EditorCloseFileInput>;
        const state = await getState(workspaceId);
        const tab = state.tabs.find((t) => t.id === tabId);
        if (!tab) throw new Error('Tab not found');

        if (tab.isDirty && !force) {
            return { success: false, hadUnsavedChanges: true };
        }

        await prisma.tabState.delete({ where: { id: tabId } });

        if (state.activeTabId === tabId) {
            const remainingTabs = await prisma.tabState.findMany({ where: { editorStateId: workspaceId } });
            if (remainingTabs.length > 0) {
                await prisma.tabState.update({
                    where: { id: remainingTabs[0].id },
                    data: { isActive: true },
                });
                await prisma.editorState.update({
                    where: { workspaceId },
                    data: { activeTabId: remainingTabs[0].id },
                });
            } else {
                await prisma.editorState.update({
                    where: { workspaceId },
                    data: { activeTabId: null },
                });
            }
        }

        return { success: true, hadUnsavedChanges: tab.isDirty };
    },
};

// ── editor.autosave ──────────────────────────────────
export const autosaveAction: ServiceAction = {
    name: 'editor.autosave',
    version: 1,
    description: 'Auto-save a file with draft/backup mechanism',
    domain: 'editor',
    tags: ['editor', 'autosave'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/editor/autosave', middleware: ['requireAuth'] },
    auth: { required: true },
    input: EditorAutosaveInput,
    output: z.object({ saved: z.string(), isDraft: z.boolean() }),
    handler: async (ctx) => {
        const { workspaceId, path: filePath, content, isDraft } = ctx.params as z.infer<typeof EditorAutosaveInput>;
        const vfs = await vfsManager.getVFS(workspaceId);

        if (isDraft) {
            vfs.write(`__drafts__/${filePath}`, content);
        } else {
            vfs.write(filePath, content);
        }

        // Mark tab as clean
        const tab = await prisma.tabState.findFirst({
            where: { editorStateId: workspaceId, path: filePath }
        });

        if (tab) {
            await prisma.tabState.update({
                where: { id: tab.id },
                data: { isDirty: false },
            });
        }

        return { saved: new Date().toISOString(), isDraft: isDraft ?? false };
    },
};

export default [
    getEditorStateAction,
    saveEditorStateAction,
    openFileAction,
    closeFileAction,
    autosaveAction,
];
