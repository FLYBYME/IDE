# **VirtualFileSystem (VFS) - Comprehensive Documentation**

## **Table of Contents**

1. [Overview & Architecture](#overview--architecture)
2. [Core Concepts](#core-concepts)
3. [Installation & Setup](#installation--setup)
4. [API Reference](#api-reference)
5. [File Operations](#file-operations)
6. [Git-like Versioning](#git-like-versioning)
7. [Advanced Features](#advanced-features)
8. [Examples & Recipes](#examples--recipes)
9. [Integration with Other Modules](#integration-with-other-modules)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## **Overview & Architecture**

### **What is VirtualFileSystem?**

The `VirtualFileSystem` (VFS) is an in-memory, Git-like file system abstraction built in TypeScript. It provides:

- **Virtual file storage** with text content and metadata
- **Version control** (commits, branches, merging)
- **Snapshot persistence** (save/load to JSON)
- **File ignore patterns** (.gitignore support)
- **Code analysis** (imports, exports, AST for TS/JS files)
- **Integration points** for compilers, sandboxes, and IDE backends

### **Key Use Cases**

1. **Cloud IDE Backend**: File storage for browser-based code editors
2. **AI Code Agent**: Virtual workspace where agents can write/modify code
3. **Build System**: Staging ground for compilation and code generation
4. **Sandbox Execution**: Files prepared for Docker/container execution
5. **Testing Framework**: Isolated file systems for unit tests
6. **Code Generation**: Template-based project scaffolding

### **Architecture Diagram**

```
┌─────────────────────────────────────────────────────┐
│            VirtualFileSystem (VFS)                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Working Directory                         │    │
│  │  (Current uncommitted files)               │    │
│  │  Map<path, VirtualFile>                    │    │
│  └────────────────────────────────────────────┘    │
│                       ↕                             │
│  ┌────────────────────────────────────────────┐    │
│  │  Object Store (Git Objects)                │    │
│  │  - Blobs (file content)                    │    │
│  │  - Trees (directory structure)             │    │
│  │  - Commits (snapshots + metadata)          │    │
│  │  IObjectStore interface                    │    │
│  └────────────────────────────────────────────┘    │
│                       ↕                             │
│  ┌────────────────────────────────────────────┐    │
│  │  Reference Store                           │    │
│  │  - Branches (refs/heads/*)                 │    │
│  │  - HEAD pointer                            │    │
│  │  Map<refName, commitHash>                  │    │
│  └───────────────────────────────────────────���┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
         ↕
    Disk Snapshot (JSON)
         ↕
    Compiler / DockerSandbox
```

---

## **Core Concepts**

### **1. Virtual Files**

A `VirtualFile` represents a single file in the VFS:

```typescript
class VirtualFile {
  path: string;              // Absolute path within VFS
  content: string;           // Text content
  version: number;           // Incremented on updates
  context: FileContext;      // Metadata (language, imports, etc.)
}
```

**FileContext** automatically extracts:
- **Language**: Detected from file extension (.ts, .js, .json, etc.)
- **Imports**: Extracted from import/require statements (TS/JS only)
- **Exports**: Extracted from export statements
- **Diagnostics**: Compilation errors or issues
- **AST**: TypeScript AST if applicable

### **2. Git-like Objects**

VFS uses immutable Git objects for versioning:

#### **Blob** - File Content
```typescript
{
  type: 'blob',
  hash: 'abc123...',         // SHA-1 of content
  content: 'file content...'
}
```

#### **Tree** - Directory Structure
```typescript
{
  type: 'tree',
  hash: '...',
  entries: [
    { name: 'main.ts', type: 'blob', hash: '...', mode: '100644' },
    { name: 'utils', type: 'tree', hash: '...', mode: '040000' }
  ]
}
```

#### **Commit** - Versioned Snapshot
```typescript
{
  type: 'commit',
  hash: '...',
  tree: 'hash of root tree',
  parents: ['parent commit hash'],
  message: 'Commit message',
  author: 'Alice',
  timestamp: 1645000000
}
```

### **3. References (Branches & HEAD)**

- **Branch Refs**: `refs/heads/main`, `refs/heads/feature-x`
- **HEAD**: Points to current branch or detached commit
- **Merging**: 3-way merge with conflict detection

### **4. Ignore Patterns**

`.gitignore` files are parsed and respected:
```
node_modules/
*.log
dist/
!important.log  # Negation patterns
```

---

## **Installation & Setup**

### **Basic Setup**

```typescript
import { VirtualFileSystem } from '@flybyme/vfs';

// Create VFS
const vfs = new VirtualFileSystem();

// Or with custom root directory
const vfs = new VirtualFileSystem('/workspace');

// Or with custom object store
import { InMemoryObjectStore } from '@flybyme/vfs';
const customStore = new InMemoryObjectStore();
const vfs = new VirtualFileSystem('/workspace', customStore);
```

### **Initialize Default Files**

```typescript
import { ProjectScaffolder } from '@flybyme/vfs';

const scaffolder = new ProjectScaffolder(vfs);
scaffolder.scaffoldNodeProject('my-app');

// This creates:
// - package.json
// - tsconfig.json
// - src/index.ts
```

---

## **API Reference**

### **Constructor**

```typescript
constructor(
  rootDir: string = process.cwd(),
  objectStore?: IObjectStore
)
```

- **rootDir**: Virtual root directory (all paths relative to this)
- **objectStore**: Custom storage backend (default: in-memory)

---

## **File Operations**

### **Write (Create/Update)**

```typescript
vfs.write(filePath: string, content: string): void
```

**Examples:**
```typescript
// Create new file
vfs.write('src/main.ts', 'console.log("Hello")');

// Update existing file
vfs.write('src/main.ts', 'console.log("Updated")');

// Nested path (creates automatically)
vfs.write('src/utils/helpers.ts', 'export function add(a, b) { return a + b; }');
```

**Behavior:**
- Creates file if doesn't exist
- Updates file if exists
- Increments version number
- Re-analyzes context (imports, exports, etc.)
- Returns immediately (synchronous)

---

### **Read**

```typescript
vfs.read(filePath: string): VirtualFile | undefined
```

**Examples:**
```typescript
const file = vfs.read('src/main.ts');

if (file) {
  console.log(file.content);
  console.log(file.version);
  console.log(file.context.language);  // 'typescript'
  console.log(file.context.imports);   // ['express', './utils']
}
```

**Returns:**
- `VirtualFile` object with content, version, context, AST
- `undefined` if file doesn't exist

---

### **Delete**

```typescript
vfs.delete(filePath: string): void
```

**Examples:**
```typescript
vfs.delete('src/utils/old-helpers.ts');
vfs.delete('build/output.js');
```

**Behavior:**
- Removes file from working directory
- Can be uncommitted or later committed
- No error if file doesn't exist

---

### **List All Files**

```typescript
vfs.getAllFiles(): VirtualFile[]
```

**Examples:**
```typescript
const allFiles = vfs.getAllFiles();

for (const file of allFiles) {
  console.log(file.path);
  console.log(file.context.language);
}

// Filter TypeScript files
const tsFiles = vfs.getAllFiles().filter(f => f.context.language === 'typescript');
```

---

### **List Directory**

```typescript
vfs.readdir(
  dirPath: string,
  options?: { 
    recursive?: boolean,
    ignore?: boolean 
  }
): string[]
```

**Examples:**
```typescript
// List direct children
const entries = vfs.readdir('src');
// Output: ['main.ts', 'utils', 'config.json']

// Recursive listing
const allEntries = vfs.readdir('src', { recursive: true });
// Output: ['main.ts', 'utils/index.ts', 'utils/helpers.ts', ...]

// Respect .gitignore
const filtered = vfs.readdir('.', { recursive: true, ignore: true });
// Output: (excludes node_modules/, .git/, etc.)
```

**Behavior:**
- Returns names only, not full paths
- Recursive: returns all nested files/folders
- ignore: skips paths matched by .gitignore
- Sorted alphabetically

---

## **Git-like Versioning**

### **Commit**

```typescript
async commit(
  message: string,
  author?: string,
  parents?: string[]
): Promise<string>
```

**Examples:**
```typescript
// Simple commit
const hash1 = await vfs.commit('Initial commit', 'Alice');

// Commit with custom parents (for merge commits)
const hash2 = await vfs.commit(
  'Merge feature-x',
  'Alice',
  [hash1, 'abc123...']
);
```

**Behavior:**
- Creates immutable snapshot of current working files
- Respects .gitignore (ignored files not committed)
- Returns commit hash (SHA-1)
- Updates current branch or HEAD
- Incremental—only new/changed files create new blobs

**Under the Hood:**
1. Creates Blob for each file
2. Builds Tree structure
3. Creates Commit object
4. Stores all objects in ObjectStore
5. Updates branch reference

---

### **Log / History**

```typescript
async log(): Promise<GitCommit[]>
```

**Examples:**
```typescript
const history = await vfs.log();

for (const commit of history) {
  console.log(`${commit.hash.substring(0, 7)} - ${commit.message}`);
  console.log(`  Author: ${commit.author} (${new Date(commit.timestamp)})`);
}

// Output:
// abc1234 - Merge feature-x
//   Author: Alice (Tue Feb 24 2026 10:00:00)
// def5678 - Add config
//   Author: Bob (Tue Feb 24 2026 09:00:00)
// ghi9012 - Initial commit
//   Author: Alice (Tue Feb 24 2026 08:00:00)
```

**Behavior:**
- Returns linear history from HEAD backwards
- Includes all ancestors
- Newest first

---

### **Checkout**

```typescript
async checkout(hashOrRef: string): Promise<void>
```

**Examples:**
```typescript
// Checkout a branch
await vfs.checkout('main');

// Checkout specific commit (detached HEAD)
await vfs.checkout('abc1234567...');

// Checkout relative references
await vfs.checkout('HEAD~1');  // Parent of current commit
await vfs.checkout('HEAD~2');  // Grandparent
```

**Behavior:**
- Restores working directory to commit state
- **Destructive**: discards uncommitted changes
- Updates HEAD to branch or detaches to commit hash
- Restores all files from commit tree

---

### **Create Branch**

```typescript
async createBranch(name: string): Promise<void>
```

**Examples:**
```typescript
// Create from current HEAD
await vfs.createBranch('feature-auth');

// Then switch to it
await vfs.checkout('feature-auth');
```

**Behavior:**
- Creates new branch reference
- Points to current HEAD
- Throws if branch already exists
- Doesn't switch to new branch

---

### **Delete Branch**

```typescript
deleteBranch(name: string): void
```

**Examples:**
```typescript
vfs.deleteBranch('feature-auth');
```

**Behavior:**
- Removes branch reference
- Throws if branch is checked out
- Synchronous

---

### **Merge**

```typescript
async merge(branchName: string): Promise<string>
```

**Examples:**
```typescript
// Currently on 'main', merge 'feature-x'
await vfs.checkout('main');
const result = await vfs.merge('feature-x');

// Output: "Fast-forward" or "Merge successful"
```

**Merge Scenarios:**

1. **Fast-forward**: If main hasn't changed since branch
   ```
   main:       A --- B --- C
   feature-x:              └─ D
   After FF:   A --- B --- C --- D
   ```

2. **3-way merge**: If both branches changed
   ```
   main:       A --- B --- C
                 \
   feature-x:    └─ D --- E
   After merge:  A --- B --- C --- M
                       └─ D --- E ─┘
   ```

3. **Conflict**: If same file changed on both sides
   - Throws error: "Merge conflict in {file}"
   - Manual resolution required

**Behavior:**
- Finds common ancestor (merge base)
- Performs 3-way merge
- Creates merge commit if not fast-forward
- Returns merge result message
- Throws on conflicts

---

### **Status**

```typescript
async status(): Promise<StatusResult>
```

**Returns:**
```typescript
{
  modified: ['src/main.ts', 'src/utils.ts'],    // Changed since HEAD
  new: ['src/new-feature.ts'],                  // New files not in HEAD
  deleted: []                                    // In HEAD but not working
}
```

**Examples:**
```typescript
const status = await vfs.status();

console.log(`Modified: ${status.modified.length}`);
console.log(`New: ${status.new.length}`);
console.log(`Deleted: ${status.deleted.length}`);
```

**Behavior:**
- Compares working directory to HEAD
- Respects .gitignore
- Fast (cached)

---

## **Advanced Features**

### **Snapshotting & Persistence**

#### **Save to Disk**

```typescript
async saveToDisk(snapshotPath: string): Promise<void>
```

Serializes entire VFS state to JSON file.

**Examples:**
```typescript
// Save current state
await vfs.saveToDisk('./my-workspace.json');

// Save with timestamp
const timestamp = new Date().toISOString();
await vfs.saveToDisk(`./backups/vfs-${timestamp}.json`);
```

**What's Saved:**
- All files (content, version, context)
- All commits and history
- All branches
- Current HEAD state
- Total size: typically small (JSON compressed)

**File Structure:**
```json
{
  "objects": [
    ["abc123", { "type": "blob", "hash": "...", "content": "..." }],
    ["def456", { "type": "tree", "hash": "...", "entries": [...] }],
    ["ghi789", { "type": "commit", "hash": "...", "tree": "...", ... }]
  ],
  "refs": [
    ["refs/heads/main", "ghi789"],
    ["refs/heads/feature", "abc123"]
  ],
  "head": "refs/heads/main",
  "workingFiles": [
    { "path": "/workspace/main.ts", "content": "..." },
    { "path": "/workspace/utils.ts", "content": "..." }
  ]
}
```

#### **Load from Disk**

```typescript
async loadFromDisk(snapshotPath: string): Promise<void>
```

Restores entire VFS from snapshot.

**Examples:**
```typescript
const vfs = new VirtualFileSystem();
await vfs.loadFromDisk('./my-workspace.json');

// VFS is now fully restored with all history
const history = await vfs.log();
const file = vfs.read('main.ts');
```

**Behavior:**
- Clears current state
- Loads objects, refs, HEAD
- Restores working files
- Synchronous commit, checkout, etc. now work on loaded history

---

### **Custom Object Store**

For advanced use cases (persistence, distributed storage, etc.):

```typescript
interface IObjectStore {
  get(hash: string): Promise<AnyGitObject | undefined>;
  put(obj: AnyGitObject): Promise<void>;
  dump(): Promise<{ hash: string, object: AnyGitObject }[]>;
  load(objects: { hash: string, object: AnyGitObject }[]): Promise<void>;
}

// Example: Redis-backed store
class RedisObjectStore implements IObjectStore {
  async get(hash: string) {
    const json = await redis.get(`vfs:${hash}`);
    return json ? JSON.parse(json) : undefined;
  }
  async put(obj: AnyGitObject) {
    await redis.set(`vfs:${obj.hash}`, JSON.stringify(obj));
  }
  // ... etc
}

const vfs = new VirtualFileSystem('.', new RedisObjectStore());
```

---

## **Examples & Recipes**

### **Recipe 1: Simple File Editing Session**

```typescript
import { VirtualFileSystem } from '@flybyme/vfs';

const vfs = new VirtualFileSystem();

// Create initial files
vfs.write('main.ts', 'console.log("v1")');
vfs.write('config.json', '{}');

// Commit
await vfs.commit('Initial commit', 'Alice');

// Edit file
vfs.write('main.ts', 'console.log("v2")');

// Save snapshot
await vfs.saveToDisk('./session.json');
```

---

### **Recipe 2: Feature Branch Workflow**

```typescript
const vfs = new VirtualFileSystem();

// Start on main
vfs.write('main.ts', 'export function main() {}');
await vfs.commit('Initial', 'Alice');

// Create feature branch
await vfs.createBranch('feature/auth');
await vfs.checkout('feature/auth');

// Work on feature
vfs.write('auth.ts', 'export function authenticate() {}');
await vfs.commit('Add auth', 'Alice');

// Back to main
await vfs.checkout('main');
vfs.write('main.ts', 'export function main() { console.log("main"); }');
await vfs.commit('Update main', 'Alice');

// Merge feature
await vfs.merge('feature/auth');

// Check merged state
const file = vfs.read('auth.ts');
console.log(file.content);  // "export function authenticate() {}"
```

---

### **Recipe 3: Undo & Time Travel**

```typescript
const vfs = new VirtualFileSystem();

// Make changes
vfs.write('app.ts', 'v1');
await vfs.commit('v1');

vfs.write('app.ts', 'v2');
await vfs.commit('v2');

vfs.write('app.ts', 'v3');
await vfs.commit('v3');

// Time travel backwards
const history = await vfs.log();
const commitV2 = history[1];  // v2 commit

await vfs.checkout(commitV2.hash);
console.log(vfs.read('app.ts').content);  // "v2"

// Checkout back to latest
await vfs.checkout('main');
console.log(vfs.read('app.ts').content);  // "v3"
```

---

### **Recipe 4: Merging with Conflicts**

```typescript
const vfs = new VirtualFileSystem();

vfs.write('app.ts', 'function foo() {}');
await vfs.commit('base', 'Alice');

// Branch 1: add feature A
await vfs.createBranch('feature-a');
await vfs.checkout('feature-a');
vfs.write('app.ts', 'function foo() { return "a"; }');
await vfs.commit('Feature A');

// Branch 2: add feature B
await vfs.checkout('main');
await vfs.createBranch('feature-b');
await vfs.checkout('feature-b');
vfs.write('app.ts', 'function foo() { return "b"; }');
await vfs.commit('Feature B');

// Try to merge
await vfs.checkout('main');
try {
  await vfs.merge('feature-a');
  console.log('Merged A');
  
  await vfs.merge('feature-b');  // Conflict!
} catch (err) {
  console.log(err.message);
  // "Merge conflict in app.ts"
  
  // Manual resolution needed
  vfs.write('app.ts', 'function foo() { return "a and b"; }');
  await vfs.commit('Resolve conflict');
}
```

---

### **Recipe 5: Project Scaffolding**

```typescript
import { ProjectScaffolder, PackageJsonTemplate, TsConfigTemplate } from '@flybyme/vfs';

const vfs = new VirtualFileSystem();
const scaffolder = new ProjectScaffolder(vfs);

// Use built-in scaffolder
scaffolder.scaffoldNodeProject('my-app');

// Or use templates directly
scaffolder.applyTemplate(new PackageJsonTemplate(), {
  name: 'my-app',
  dependencies: {
    'express': '^4.0.0',
    'axios': '^1.0.0'
  }
});

scaffolder.applyTemplate(new TsConfigTemplate(), {
  strict: true
});

// Add custom files
vfs.write('src/index.ts', 'import express from "express";\n...');
vfs.write('.gitignore', 'node_modules/\n.env\n');

// Commit
await vfs.commit('Scaffold project', 'Alice');

// Save
await vfs.saveToDisk('./project.json');
```

---

### **Recipe 6: Integration with Compiler**

```typescript
import { VirtualFileSystem } from '@flybyme/vfs';
import { TypeScriptCompiler } from '@flybyme/vfs';

const vfs = new VirtualFileSystem();
const compiler = new TypeScriptCompiler(vfs, '/path/to/node_modules');

// Write TypeScript
vfs.write('main.ts', 'function greet(name: string): string { return "Hello " + name; }');

// Compile
const result = compiler.compileFiles();

if (result.success) {
  console.log('✓ Compiled successfully');
  for (const file of result.outputFiles) {
    console.log(`  ${file.fileName}`);
  }
} else {
  console.log('✗ Compilation errors:');
  for (const diagnostic of result.diagnostics) {
    console.log(`  ${diagnostic}`);
  }
}

// Commit compiled code
await vfs.commit('Add compiled output', 'Builder');
```

---

## **Integration with Other Modules**

### **With Compiler**

```typescript
const compiler = new TypeScriptCompiler(vfs, pkgRoot);
compiler.loadConfigFromVfs();
const result = compiler.compileFiles();
```

### **With DockerSandbox**

```typescript
const sandbox = new DockerSandbox();

// Install dependencies
await sandbox.installDependencies(pkgRoot, packageJsonContent);

// Execute code
const logs = await sandbox.execute({
  vfs,
  entryPoint: 'src/index.ts',
  pkgRoot,
  timeoutMs: 5000
});

console.log(logs.stdout);
console.log(logs.stderr);
```

### **With ToolRegistry**

```typescript
const registry = new ToolRegistry(compiler, vfs);
await registry.loadTools('./tools');

const prompt = registry.getDefinitionsPrompt();
console.log(prompt);  // TypeScript definitions for LLM
```

---

## **Best Practices**

### **1. Always Commit Before Save**

```typescript
// ✓ Good
vfs.write('app.ts', 'content');
await vfs.commit('Update app');
await vfs.saveToDisk('./backup.json');

// ✗ Bad (uncommitted changes lost when loaded)
vfs.write('app.ts', 'content');
await vfs.saveToDisk('./backup.json');  // uncommitted changes NOT saved
```

### **2. Use .gitignore**

```typescript
vfs.write('.gitignore', 'node_modules/\n.env\n*.log\n');

// Now these files are ignored
vfs.readdir('.', { recursive: true, ignore: true });
```

### **3. Regular Snapshots**

```typescript
setInterval(async () => {
  const timestamp = new Date().toISOString();
  await vfs.saveToDisk(`./backups/vfs-${timestamp}.json`);
}, 60000);  // Every minute
```

### **4. Check Status Before Operations**

```typescript
const status = await vfs.status();

if (status.modified.length > 0) {
  console.log('Warning: uncommitted changes');
  for (const file of status.modified) {
    console.log(`  - ${file}`);
  }
}
```

### **5. Handle Merge Conflicts Gracefully**

```typescript
try {
  await vfs.merge(branchName);
} catch (err) {
  if (err.message.includes('Merge conflict')) {
    // Notify user, provide conflict resolution UI
    console.log('Merge conflict detected');
  } else {
    throw err;
  }
}
```

---

## **Troubleshooting**

### **File Not Found**

```typescript
const file = vfs.read('nonexistent.ts');
// Returns undefined, not error

// Always check:
if (file) { ... }
```

### **Path Issues**

```typescript
// Use forward slashes (Unix-style)
vfs.write('src/utils/helpers.ts', '...');  // ✓

// Don't use backslashes
vfs.write('src\\utils\\helpers.ts', '...');  // ✗
```

### **Merge Conflicts**

```typescript
// Catch and handle
try {
  await vfs.merge(branch);
} catch (err) {
  // Manually resolve conflict
  const conflictFile = vfs.read('app.ts');
  // Parse conflict markers, decide on resolution
  vfs.write('app.ts', resolvedContent);
  await vfs.commit('Resolve conflict');
}
```

### **Large Snapshots**

If snapshots get large:
- Remove old branches: `vfs.deleteBranch(name)`
- Create new VFS: `const newVfs = new VirtualFileSystem(); await newVfs.loadFromDisk(...)`
- Prune history if needed

---

## **API Cheat Sheet**

| Operation | Code |
|-----------|------|
| Create/Update file | `vfs.write(path, content)` |
| Read file | `vfs.read(path)` |
| Delete file | `vfs.delete(path)` |
| List files | `vfs.getAllFiles()` |
| List directory | `vfs.readdir(dir)` |
| Commit | `await vfs.commit(msg, author)` |
| View history | `await vfs.log()` |
| Checkout | `await vfs.checkout(ref)` |
| Create branch | `await vfs.createBranch(name)` |
| Merge branch | `await vfs.merge(name)` |
| Check status | `await vfs.status()` |
| Save snapshot | `await vfs.saveToDisk(path)` |
| Load snapshot | `await vfs.loadFromDisk(path)` |
