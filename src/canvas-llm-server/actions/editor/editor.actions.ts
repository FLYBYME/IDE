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

// ── In-memory editor state store (per workspace) ─────
interface TabState {
    id: string;
    path: string;
    title: string;
    isDirty: boolean;
    isActive: boolean;
    cursorLine: number;
    cursorColumn: number;
    scrollTop: number;
}

interface EditorState {
    tabs: TabState[];
    activeTabId?: string;
    lastSaved?: string;
}

const editorStates: Map<string, EditorState> = new Map();

function getState(workspaceId: string): EditorState {
    if (!editorStates.has(workspaceId)) {
        editorStates.set(workspaceId, { tabs: [] });
    }
    return editorStates.get(workspaceId)!;
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
        return getState(workspaceId);
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
        const state = getState(workspaceId);

        state.tabs = tabs.map((t) => ({
            id: crypto.randomUUID(),
            path: t.path,
            title: t.path.split('/').pop() || t.path,
            isDirty: false,
            isActive: t.path === activeTabPath,
            cursorLine: t.cursorLine,
            cursorColumn: t.cursorColumn,
            scrollTop: t.scrollTop,
        }));
        if (activeTabPath) {
            const activeTab = state.tabs.find((t) => t.path === activeTabPath);
            state.activeTabId = activeTab?.id;
        }
        state.lastSaved = new Date().toISOString();

        return { saved: state.lastSaved };
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

        const state = getState(workspaceId);
        // Check if already open
        let tab = state.tabs.find((t) => t.path === filePath);
        if (!tab) {
            tab = {
                id: crypto.randomUUID(),
                path: filePath,
                title: filePath.split('/').pop() || filePath,
                isDirty: false,
                isActive: false,
                cursorLine: 1,
                cursorColumn: 1,
                scrollTop: 0,
            };
            state.tabs.push(tab);
        }

        if (activate !== false) {
            state.tabs.forEach((t) => (t.isActive = false));
            tab.isActive = true;
            state.activeTabId = tab.id;
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
        const state = getState(workspaceId);
        const tabIndex = state.tabs.findIndex((t) => t.id === tabId);
        if (tabIndex === -1) throw new Error('Tab not found');

        const tab = state.tabs[tabIndex];
        if (tab.isDirty && !force) {
            return { success: false, hadUnsavedChanges: true };
        }

        state.tabs.splice(tabIndex, 1);
        if (state.activeTabId === tabId && state.tabs.length > 0) {
            state.tabs[0].isActive = true;
            state.activeTabId = state.tabs[0].id;
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
            // Save as draft — write to a shadow path
            vfs.write(`__drafts__/${filePath}`, content);
        } else {
            vfs.write(filePath, content);
        }

        // Mark tab as clean
        const state = getState(workspaceId);
        const tab = state.tabs.find((t) => t.path === filePath);
        if (tab) tab.isDirty = false;

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
