# **CanvasLLM IDE: Comprehensive Server Actions & Endpoints Specification**

This document specifies all the server actions available in the CanvasLLM IDE, including their authentication requirements, REST mappings, and schema definitions.

---

## **1. Authentication & Users**

### **auth.login**
- **URL:** `POST /auth/login`
- **Auth Required:** No
- **Description:** Authenticate user and create session.
- **Input:**
  - `username` (string): Minimum 1 char.
  - `password` (string): Minimum 1 char.
  - `rememberMe` (boolean, optional): Persistent session flag.
- **Output:**
  - `success` (boolean)
  - `token` (string): Session token.
  - `user` (object): ID, username, email, role, etc.
  - `expiresIn` (number): Token expiry in seconds.

### **auth.register**
- **URL:** `POST /auth/register`
- **Auth Required:** No
- **Description:** Create a new user account.
- **Input:**
  - `username` (string): 3-50 chars.
  - `email` (string): Valid email.
  - `password` (string): Minimum 8 chars.
- **Output:** `RegisterOutput` (success, token, user).

### **auth.refreshToken**
- **URL:** `POST /auth/refresh`
- **Auth Required:** No (uses old token)
- **Description:** Refresh an expired session token.
- **Input:** `token` (string).
- **Output:** `token` (string), `expiresIn` (number).

### **auth.requestPasswordReset**
- **URL:** `POST /auth/request-reset`
- **Auth Required:** No
- **Description:** Request a password reset token via email logs.
- **Input:** `email` (string).
- **Output:** `SuccessOutput`.

### **auth.resetPassword**
- **URL:** `POST /auth/reset-password`
- **Auth Required:** No
- **Description:** Reset password using a valid token.
- **Input:** `token` (string), `newPassword` (string).
- **Output:** `SuccessOutput`.

### **auth.getSession**
- **URL:** `GET /auth/session`
- **Auth Required:** Yes
- **Description:** Get current session and user info.
- **Output:** `user` (object), `permissions` (string[]), `tokenExpires` (string).

### **auth.logout**
- **URL:** `POST /auth/logout`
- **Auth Required:** Yes
- **Description:** Invalidate user session.
- **Output:** `SuccessOutput`.

### **auth.updatePassword**
- **URL:** `POST /auth/update-password`
- **Auth Required:** Yes
- **Description:** Update password for current user.
- **Input:** `currentPassword` (string), `newPassword` (string).
- **Output:** `SuccessOutput`.

### **auth.updateProfile**
- **URL:** `PATCH /auth/profile`
- **Auth Required:** Yes
- **Description:** Update profile (username, email, bio).
- **Input:** `username` (optional), `email` (optional), `bio` (optional).
- **Output:** `SuccessOutput`.

### **admin.listUsers**
- **URL:** `GET /admin/users`
- **Auth Required:** Yes (Role: ADMIN)
- **Description:** List all users with filtering.
- **Input:** `limit`, `offset`, `role`, `search`.
- **Output:** `total`, `users` (array).

---

## **2. Workspace Management**

### **workspace.list**
- **URL:** `GET /workspaces`
- **Auth Required:** Yes
- **Description:** List workspaces for the authenticated user.
- **Input:** `limit`, `offset`, `sort` ('name' | 'updated').
- **Output:** `total`, `workspaces` (array of `WorkspaceOutput`).

### **workspace.create**
- **URL:** `POST /workspaces`
- **Auth Required:** Yes
- **Description:** Create a new workspace.
- **Input:** `name`, `description` (optional), `template` (optional), `isPublic` (optional).
- **Output:** Workspace details (id, name, owner, created, etc).

### **workspace.get**
- **URL:** `GET /workspaces/:id`
- **Auth Required:** Yes
- **Description:** Get detailed workspace information and stats.
- **Output:** `id`, `name`, `description`, `owner`, `stats` (fileCount, totalSize).

### **workspace.update**
- **URL:** `PATCH /workspaces/:id`
- **Auth Required:** Yes
- **Description:** Update workspace metadata.
- **Input:** `id`, `name`, `description`, `isPublic`.
- **Output:** `id`, `updated` (ISO timestamp).

### **workspace.delete**
- **URL:** `DELETE /workspaces/:id`
- **Auth Required:** Yes
- **Description:** Delete a workspace and its associated VFS/Container.
- **Output:** `SuccessOutput`.

### **workspace.execute**
- **URL:** `POST /workspaces/:id/execute`
- **Auth Required:** Yes
- **Description:** Execute a command in the workspace container.
- **Input:** `id`, `command` (string array).
- **Output:** `executionId` (string).

### **workspace.processes**
- **URL:** `GET /workspaces/:id/processes`
- **Auth Required:** Yes
- **Description:** List active processes in the workspace container.
- **Output:** `processes` (array of executionId, command, startTime).

---

## **3. File System (VFS)**

### **file.search**
- **URL:** `GET /workspaces/:workspaceId/files/search`
- **Auth Required:** Yes
- **Description:** Search files by name or content.
- **Input:** `query`, `type` ('name' | 'content' | 'both'), `caseSensitive`, `limit`.
- **Output:** `total`, `results` (array of path/matches).

### **file.listTree**
- **URL:** `GET /workspaces/:workspaceId/files`
- **Auth Required:** Yes
- **Description:** List files/folders in a directory.
- **Input:** `workspaceId`, `path`, `recursive`.
- **Output:** `path`, `entries` (array of `FileInfoOutput`).

### **file.get**
- **URL:** `GET /workspaces/:workspaceId/files/:path`
- **Auth Required:** Yes
- **Description:** Retrieve file content.
- **Output:** `content`, `encoding`, `size`, `language`.

### **file.create**
- **URL:** `POST /workspaces/:workspaceId/files`
- **Auth Required:** Yes
- **Description:** Create a new file or folder.
- **Input:** `path`, `type` ('file' | 'folder'), `content` (optional).
- **Output:** `path`, `type`, `created`.

### **file.save**
- **URL:** `PUT /workspaces/:workspaceId/files/:path`
- **Auth Required:** Yes
- **Description:** Update file content and sync to host.
- **Input:** `content`, `encoding`, `language`, `autoFormat`, `createIfMissing`.
- **Output:** `path`, `size`, `modified`.

### **file.delete**
- **URL:** `DELETE /workspaces/:workspaceId/files/:path`
- **Auth Required:** Yes
- **Description:** Delete a file or folder.
- **Input:** `recursive` (boolean).
- **Output:** `success`, `deleted` count.

### **file.rename**
- **URL:** `POST /workspaces/:workspaceId/files/rename`
- **Auth Required:** Yes
- **Description:** Rename or move a file/folder.
- **Input:** `oldPath`, `newPath`.
- **Output:** `oldPath`, `newPath`, `moved`.

---

## **4. Editor State**

### **editor.getState**
- **URL:** `GET /workspaces/:workspaceId/editor/state`
- **Auth Required:** Yes
- **Description:** Get open tabs and UI state for a workspace.
- **Output:** `EditorStateOutput`.

### **editor.saveState**
- **URL:** `POST /workspaces/:workspaceId/editor/state`
- **Auth Required:** Yes
- **Description:** Persist current editor tabs/layout.
- **Input:** `tabs` (array), `activeTabPath`.
- **Output:** `saved` (ISO timestamp).

### **editor.openFile**
- **URL:** `POST /workspaces/:workspaceId/editor/openFile`
- **Auth Required:** Yes
- **Description:** Open a file into a tab (creates tab if missing).
- **Input:** `path`, `activate` (boolean).
- **Output:** Tab info and file content.

### **editor.closeFile**
- **URL:** `POST /workspaces/:workspaceId/editor/closeFile`
- **Auth Required:** Yes
- **Description:** Close a tab.
- **Input:** `tabId`, `force` (boolean).
- **Output:** `success`, `hadUnsavedChanges`.

### **editor.autosave**
- **URL:** `POST /workspaces/:workspaceId/editor/autosave`
- **Auth Required:** Yes
- **Description:** Background save (can save to `__drafts__`).
- **Input:** `path`, `content`, `isDraft`.
- **Output:** `saved`, `isDraft`.

---

## **5. Settings**

### **settings.getUserSettings**
- **URL:** `GET /settings`
- **Auth Required:** Yes
- **Description:** Retrieve global user preferences.
- **Output:** `user` (object of `UserSettingsOutput`).

### **settings.updateUserSettings**
- **URL:** `POST /settings`
- **Auth Required:** Yes
- **Description:** Update global settings.
- **Input:** `SettingsUpdateInput`.
- **Output:** `updated`, `settings`.

### **settings.getWorkspaceSettings**
- **URL:** `GET /workspaces/:workspaceId/settings`
- **Auth Required:** Yes
- **Description:** Get settings specific to a workspace.
- **Output:** `workspace` (object of `WorkspaceSettingsOutput`).

### **settings.updateWorkspaceSettings**
- **URL:** `POST /workspaces/:workspaceId/settings`
- **Auth Required:** Yes
- **Description:** Update workspace-specific settings.
- **Input:** `WorkspaceSettingsUpdateInput`.
- **Output:** `updated`.

---

## **6. AI Actions**

### **ai.chat**
- **URL:** `POST /ai/chat`
- **Auth Required:** Yes
- **Description:** Interactive AI chat with context.
- **Input:** `messages`, `context`, `model`, `temperature`.
- **Output:** `message`, `suggestions`, `tokens`.

### **ai.generateCode**
- **URL:** `POST /ai/codeGenerate`
- **Auth Required:** Yes
- **Description:** Generate code snippets from natural language.
- **Input:** `prompt`, `language`, `context`.
- **Output:** `code`, `explanation`, `preview`.

### **ai.explainCode**
- **URL:** `POST /ai/codeExplain`
- **Auth Required:** Yes
- **Description:** Get an explanation of the provided code block.
- **Input:** `code`, `language`, `style`.
- **Output:** `explanation`, `summary`.

---

## **7. Source Control**

### **source-control.status**
- **URL:** `GET /workspaces/:workspaceId/source-control/status`
- **Auth Required:** Yes
- **Description:** Compare working directory against VFS HEAD.
- **Output:** `modified`, `new`, `deleted` filenaming arrays.

### **source-control.commit**
- **URL:** `POST /workspaces/:workspaceId/source-control/commit`
- **Auth Required:** Yes
- **Description:** Create a new immutable snapshot (version).
- **Input:** `message` (string).
- **Output:** `hash` (string).

### **source-control.checkout**
- **URL:** `POST /workspaces/:workspaceId/source-control/checkout`
- **Auth Required:** Yes
- **Description:** Switch branch or checkout specific commit.
- **Input:** `ref` (string).
- **Output:** `success`.

---

## **8. Extensions**

### **extensions.list**
- **URL:** `GET /extensions`
- **Auth Required:** Yes
- **Description:** List available marketplace extensions.
- **Output:** `extensions` (array).

### **extensions.install**
- **URL:** `POST /extensions/install`
- **Auth Required:** Yes
- **Description:** Link an extension version to the user account.
- **Input:** `versionId` (string).
- **Output:** `SuccessOutput`.

### **extensions.submit**
- **URL:** `POST /extensions/submit`
- **Auth Required:** Yes
- **Description:** Submit a Git URL to build a new extension.
- **Input:** `gitUrl`, `gitBranch`, `manifestPath`.
- **Output:** `buildId`.

---

## **9. Secrets (Environment Variables)**

### **secrets.set**
- **URL:** `POST /workspaces/:workspaceId/secrets`
- **Auth Required:** Yes
- **Description:** Store an encrypted environment variable for a workspace.
- **Input:** `key`, `value` (plain text).
- **Output:** `key`, `updatedAt`.

### **secrets.list**
- **URL:** `GET /workspaces/:workspaceId/secrets`
- **Auth Required:** Yes
- **Description:** List all secret keys (values are masked/hidden).
- **Output:** `secrets` (array of `SecretOutput`).

---

## **10. Metadata & Realtime**

### **meta.healthCheck**
- **URL:** `GET /_meta/health`
- **Auth Required:** No
- **Output:** `status`, `uptime`, `version`.

### **realtime.broadcast**
- **URL:** `POST /realtime/broadcast`
- **Auth Required:** Yes (Role: ADMIN)
- **Description:** Push a custom event to all SSE-connected clients.
- **Input:** `event`, `data`.
- **Output:** `success`, `sentAt`.
