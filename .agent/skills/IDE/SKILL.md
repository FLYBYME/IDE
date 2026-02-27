---
name: IDE
description: Technical details, architecture patterns, and coding conventions for the IDE codebase.
---

# IDE Skill

This skill provides comprehensive instructions on the architecture, patterns, and conventions used in the IDE codebase. Use this when you need to modify core services, create new extensions, test the API, or add backend functionality.

## Architecture Overview

The project is split into two main parts:
1.  **Client (`src/client`)**: A TypeScript-based frontend with a custom service architecture, using Monaco Editor for the core editing experience.
2.  **Server (`src/canvas-llm-server`)**: A Node.js backend built on `tool-ms` using a domain-driven action pattern. It relies on Prisma with the `PrismaBetterSqlite3` adapter for database operations and Docker for isolated workspace execution.

### Core Patterns

#### 1. Command & Event System (Frontend)
The IDE uses a central `CommandRegistry` and `EventBus` for inter-component communication.
- **Commands**: Executable actions (e.g., `editor.openFile`). Registered via `ide.commands.register`.
- **Events**: Pub/Sub events (e.g., `workspace:loaded`). Emitted via `ide.commands.emit` or directly via `EventBus`.

#### 2. Service-Action Pattern (Backend)
Backend logic is encapsulated in `ServiceAction` objects.
- Each action defines its `name`, `domain`, `rest` configuration, and `handler`.
- Inputs and outputs are strictly validated using Zod schemas defined in `models/schemas.ts`.
- Actions are grouped into domains (e.g., `auth`, `files`, `workspace`) and registered with the `ServiceManager`.
- Middleware like `requireAuth` is used to protect routes and inject user context into headers.

#### 3. Virtual File System (VFS) & Workspace Containers
The IDE uses a VFS mapped to real Docker containers to safely manage and execute code.
- **Client**: `WorkerFileSystemProvider` manages an in-memory VFS in a Web Worker, syncing with the backend.
- **Server**: The `VfsManager` manages active `VirtualFileSystem` instances, lazy-loading them from disk snapshots and persisting them upon eviction.
- **Containers**: The `WorkspaceContainerManager` runs a dedicated Docker container for each active workspace, maintaining a bidirectional file sync between the host bridge directory and the VFS.

#### 4. Unified Communication Bridge (UCB)
A real-time communication layer utilizing WebSockets for pushing updates from the server to the client.
- Connects to `/gateway` and authenticates via a `token` query parameter or the `sec-websocket-protocol` header.
- Broadcasts JSON frames across specific channels like `vfs` (file changes), `terminal` (command output), and `system` (heartbeats and notifications).

#### 5. Extension Builder Pipeline
Extensions are built dynamically on the server via the `ExtensionBuilderService`.
- The server clones the Git repository into a container, validates the manifest, installs dependencies, and bundles the code using `esbuild`.
- The resulting `bundle.js` and `package.json` are extracted and stored in the public assets directory.

---

## How to Use

### Creating a New Extension
1.  **Frontend**: Create a new file in `src/client/extensions/`. Define an `Extension` object implementing `activate(context)`. Register views or commands using `context.ide`.
2.  **Backend Submission**: Extensions are submitted via the `extensions.submit` action, providing a Git URL and branch.

### Registering a New Command (Frontend)
```typescript
ide.commands.register({
    id: 'my.custom.command',
    label: 'My Command',
    category: 'General',
    handler: (args) => {
        // Implementation
    }
});

```

### Creating a Backend Action

1. Define the `ServiceAction` in the appropriate `actions/` subdirectory.
2. Specify Zod schemas for `input` and `output` in `schemas.ts`.
3. Implement the `handler` logic, using `ctx.params` for inputs and `ctx.headers` for auth data.
4. Export the action and add it to the domain's default export array.

### Testing the API: The "Test Harness" Approach

When testing the API (or letting a coding agent test the live API), do not write raw scripts or `curl` commands. Instead, create a small test runner using the `HttpClient` class. This allows the agent to leverage the `/_meta/routes` endpoint to understand the API surface automatically.

Use the `./tests/test-file-name.ts` file as a template.

To run the test harness, use the following command:

First start the server. The server will never be running in the background.

```bash
npm run server
```

Wait for the server to be ready.

Then run the test harness:

```bash
npx ts-node ./tests/test-file-name.ts > ./tests/test-file-name.log
```

```typescript
import { HttpClient } from 'tool-ms'; // Path to the provided file

async function testAgent() {
    const client = new HttpClient('http://localhost:3001');
    
    // 1. Load the metadata (This is crucial for the client to work)
    await client.load(); 

    // 2. Perform Login to get a token
    const auth = await client.call('auth.login', {
        username: 'admin',
        password: 'admin123'
    });
    
    const headers = { Authorization: `Bearer ${auth.token}` };

    // 3. Example: Create a Workspace
    const newWs = await client.call('workspace.create', 
        { name: 'Agent Test Space' }, 
        { headers }
    );
    console.log('Created Workspace:', newWs.id);

    // 4. Example: Test File Creation (Demonstrates Path Param handling)
    await client.call('file.create', {
        workspaceId: newWs.id, // Client injects this into the path /workspaces/:workspaceId/files
        path: '/hello-world.ts',
        type: 'file',
        content: 'console.log("Hello from Agent");'
    }, { headers });
}

testAgent();

```

* **Validation:** The client automatically validates payloads against `jsonschema` definitions before sending the request.
* **Path Substitution:** It automatically substitutes path parameters (e.g., passing `{ workspaceId: newWs.id }` maps directly into `/workspaces/:workspaceId/files`).

### Path Normalization (CRITICAL)

When navigating or opening files, always normalize paths between the backend and the frontend VFS.

* **Backend Path**: `/workspace/<workspaceId>/path/to/file` (mapped inside the container)
* **VFS Path**: `<workspaceName>/path/to/file`

---

## Coding Conventions

* **Type Safety**: Use Zod for all API input/output validation.
* **Async/Await**: Prefer `async/await` over raw Promises.
* **Logging**: Use `ConsoleLogger` from `tool-ms` for backend logging (e.g., `this.logger.info(...)`).
* **Styles**: Use the defined CSS variables in `index.css` for consistent UI (e.g., `--bg-default`, `--text-normal`).
* **Icons**: Use FontAwesome 5 classes (e.g., `fas fa-search`).
* **Debouncing**: Always debounce search inputs and frequent API calls (e.g., 300ms).
* **Cleanup**: Always return or track disposables when registering listeners or views to prevent memory leaks. Clean up Docker streams and active executions upon completion.