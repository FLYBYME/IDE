import { z } from 'zod';

// ── Auth ─────────────────────────────────────────────
export const LoginInput = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    rememberMe: z.boolean().optional().nullable(),
});

export const RefreshInput = z.object({
    token: z.string().min(1),
});

// ── Workspace ────────────────────────────────────────
export const WorkspaceCreateInput = z.object({
    name: z.string().min(1),
    description: z.string().optional().nullable(),
    template: z.string().optional().nullable(),
    isPublic: z.boolean().optional().nullable(),
});

export const WorkspaceUpdateInput = z.object({
    id: z.string().uuid(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    isPublic: z.boolean().optional().nullable(),
});

export const WorkspaceIdInput = z.object({
    id: z.string().uuid(),
});

export const WorkspaceListInput = z.object({
    limit: z.coerce.number().optional().nullable().default(20),
    offset: z.coerce.number().optional().nullable().default(0),
    sort: z.enum(['name', 'updated']).optional().nullable(),
});

export const WorkspaceDeleteInput = z.object({
    id: z.string().uuid(),
    confirm: z.boolean().optional().nullable(),
});

export const WorkspaceExecuteInput = z.object({
    id: z.string().uuid(),
    command: z.array(z.string()),
});


// ── Files ────────────────────────────────────────────
export const FileListTreeInput = z.object({
    workspaceId: z.string().uuid(),
    path: z.string().optional().nullable().default('/'),
    recursive: z.coerce.boolean().optional().nullable(),
    includeContent: z.coerce.boolean().optional().nullable(),
});

export const FileGetInput = z.object({
    workspaceId: z.string().uuid(),
    path: z.string().min(1),
    format: z.enum(['text', 'base64', 'json']).optional().nullable(),
});

export const FileCreateInput = z.object({
    workspaceId: z.string().uuid(),
    path: z.string().min(1),
    type: z.enum(['file', 'folder']),
    content: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
});

export const FileSaveInput = z.object({
    workspaceId: z.string().uuid(),
    path: z.string().min(1),
    content: z.string(),
    encoding: z.enum(['utf8', 'base64']).optional().nullable(),
    language: z.string().optional().nullable(),
    autoFormat: z.boolean().optional().nullable(),
    createIfMissing: z.boolean().optional().nullable(),
});

export const FileDeleteInput = z.object({
    workspaceId: z.string().uuid(),
    path: z.string().min(1),
    recursive: z.coerce.boolean().optional().nullable(),
    confirm: z.coerce.boolean().optional().nullable(),
});

export const FileRenameInput = z.object({
    workspaceId: z.string().uuid(),
    oldPath: z.string().min(1),
    newPath: z.string().min(1),
});

export const FileCopyInput = z.object({
    workspaceId: z.string().uuid(),
    path: z.string().min(1),
    destinationPath: z.string().optional().nullable(),
    recursive: z.boolean().optional().nullable(),
});

export const FileSearchInput = z.object({
    workspaceId: z.string().uuid(),
    query: z.string().min(1),
    type: z.enum(['name', 'content', 'both']).optional().nullable(),
    language: z.string().optional().nullable(),
    limit: z.coerce.number().optional().nullable(),
    caseSensitive: z.coerce.boolean().optional().nullable(),
});

// ── Editor ───────────────────────────────────────────
export const EditorStateInput = z.object({
    workspaceId: z.string().uuid(),
});

export const EditorSaveStateInput = z.object({
    workspaceId: z.string().uuid(),
    tabs: z.array(z.object({
        path: z.string(),
        cursorLine: z.number(),
        cursorColumn: z.number(),
        scrollTop: z.number(),
    })),
    activeTabPath: z.string().optional().nullable(),
});

export const EditorOpenFileInput = z.object({
    workspaceId: z.string().uuid(),
    path: z.string().min(1),
    activate: z.boolean().optional().nullable(),
    split: z.enum(['left', 'right']).optional().nullable(),
});

export const EditorCloseFileInput = z.object({
    workspaceId: z.string().uuid(),
    tabId: z.string().min(1),
    force: z.boolean().optional().nullable(),
});

export const EditorAutosaveInput = z.object({
    workspaceId: z.string().uuid(),
    path: z.string().min(1),
    content: z.string(),
    isDraft: z.boolean().optional().nullable(),
});

// ── Secrets ──────────────────────────────────────────
export const SecretSetInput = z.object({
    workspaceId: z.string().uuid(),
    key: z.string().min(1).regex(/^[A-Z0-9_]+$/, "Key must be uppercase alphanumeric with underscores"),
    value: z.string().min(1),
});

export const SecretListInput = z.object({
    workspaceId: z.string().uuid(),
});

export const SecretDeleteInput = z.object({
    workspaceId: z.string().uuid(),
    key: z.string().min(1),
});

// ── Settings ─────────────────────────────────────────
export const SettingsUpdateInput = z.object({
    theme: z.string().optional().nullable(),
    fontSize: z.number().optional().nullable(),
    fontFamily: z.string().optional().nullable(),
    tabSize: z.number().optional().nullable(),
    useSpaces: z.boolean().optional().nullable(),
    autoFormat: z.boolean().optional().nullable(),
    formatOnSave: z.boolean().optional().nullable(),
    autoSave: z.boolean().optional().nullable(),
    autoSaveDelay: z.number().optional().nullable(),
    wordWrap: z.boolean().optional().nullable(),
    minimap: z.boolean().optional().nullable(),
    lineNumbers: z.boolean().optional().nullable(),
});

export const WorkspaceSettingsInput = z.object({
    workspaceId: z.string().uuid(),
});

export const WorkspaceSettingsUpdateInput = z.object({
    workspaceId: z.string().uuid(),
    language: z.string().optional().nullable(),
    formatter: z.string().optional().nullable(),
    linter: z.string().optional().nullable(),
    theme: z.string().optional().nullable(),
});

// ── AI ───────────────────────────────────────────────
export const AIChatInput = z.object({
    workspaceId: z.string().uuid().optional().nullable(),
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
    })),
    context: z.object({
        currentFile: z.string().optional().nullable(),
        selectedText: z.string().optional().nullable(),
        cursorPosition: z.object({
            line: z.number(),
            column: z.number(),
        }).optional().nullable(),
    }).optional().nullable(),
    model: z.string().optional().nullable(),
    temperature: z.number().optional().nullable(),
    maxTokens: z.number().optional().nullable(),
});

export const AIGenerateInput = z.object({
    workspaceId: z.string().uuid(),
    prompt: z.string().min(1),
    language: z.string().optional().nullable(),
    context: z.string().optional().nullable(),
});

export const AIExplainInput = z.object({
    code: z.string().min(1),
    language: z.string(),
    style: z.enum(['beginner', 'intermediate', 'advanced']).optional().nullable(),
});

export const AIReviewInput = z.object({
    workspaceId: z.string().uuid(),
    code: z.string().min(1),
    language: z.string(),
    focusAreas: z.array(z.string()).optional().nullable(),
});

export const AIRefactorInput = z.object({
    code: z.string().min(1),
    language: z.string(),
    refactoringType: z.enum(['extract', 'simplify', 'optimize', 'modernize']),
    context: z.string().optional().nullable(),
});

// ── Generic output schemas ───────────────────────────
export const SuccessOutput = z.object({
    success: z.boolean(),
    message: z.string().optional().nullable(),
}).passthrough();

export const TimestampOutput = z.object({}).passthrough();

// ── Specific Output Schemas ───────────────────────────
export const WorkspaceOutput = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable().optional(),
    ownerId: z.string(),
    isPublic: z.boolean(),
    createdAt: z.union([z.string(), z.date()]),
    updatedAt: z.union([z.string(), z.date()]),
});

export const FileInfoOutput = z.object({
    name: z.string(),
    type: z.enum(['file', 'folder']),
    path: z.string(),
    size: z.number().optional(),
    modified: z.string(),
});

export const TabStateOutput = z.object({
    id: z.string(),
    path: z.string(),
    title: z.string(),
    isDirty: z.boolean(),
    isActive: z.boolean(),
    cursorLine: z.number(),
    cursorColumn: z.number(),
    scrollTop: z.number(),
});

export const EditorStateOutput = z.object({
    workspaceId: z.string().uuid(),
    tabs: z.array(TabStateOutput),
    activeTabId: z.string().optional().nullable(),
    lastSaved: z.string().optional().nullable(),
});

export const SecretOutput = z.object({
    key: z.string(),
    updatedAt: z.union([z.string(), z.date()]),
});

export const UserSettingsOutput = z.object({
    theme: z.string(),
    fontSize: z.number(),
    fontFamily: z.string(),
    tabSize: z.number(),
    useSpaces: z.boolean(),
    autoFormat: z.boolean(),
    formatOnSave: z.boolean(),
    autoSave: z.boolean(),
    autoSaveDelay: z.number(),
    wordWrap: z.boolean(),
    minimap: z.boolean(),
    lineNumbers: z.boolean(),
});

export const WorkspaceSettingsOutput = z.object({
    language: z.string(),
    formatter: z.string(),
    linter: z.string(),
    theme: z.string().nullable(),
});

export const AICodeIssueOutput = z.object({
    line: z.number().optional(),
    description: z.string(),
    severity: z.enum(['info', 'warning', 'error']),
    suggestion: z.string().optional(),
});

export const AICodeChangeOutput = z.object({
    type: z.enum(['add', 'modify', 'delete']),
    line: z.number().optional(),
    content: z.string(),
    explanation: z.string().optional(),
});

// ── Source Control ───────────────────────────────────
export const SourceControlWorkspaceInput = z.object({
    workspaceId: z.string().uuid(),
});

export const SourceControlCommitInput = z.object({
    workspaceId: z.string().uuid(),
    message: z.string().min(1),
});

export const SourceControlBranchInput = z.object({
    workspaceId: z.string().uuid(),
    name: z.string().min(1),
});

export const SourceControlCheckoutInput = z.object({
    workspaceId: z.string().uuid(),
    ref: z.string().min(1),
});

export const SourceControlMergeInput = z.object({
    workspaceId: z.string().uuid(),
    branchName: z.string().min(1),
});
// ── Extension ────────────────────────────────────────
export const ExtensionSubmitInput = z.object({
    gitUrl: z.string().url(),
    gitBranch: z.string().optional().default('main'),
    manifestPath: z.string().optional().default('package.json'),
});

export const ExtensionBuildStatusOutput = z.object({
    id: z.string().uuid(),
    extensionId: z.string().uuid(),
    status: z.enum(['PENDING', 'CLONING', 'INSTALLING', 'BUILDING', 'READY', 'FAILED']),
    buildLogs: z.string(),
    entryPointUrl: z.string().optional().nullable(),
});

