# **CanvasLLM IDE: Comprehensive Server Actions & Endpoints Specification**

## **Table of Contents**

1. [Architecture Overview](#architecture-overview)
2. [Authentication & Sessions](#authentication--sessions)
3. [Workspace Management](#workspace-management)
4. [File System Operations](#file-system-operations)
5. [Editor & Tabs Management](#editor--tabs-management)
6. [Settings & Configuration](#settings--configuration)
7. [Code Intelligence](#code-intelligence)
8. [Extensions/Plugins](#extensionsplugins)
9. [Themes & UI State](#themes--ui-state)
10. [Activity & Sidebar](#activity--sidebar)
11. [Notifications & Status](#notifications--status)
12. [Terminal/Command Execution](#terminalcommand-execution)
13. [Collaboration (Optional)](#collaborationoptional)
14. [AI Agent Integration](#ai-agent-integration)
15. [Meta/Discovery Endpoints](#metadiscovery-endpoints)

---

## **Architecture Overview**

The IDE server architecture comprises:

- **Session/Auth Layer**: User authentication, session management
- **Workspace Layer**: Project/workspace organization
- **File Layer**: File system operations, versioning
- **Editor Layer**: Tab state, open files, unsaved changes
- **Intelligence Layer**: Code formatting, linting, diagnostics
- **Settings Layer**: User preferences, workspace config
- **Extension Layer**: Plugin registry, lifecycle
- **Collab Layer**: Optional real-time sync for multi-user editing
- **AI Layer**: Agent endpoints for code assist, generation

---

## **1. Authentication & Sessions**

### **1.1 POST /api/auth/login**

**Name:** `auth.login`  
**Description:** Authenticate user and create session

**Input Schema:**
```typescript
{
  username: string;          // Username or email
  password: string;          // Password
  rememberMe?: boolean;      // Keep session persistent
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  token: string;             // JWT or session token
  user: {
    id: string;              // User ID
    username: string;
    email: string;
    createdAt: ISO8601;
  };
  expiresIn?: number;        // Seconds until token expires
}
```

**HTTP Status:**
- 200: Login successful
- 401: Invalid credentials
- 400: Missing fields

---

### **1.2 POST /api/auth/logout**

**Name:** `auth.logout`  
**Description:** Invalidate user session

**Auth Required:** Yes

**Input Schema:** `{}`

**Output Schema:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

### **1.3 GET /api/auth/session**

**Name:** `auth.getSession`  
**Description:** Get current session/user info

**Auth Required:** Yes

**Input Schema:** `{}`

**Output Schema:**
```typescript
{
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  permissions: string[];     // e.g., ["read", "write", "admin"]
  workspace?: {
    id: string;
    name: string;
  };
  tokenExpires: ISO8601;
}
```

---

### **1.4 POST /api/auth/refresh**

**Name:** `auth.refreshToken`  
**Description:** Refresh expired session token

**Auth Required:** Yes (using expired token)

**Input Schema:** `{ token: string; }`

**Output Schema:**
```typescript
{
  token: string;
  expiresIn: number;
}
```

---

## **2. Workspace Management**

### **2.1 GET /api/workspaces**

**Name:** `workspace.list`  
**Description:** List all workspaces for authenticated user

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  limit?: number;            // Default 20
  offset?: number;           // Default 0
  sort?: 'name' | 'updated'; // Sort by name or last updated
}
```

**Output Schema:**
```typescript
{
  total: number;
  workspaces: Array<{
    id: string;
    name: string;
    description?: string;
    owner: string;
    created: ISO8601;
    updated: ISO8601;
    files: number;           // Total file count
    size: number;            // Total size in bytes
    lastOpened?: ISO8601;
    isStarred?: boolean;
  }>;
}
```

**Tags:** `workspace`, `list`, `user`

---

### **2.2 POST /api/workspaces**

**Name:** `workspace.create`  
**Description:** Create a new workspace

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  name: string;              // Workspace name (required)
  description?: string;
  template?: string;         // 'empty' | 'react' | 'nodejs' | 'python'
  isPublic?: boolean;
}
```

**Output Schema:**
```typescript
{
  id: string;
  name: string;
  description?: string;
  owner: string;
  created: ISO8601;
  template: string;
}
```

**Tags:** `workspace`, `create`

---

### **2.3 GET /api/workspaces/:id**

**Name:** `workspace.get`  
**Description:** Get workspace details

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  id: string;                // Workspace ID (path param)
}
```

**Output Schema:**
```typescript
{
  id: string;
  name: string;
  description?: string;
  owner: string;
  members?: Array<{
    id: string;
    username: string;
    role: 'owner' | 'editor' | 'viewer';
  }>;
  settings: {
    language?: string;
    theme?: string;
    autoFormat?: boolean;
    formatOnSave?: boolean;
  };
  stats: {
    fileCount: number;
    totalSize: number;
    lastModified: ISO8601;
  };
}
```

---

### **2.4 PATCH /api/workspaces/:id**

**Name:** `workspace.update`  
**Description:** Update workspace metadata

**Auth Required:** Yes (owner only)

**Input Schema:**
```typescript
{
  id: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
}
```

**Output Schema:**
```typescript
{
  id: string;
  updated: ISO8601;
}
```

---

### **2.5 DELETE /api/workspaces/:id**

**Name:** `workspace.delete`  
**Description:** Delete a workspace

**Auth Required:** Yes (owner only)

**Input Schema:**
```typescript
{
  id: string;
  confirm?: boolean;         // Require confirmation
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

## **3. File System Operations**

### **3.1 GET /api/workspaces/:id/files**

**Name:** `file.listTree`  
**Description:** List all files/folders in workspace (tree structure)

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;       // Path param
  path?: string;             // Subfolder (default: "/")
  recursive?: boolean;       // Include nested folders
  includeContent?: boolean;  // Include file content (only for small files)
}
```

**Output Schema:**
```typescript
{
  path: string;
  entries: Array<{
    name: string;
    type: 'file' | 'folder';
    path: string;
    size?: number;
    modified: ISO8601;
    icon?: string;            // FontAwesome class
    children?: Array<...>;    // If recursive=true
  }>;
}
```

---

### **3.2 GET /api/workspaces/:id/files/:path**

**Name:** `file.get`  
**Description:** Get file content (text or binary)

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;       // Path param
  path: string;              // File path (path param)
  format?: 'text' | 'base64' | 'json'; // Default: auto-detect
  range?: {                  // For large files, get specific range
    start: number;
    end: number;
  };
}
```

**Output Schema:**
```typescript
{
  path: string;
  type: 'file';
  content: string | object;
  encoding: 'utf8' | 'base64';
  size: number;
  language: string;          // For text files (typescript, python, etc.)
  modified: ISO8601;
  isDirty?: boolean;
}
```

---

### **3.3 POST /api/workspaces/:id/files**

**Name:** `file.create`  
**Description:** Create new file or folder

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;              // New file path
  type: 'file' | 'folder';
  content?: string;          // Initial content (for files)
  language?: string;         // For syntax highlighting
}
```

**Output Schema:**
```typescript
{
  path: string;
  type: 'file' | 'folder';
  created: ISO8601;
}
```

---

### **3.4 PUT /api/workspaces/:id/files/:path**

**Name:** `file.save`  
**Description:** Save/update file content

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;              // Path param
  content: string;           // File content
  encoding?: 'utf8' | 'base64';
  language?: string;
  autoFormat?: boolean;      // Format before saving
  createIfMissing?: boolean; // Create if doesn't exist
}
```

**Output Schema:**
```typescript
{
  path: string;
  size: number;
  modified: ISO8601;
  hash?: string;             // For change detection
  formatted?: boolean;       // Whether it was formatted
}
```

---

### **3.5 DELETE /api/workspaces/:id/files/:path**

**Name:** `file.delete`  
**Description:** Delete file or folder

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;
  recursive?: boolean;       // Delete folder contents
  confirm?: boolean;
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  deleted: number;           // Number of files deleted
}
```

---

### **3.6 POST /api/workspaces/:id/files/rename**

**Name:** `file.rename`  
**Description:** Rename or move file/folder

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  oldPath: string;
  newPath: string;
}
```

**Output Schema:**
```typescript
{
  oldPath: string;
  newPath: string;
  moved: ISO8601;
}
```

---

### **3.7 POST /api/workspaces/:id/files/copy**

**Name:** `file.copy`  
**Description:** Duplicate file or folder

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;
  destinationPath?: string;  // Default: adds " (copy)"
  recursive?: boolean;
}
```

**Output Schema:**
```typescript
{
  original: string;
  copy: string;
  created: ISO8601;
}
```

---

### **3.8 GET /api/workspaces/:id/files/search**

**Name:** `file.search`  
**Description:** Search files by name or content

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  query: string;             // Search term
  type?: 'name' | 'content' | 'both'; // What to search
  language?: string;         // Filter by file type
  limit?: number;
  caseSensitive?: boolean;
}
```

**Output Schema:**
```typescript
{
  total: number;
  results: Array<{
    path: string;
    matches: Array<{
      line?: number;
      column?: number;
      snippet?: string;
    }>;
  }>;
}
```

---

## **4. Editor & Tabs Management**

### **4.1 GET /api/workspaces/:id/editor/state**

**Name:** `editor.getState`  
**Description:** Get editor state (open tabs, cursor position, etc.)

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
}
```

**Output Schema:**
```typescript
{
  tabs: Array<{
    id: string;
    path: string;
    title: string;
    isDirty: boolean;
    isActive: boolean;
    cursorLine?: number;
    cursorColumn?: number;
    scrollTop?: number;
  }>;
  activeTabId?: string;
  splitView?: {
    left?: string;           // Tab ID on left
    right?: string;          // Tab ID on right
  };
  lastSaved?: ISO8601;
}
```

---

### **4.2 POST /api/workspaces/:id/editor/state**

**Name:** `editor.saveState`  
**Description:** Save editor state (for session restore)

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  tabs: Array<{
    path: string;
    cursorLine: number;
    cursorColumn: number;
    scrollTop: number;
  }>;
  activeTabPath?: string;
}
```

**Output Schema:**
```typescript
{
  saved: ISO8601;
}
```

---

### **4.3 POST /api/workspaces/:id/editor/openFile**

**Name:** `editor.openFile`  
**Description:** Open a file in the editor

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;
  activate?: boolean;        // Make this tab active
  split?: 'left' | 'right';  // Open in split view
}
```

**Output Schema:**
```typescript
{
  tabId: string;
  path: string;
  content: string;
  language: string;
  size: number;
}
```

---

### **4.4 POST /api/workspaces/:id/editor/closeFile**

**Name:** `editor.closeFile`  
**Description:** Close a tab

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  tabId: string;
  force?: boolean;           // Close even if unsaved
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  hadUnsavedChanges: boolean;
}
```

---

### **4.5 POST /api/workspaces/:id/editor/autosave**

**Name:** `editor.autosave`  
**Description:** Auto-save a file with draft/backup mechanism

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;
  content: string;
  isDraft?: boolean;         // Save as draft, not final
}
```

**Output Schema:**
```typescript
{
  saved: ISO8601;
  isDraft: boolean;
  backupVersion?: number;
}
```

---

## **5. Settings & Configuration**

### **5.1 GET /api/settings**

**Name:** `settings.getUserSettings`  
**Description:** Get global user settings

**Auth Required:** Yes

**Input Schema:** `{}`

**Output Schema:**
```typescript
{
  user: {
    theme: 'dark' | 'light' | 'auto';
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
  };
}
```

---

### **5.2 POST /api/settings**

**Name:** `settings.updateUserSettings`  
**Description:** Update user settings

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  // Any subset of settings above
  theme?: string;
  fontSize?: number;
  autoFormat?: boolean;
  // ... etc
}
```

**Output Schema:**
```typescript
{
  updated: ISO8601;
  settings: {
    // Updated settings
  };
}
```

---

### **5.3 GET /api/workspaces/:id/settings**

**Name:** `settings.getWorkspaceSettings`  
**Description:** Get workspace-specific settings

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
}
```

**Output Schema:**
```typescript
{
  workspace: {
    language?: string;
    formatter?: 'prettier' | 'eslint' | 'black';
    linter?: 'eslint' | 'pylint' | 'none';
    theme?: string;           // Workspace-specific theme override
    extensions?: string[];    // Active extensions for this workspace
  };
}
```

---

### **5.4 POST /api/workspaces/:id/settings**

**Name:** `settings.updateWorkspaceSettings`  
**Description:** Update workspace settings

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  language?: string;
  formatter?: string;
  linter?: string;
  // ... etc
}
```

**Output Schema:**
```typescript
{
  updated: ISO8601;
}
```

---

## **6. Code Intelligence**

### **6.1 POST /api/code/format**

**Name:** `code.format`  
**Description:** Format code using configured formatter

**Auth Required:** No (can be client-side)

**Input Schema:**
```typescript
{
  content: string;
  language: string;          // 'typescript', 'python', 'javascript', etc.
  formatter?: string;        // 'prettier', 'black', etc.
}
```

**Output Schema:**
```typescript
{
  formatted: string;
  changed: boolean;
  duration: number;          // ms
}
```

---

### **6.2 POST /api/code/lint**

**Name:** `code.lint`  
**Description:** Run linter and return diagnostics

**Auth Required:** No

**Input Schema:**
```typescript
{
  content: string;
  language: string;
  linter?: string;           // 'eslint', 'pylint'
}
```

**Output Schema:**
```typescript
{
  diagnostics: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    rule: string;
    fix?: string;             // Auto-fix suggestion
  }>;
}
```

---

### **6.3 POST /api/code/complete**

**Name:** `code.autocomplete`  
**Description:** Get autocomplete suggestions (IntelliSense)

**Auth Required:** No

**Input Schema:**
```typescript
{
  content: string;
  line: number;
  column: number;
  language: string;
  context?: string;          // Surrounding code context
}
```

**Output Schema:**
```typescript
{
  suggestions: Array<{
    label: string;
    kind: 'function' | 'variable' | 'class' | 'keyword' | etc;
    detail?: string;
    documentation?: string;
    sortText?: string;
    insertText?: string;
    range?: { start: number; end: number };
  }>;
}
```

---

### **6.4 POST /api/code/hover**

**Name:** `code.getHover`  
**Description:** Get hover information (type hints, docs)

**Auth Required:** No

**Input Schema:**
```typescript
{
  content: string;
  line: number;
  column: number;
  language: string;
}
```

**Output Schema:**
```typescript
{
  hover?: {
    contents: string;        // Markdown or plain text
    range?: { startLine: number; endLine: number };
  };
}
```

---

### **6.5 POST /api/code/definition**

**Name:** `code.goToDefinition`  
**Description:** Find definition of symbol at position

**Auth Required:** Yes (needs workspace)

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;
  line: number;
  column: number;
}
```

**Output Schema:**
```typescript
{
  definition?: {
    path: string;
    line: number;
    column: number;
  };
}
```

---

### **6.6 POST /api/code/references**

**Name:** `code.findReferences`  
**Description:** Find all references to a symbol

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;
  line: number;
  column: number;
}
```

**Output Schema:**
```typescript
{
  references: Array<{
    path: string;
    line: number;
    column: number;
    context?: string;
  }>;
  total: number;
}
```

---

### **6.7 POST /api/code/rename**

**Name:** `code.rename`  
**Description:** Rename symbol with refactoring

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;
  line: number;
  column: number;
  newName: string;
}
```

**Output Schema:**
```typescript
{
  changes: Array<{
    path: string;
    edits: Array<{
      range: { start: number; end: number };
      newText: string;
    }>;
  }>;
  fileCount: number;
  totalEdits: number;
}
```

---

## **7. Extensions/Plugins**

### **7.1 GET /api/extensions**

**Name:** `extension.list`  
**Description:** List available extensions

**Auth Required:** No

**Input Schema:**
```typescript
{
  installed?: boolean;       // Show only installed
  category?: string;
  sort?: 'downloads' | 'rating' | 'newest';
}
```

**Output Schema:**
```typescript
{
  total: number;
  extensions: Array<{
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    downloads: number;
    rating: number;
    icon?: string;
    installed?: boolean;
    tags: string[];
  }>;
}
```

---

### **7.2 POST /api/extensions/install**

**Name:** `extension.install`  
**Description:** Install an extension

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  extensionId: string;
  version?: string;          // Specific version, or latest
  workspaceOnly?: boolean;   // Install for this workspace only
}
```

**Output Schema:**
```typescript
{
  id: string;
  name: string;
  version: string;
  installed: ISO8601;
}
```

---

### **7.3 POST /api/extensions/uninstall**

**Name:** `extension.uninstall`  
**Description:** Uninstall extension

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  extensionId: string;
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  uninstalled: ISO8601;
}
```

---

### **7.4 POST /api/extensions/:id/enable**

**Name:** `extension.enable`  
**Description:** Enable a disabled extension

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  extensionId: string;
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  enabled: ISO8601;
}
```

---

### **7.5 POST /api/extensions/:id/disable**

**Name:** `extension.disable`  
**Description:** Disable an extension

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  extensionId: string;
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  disabled: ISO8601;
}
```

---

## **8. Themes & UI State**

### **8.1 GET /api/themes**

**Name:** `theme.list`  
**Description:** List available themes

**Auth Required:** No

**Input Schema:** `{}`

**Output Schema:**
```typescript
{
  themes: Array<{
    id: string;
    name: string;
    kind: 'dark' | 'light';
    colors: {
      // CSS variable mappings
    };
    custom?: boolean;
  }>;
}
```

---

### **8.2 POST /api/themes/create**

**Name:** `theme.create`  
**Description:** Create custom theme

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  name: string;
  baseTheme: 'dark' | 'light';
  colors: Record<string, string>;
}
```

**Output Schema:**
```typescript
{
  id: string;
  name: string;
  created: ISO8601;
}
```

---

### **8.3 GET /api/workspaces/:id/ui/state**

**Name:** `ui.getState`  
**Description:** Get UI layout state (panel sizes, visibility)

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
}
```

**Output Schema:**
```typescript
{
  layout: {
    sidebar: {
      width: number;
      visible: boolean;
      activePanel: string;
    };
    activityBar: {
      visible: boolean;
    };
    statusBar: {
      visible: boolean;
    };
    terminal: {
      visible: boolean;
      height: number;
    };
    panels: Record<string, {
      visible: boolean;
      width?: number;
      height?: number;
    }>;
  };
}
```

---

### **8.4 POST /api/workspaces/:id/ui/state**

**Name:** `ui.saveState`  
**Description:** Save UI layout state

**Auth Required:** Yes

**Input Schema:** (same structure as output above)

**Output Schema:**
```typescript
{
  saved: ISO8601;
}
```

---

## **9. Activity & Sidebar**

### **9.1 GET /api/workspaces/:id/activity/recent**

**Name:** `activity.getRecent`  
**Description:** Get recently accessed files/actions

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  limit?: number;
}
```

**Output Schema:**
```typescript
{
  recent: Array<{
    type: 'file' | 'action';
    path?: string;
    name: string;
    accessed: ISO8601;
    icon?: string;
  }>;
}
```

---

### **9.2 GET /api/workspaces/:id/sidebar/outline**

**Name:** `sidebar.getOutline`  
**Description:** Get code outline (symbols, structure)

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  path: string;              // File path
}
```

**Output Schema:**
```typescript
{
  symbols: Array<{
    name: string;
    kind: 'class' | 'function' | 'variable' | etc;
    line: number;
    children?: Array<...>;
  }>;
}
```

---

## **10. Notifications & Status**

### **10.1 POST /api/notifications**

**Name:** `notification.create`  
**Description:** Create a notification (for status updates)

**Auth Required:** Yes (internal use)

**Input Schema:**
```typescript
{
  workspaceId: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  duration?: number;         // ms to auto-dismiss
  actions?: Array<{
    label: string;
    actionId: string;
  }>;
}
```

**Output Schema:**
```typescript
{
  id: string;
  created: ISO8601;
}
```

---

### **10.2 GET /api/workspaces/:id/status**

**Name:** `status.get`  
**Description:** Get IDE status (errors, warnings, git status)

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
}
```

**Output Schema:**
```typescript
{
  errors: number;
  warnings: number;
  infos: number;
  git?: {
    branch: string;
    isDirty: boolean;
    ahead: number;
    behind: number;
  };
  language?: string;
  encoding?: string;
}
```

---

## **11. Terminal/Command Execution**

### **11.1 POST /api/workspaces/:id/terminal/execute**

**Name:** `terminal.execute`  
**Description:** Execute shell command in workspace

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  command: string;           // Command to execute
  args?: string[];
  cwd?: string;              // Working directory (default: workspace root)
  timeout?: number;          // ms timeout
}
```

**Output Schema:**
```typescript
{
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
}
```

---

### **11.2 WebSocket /api/workspaces/:id/terminal/stream**

**Name:** `terminal.stream`  
**Description:** Stream terminal I/O in real-time

**Protocol:** WebSocket

**Message Types:**

```typescript
// Client -> Server
{ type: 'input', data: string }      // Send keystrokes
{ type: 'resize', cols: number, rows: number }

// Server -> Client
{ type: 'output', data: string }     // Terminal output
{ type: 'exit', code: number }       // Process ended
```

---

## **12. Collaboration (Optional)**

### **12.1 GET /api/workspaces/:id/members**

**Name:** `collaboration.getMembers`  
**Description:** List workspace collaborators

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
}
```

**Output Schema:**
```typescript
{
  members: Array<{
    id: string;
    username: string;
    email: string;
    role: 'owner' | 'editor' | 'viewer';
    avatar?: string;
    lastActive?: ISO8601;
  }>;
}
```

---

### **12.2 POST /api/workspaces/:id/members**

**Name:** `collaboration.inviteMember`  
**Description:** Invite user to workspace

**Auth Required:** Yes (owner)

**Input Schema:**
```typescript
{
  workspaceId: string;
  email: string;
  role: 'editor' | 'viewer';
  message?: string;
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  inviteSent: ISO8601;
}
```

---

### **12.3 WebSocket /api/workspaces/:id/collab/sync**

**Name:** `collaboration.sync`  
**Description:** Real-time collaborative editing

**Protocol:** WebSocket with CRDT/OT sync

**Message Types:**

```typescript
// Client -> Server
{
  type: 'edit',
  path: string,
  changes: [{
    range: { startLine, startCol, endLine, endCol },
    text: string
  }]
}

// Server -> Client
{
  type: 'remote-edit',
  userId: string,
  path: string,
  changes: [...]
}

{
  type: 'cursor',
  userId: string,
  path: string,
  line: number,
  column: number
}
```

---

## **13. AI Agent Integration**

### **13.1 POST /api/ai/chat**

**Name:** `ai.chat`  
**Description:** Send message to AI code assistant

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    currentFile?: string;
    selectedText?: string;
    cursorPosition?: { line: number; column: number };
  };
  model?: string;            // e.g., 'gpt-4', 'claude-opus'
  temperature?: number;
  maxTokens?: number;
}
```

**Output Schema:**
```typescript
{
  id: string;
  message: string;
  suggestions?: Array<{
    type: 'edit' | 'refactor' | 'generate' | 'explain';
    label: string;
    code?: string;
    range?: { startLine: number; endLine: number };
  }>;
  tokens: {
    prompt: number;
    completion: number;
  };
}
```

---

### **13.2 POST /api/ai/codeGenerate**

**Name:** `ai.generateCode`  
**Description:** Generate code from description

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  prompt: string;
  language?: string;
  context?: string;
  insertPoint?: { path: string; line: number };
}
```

**Output Schema:**
```typescript
{
  code: string;
  language: string;
  explanation?: string;
  preview?: boolean;         // Whether user should review before applying
}
```

---

### **13.3 POST /api/ai/codeExplain**

**Name:** `ai.explainCode`  
**Description:** Explain selected code

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  code: string;
  language: string;
  style?: 'beginner' | 'intermediate' | 'advanced';
}
```

**Output Schema:**
```typescript
{
  explanation: string;       // Markdown
  summary: string;
  complexity?: {
    time: string;
    space: string;
  };
}
```

---

### **13.4 POST /api/ai/codeReview**

**Name:** `ai.reviewCode`  
**Description:** Review code for issues

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  workspaceId: string;
  code: string;
  language: string;
  focusAreas?: string[];     // e.g., ['performance', 'security', 'style']
}
```

**Output Schema:**
```typescript
{
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: string;
    message: string;
    line: number;
    suggestion?: string;
  }>;
  summary: string;
  score?: number;            // 0-100
}
```

---

### **13.5 POST /api/ai/codeRefactor**

**Name:** `ai.refactor`  
**Description:** Refactor code

**Auth Required:** Yes

**Input Schema:**
```typescript
{
  code: string;
  language: string;
  refactoringType: 'extract' | 'simplify' | 'optimize' | 'modernize';
  context?: string;
}
```

**Output Schema:**
```typescript
{
  refactored: string;
  changes: Array<{
    description: string;
    before: string;
    after: string;
  }>;
  explanation?: string;
}
```

---

## **14. Meta/Discovery Endpoints**

### **14.1 GET /api/_meta/routes**

**Name:** `meta.discoverRoutes`  
**Description:** Discover all available endpoints (OpenAPI-style)

**Auth Required:** No

**Output Schema:**
```typescript
{
  version: string;
  serverName: string;
  count: number;
  routes: Array<{
    name: string;
    description: string;
    method: string;
    path: string;
    auth?: boolean;
    input: JSONSchema;
    output: JSONSchema;
    tags: string[];
  }>;
}
```

---

### **14.2 GET /api/_meta/capabilities**

**Name:** `meta.getCapabilities`  
**Description:** Get IDE capabilities and feature list

**Auth Required:** No

**Output Schema:**
```typescript
{
  features: {
    collab: boolean;
    ai: boolean;
    linting: boolean;
    formatting: boolean;
    terminal: boolean;
    git: boolean;
  };
  limits: {
    maxWorkspaces: number;
    maxFileSize: number;
    maxProjectSize: number;
  };
  supportedLanguages: string[];
  supportedFormatters: string[];
  supportedLinters: string[];
  models: Array<{
    id: string;
    name: string;
    provider: string;
    costPer1KTokens: number;
  }>;
}
```

---

### **14.3 GET /api/_meta/health**

**Name:** `meta.healthCheck`  
**Description:** Server health and status

**Auth Required:** No

**Output Schema:**
```typescript
{
  status: 'healthy' | 'degraded' | 'down';
  timestamp: ISO8601;
  uptime: number;            // seconds
  version: string;
  services: {
    database?: boolean;
    cache?: boolean;
    fileStorage?: boolean;
    aiModels?: boolean;
  };
}
```

---

## **Error Response Format**

All endpoints return standardized errors:

```typescript
{
  error: string;             // Error code (e.g., "VALIDATION_ERROR")
  message: string;           // Human-readable message
  details?: any;             // Additional context
  requestId?: string;        // For debugging
  timestamp: ISO8601;
}
```

---

## **Authentication Headers**

All auth-required endpoints expect:

```
Authorization: Bearer <token>
X-Correlation-ID: <optional-uuid>
X-Request-ID: <optional-uuid>
```

---

## **Rate Limiting**

- **Public endpoints**: 100 requests/minute per IP
- **Authenticated endpoints**: 1000 requests/minute per user
- **AI endpoints**: 50 requests/minute per user (or credit-based)

Headers returned:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1645000000
```

---

## **Summary Table**

| Category | Endpoints | Count |
|----------|-----------|-------|
| Auth | login, logout, session, refresh | 4 |
| Workspace | list, create, get, update, delete | 5 |
| Files | listTree, get, create, save, delete, rename, copy, search | 8 |
| Editor | getState, saveState, open, close, autosave | 5 |
| Settings | getUserSettings, updateUserSettings, getWorkspaceSettings, updateWorkspaceSettings | 4 |
| Code Intelligence | format, lint, complete, hover, definition, references, rename | 7 |
| Extensions | list, install, uninstall, enable, disable | 5 |
| Themes | list, create | 2 |
| UI | getState, saveState | 2 |
| Activity | getRecent, getOutline | 2 |
| Notifications | create, getStatus | 2 |
| Terminal | execute, stream (WebSocket) | 2 |
| Collaboration | getMembers, inviteMember, sync (WebSocket) | 3 |
| AI Agent | chat, generateCode, explainCode, reviewCode, refactor | 5 |
| Meta | discoverRoutes, getCapabilities, healthCheck | 3 |

**Total: ~65 endpoints**
