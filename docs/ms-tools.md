# **tool-ms Service Actions & Endpoints Specification**

## **Overview**

The `tool-ms` framework provides a microservice architecture where:
- **Service Actions** are the core business units (stateless, composable)
- **HTTP Endpoints** are automatically mapped from Service Actions via REST configuration
- **Meta Discovery** provides runtime endpoint introspection
- **LLM Integration** allows AI models to discover and call actions via structured schemas

---

## **1. SERVICE ACTION STRUCTURE**

Each `ServiceAction` is a complete contract defining:

```typescript
{
  // Identity & Versioning
  name: string;                    // Unique name (e.g., "user.create")
  version: number;                 // Semantic version (1, 2, 3...)
  description: string;             // Human & LLM readable description

  // Organization
  domain?: string;                 // Domain namespace (e.g., "user", "project")
  tags: string[];                  // Searchable tags (e.g., ["create", "admin"])
  
  // Interface Contract
  rest?: RestEndpoint;             // REST API exposure (method, path)
  input: ZodSchema<TParams>;       // Input validation schema
  output: ZodSchema<TResponse>;    // Output validation schema
  
  // Composition & Flow
  dependencies?: string[];         // Required service actions
  optionalDependencies?: string[]; // Optional service actions
  
  // Authorization & Access
  auth?: AuthConfig;               // Auth requirements & scopes
  internal?: boolean;              // Hidden from public API?
  
  // Execution & Lifecycle
  handler: ServiceHandler;         // The actual implementation
  started?: () => Promise<void>;   // Lifecycle hook (startup)
  stopped?: () => Promise<void>;   // Lifecycle hook (shutdown)
  
  // Background & Event Support
  crons?: CronJob[];               // Scheduled tasks
  events?: EventConfig[];          // Event handlers this action listens to
  
  // Metadata
  metadata?: Record<string, any>;  // Custom metadata storage
}
```

---

## **2. REST ENDPOINT MAPPING**

### **Structure**

```typescript
rest: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;                    // Express-style: /users/:id/posts/:postId
  middleware?: string[];           // Named middleware to apply
}
```

### **Parameter Routing Rules**

When an HTTP request arrives at a mapped route:

1. **Path Parameters** (`:id` in path) → Extracted from URL path
2. **Query Parameters** (URL query string) → Included in params
3. **Body Parameters** (POST/PUT/PATCH) → Merged into params
4. **Headers** → Passed separately as `context.headers`

#### Example:
```
POST /api/v1/users/:userId/posts/:postId?limit=10&offset=20
{
  "title": "New Post",
  "content": "Hello"
}
```

Results in params:
```json
{
  "userId": "123",           // from path
  "postId": "456",           // from path
  "limit": "10",             // from query
  "offset": "20",            // from query
  "title": "New Post",       // from body
  "content": "Hello"         // from body
}
```

---

## **3. META DISCOVERY ENDPOINT**

### **Endpoint: GET /{apiPrefix}/_meta/routes**

**Purpose:** Dynamically discover all available actions/endpoints at runtime

**Response Format:**
```json
{
  "count": 42,
  "routes": [
    {
      "name": "user.create",
      "description": "Create a new user account",
      "method": "POST",
      "path": "/api/v1/users",
      "input": {
        "type": "object",
        "properties": {
          "email": { "type": "string", "format": "email" },
          "password": { "type": "string", "minLength": 8 },
          "firstName": { "type": "string" },
          "lastName": { "type": "string" }
        },
        "required": ["email", "password"]
      },
      "output": {
        "type": "object",
        "properties": {
          "userId": { "type": "string", "format": "uuid" },
          "email": { "type": "string" },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      }
    },
    {
      "name": "user.get",
      "description": "Retrieve user by ID",
      "method": "GET",
      "path": "/api/v1/users/:id",
      "input": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "description": "User ID" }
        },
        "required": ["id"]
      },
      "output": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "email": { "type": "string" },
          "firstName": { "type": "string" },
          "lastName": { "type": "string" },
          "createdAt": { "type": "string" },
          "updatedAt": { "type": "string" }
        }
      }
    }
    // ... more routes
  ]
}
```

---

## **4. STANDARD REST ENDPOINT PATTERNS**

### **CRUD Operations**

| Operation | Method | Path                     | Purpose                          |
|-----------|--------|--------------------------|----------------------------------|
| **Create** | POST   | `/api/v1/{resource}`     | Create new resource              |
| **Read**   | GET    | `/api/v1/{resource}/:id` | Get single resource              |
| **List**   | GET    | `/api/v1/{resource}`     | List resources (with filters)    |
| **Update** | PUT    | `/api/v1/{resource}/:id` | Replace entire resource          |
| **Patch**  | PATCH  | `/api/v1/{resource}/:id` | Partial update                   |
| **Delete** | DELETE | `/api/v1/{resource}/:id` | Delete resource                  |

### **Example: User Resource**

```
POST   /api/v1/users              → user.create
GET    /api/v1/users              → user.list
GET    /api/v1/users/:id          → user.get
PUT    /api/v1/users/:id          → user.update
PATCH  /api/v1/users/:id          → user.patch
DELETE /api/v1/users/:id          → user.delete
```

### **Nested Resources**

```
POST   /api/v1/users/:userId/posts              → post.create
GET    /api/v1/users/:userId/posts              → post.listByUser
GET    /api/v1/users/:userId/posts/:postId      → post.get
DELETE /api/v1/users/:userId/posts/:postId      → post.delete
```

---

## **5. REQUEST/RESPONSE FLOW**

### **A. Request Processing Pipeline**

```
HTTP Request
    ↓
Route Matching (method + path)
    ↓
Global Middleware (helmet, cors, logging)
    ↓
Action-Specific Middleware (from rest.middleware)
    ↓
Parameter Aggregation (path + query + body)
    ↓
Context Creation (headers, correlation ID, deadline)
    ↓
Input Validation (Zod schema)
    ↓
Handler Execution
    ↓
Output Validation (Zod schema)
    ↓
HTTP Response (200 + JSON)
```

### **B. Error Handling**

| Error Type | HTTP Status | Response |
|-----------|------------|----------|
| Validation Error (Zod) | 400 | `{ error: "Validation Error", details: [...] }` |
| Not Found | 404 | `{ error: "Not Found", message: "Route not found" }` |
| Auth Required | 401 | `{ error: "Unauthorized", message: "..." }` |
| Permission Denied | 403 | `{ error: "Forbidden", message: "..." }` |
| Business Logic Error | 400/409 | `{ error: "Error", message: "..." }` |
| Internal Error | 500 | `{ error: "Internal Server Error", message: "..." }` |

---

## **6. CONTEXT & REQUEST METADATA**

Each action receives a **Context** object containing:

```typescript
{
  // Input
  params: TParams;                      // Validated input parameters
  headers: Record<string, string>;      // HTTP headers
  query: Record<string, string>;        // Query parameters (parsed separately)

  // Request Identity
  requestId: string;                    // Unique request ID (e.g., "ctx-123")
  correlationId: string;                // Distributed tracing ID (from X-Correlation-ID header)

  // Execution Control
  signal: AbortSignal;                  // Cancellation signal
  deadline: Date;                       // Request timeout deadline

  // Data Propagation
  metadata: Record<string, any>;        // Custom metadata

  // Actions
  call<TParams, TResponse>(
    action: string,
    params: TParams
  ): Promise<TResponse>;                // Call another action

  emit(event: string, data: any):
    Promise<void>;                      // Emit an event

  log(message: string, ...args):
    void;                               // Log message
}
```

---

## **7. ADVANCED FEATURES**

### **A. Action Dependencies**

An action can declare dependencies on other actions:

```typescript
{
  name: "user.sendWelcomeEmail",
  dependencies: ["email.send", "template.render"],
  handler: async (ctx) => {
    // ServiceManager ensures dependencies are available
    const rendered = await ctx.call("template.render", {
      template: "welcome",
      user: ctx.params
    });
    
    return await ctx.call("email.send", {
      to: ctx.params.email,
      subject: "Welcome!",
      html: rendered
    });
  }
}
```

### **B. Middleware Integration**

Named middleware can be applied per action:

```typescript
{
  name: "admin.deleteUser",
  rest: {
    method: "DELETE",
    path: "/api/v1/users/:id",
    middleware: ["requireAuth", "requireRole:admin", "logAudit"]
  },
  handler: async (ctx) => {
    // Middleware has already verified permissions
    return { success: true };
  }
}
```

### **C. Authorization Config**

```typescript
{
  name: "admin.deleteUser",
  auth: {
    required: true,
    roles: ["admin"],
    permissions: ["user.delete"],
    scopes: ["write:user"]
  },
  handler: async (ctx) => {
    // ...
  }
}
```

### **D. Event Emission & Handling**

**Action that emits events:**
```typescript
{
  name: "user.create",
  handler: async (ctx) => {
    const newUser = { id: "123", email: ctx.params.email };
    // Emit event after user creation
    await ctx.emit("user.created", { userId: newUser.id });
    return newUser;
  }
}
```

**Action that listens to events:**
```typescript
{
  name: "notification.sendWelcome",
  events: [
    {
      name: "user.created",
      handler: async (ctx) => {
        console.log("New user created:", ctx.params);
        // Send welcome email, etc.
      }
    }
  ],
  handler: async (ctx) => { return {}; }
}
```

### **E. Scheduled Tasks (Cron)**

```typescript
{
  name: "report.daily",
  crons: [
    {
      name: "daily-report",
      schedule: "0 9 * * *",        // 9 AM daily
      timezone: "America/New_York",
      runOnStart: false,
      handler: async (ctx) => {
        // Generate and send daily report
      }
    }
  ],
  handler: async (ctx) => { return {}; }
}
```

---

## **8. ACTION DISCOVERY FOR LLM**

The Adapter class bridges actions to LLM/AI models:

### **Action Conversion to LLM Tools**

ServiceActions are converted to OpenAI-compatible tool definitions:

```json
{
  "type": "function",
  "function": {
    "name": "user_create",
    "description": "Create a new user account",
    "parameters": {
      "type": "object",
      "properties": {
        "email": { "type": "string", "format": "email" },
        "password": { "type": "string", "minLength": 8 },
        "firstName": { "type": "string" },
        "lastName": { "type": "string" }
      },
      "required": ["email", "password"]
    }
  }
}
```

### **LLM → Action Call Flow**

1. LLM sees available actions/tools
2. LLM decides to call an action: `{"type": "function_call", "function": {"name": "user_create", "arguments": "{...}"}}`
3. Adapter routes to ServiceManager
4. ServiceManager calls the action with validated params
5. Result returned to LLM

---

## **9. REGISTRATION & DISCOVERY PATTERNS**

### **A. Manual Registration**

```typescript
const action: ServiceAction = {
  name: "user.create",
  version: 1,
  description: "Create a new user",
  tags: ["user", "create"],
  input: z.object({ email: z.string().email() }),
  output: z.object({ userId: z.string() }),
  rest: {
    method: "POST",
    path: "/api/v1/users"
  },
  handler: async (ctx) => { /* ... */ }
};

serviceManager.register(action);
```

### **B. Bulk Registration from Directory**

```typescript
// Automatically discover and register all ServiceActions in a directory
await serviceManager.registerServiceActions("./actions");
```

### **C. Query Patterns**

```typescript
// Get by name
serviceManager.get("user.create");

// Get by domain
serviceManager.getByDomain("user");

// Get by tag
serviceManager.getByTag("admin");

// Get all
serviceManager.getAll();

// Check existence
serviceManager.has("user.create", 1);
```

---

## **10. VERSIONING STRATEGY**

Actions support semantic versioning for evolution:

```typescript
// Version 1 (original)
const userCreateV1: ServiceAction = {
  name: "user.create",
  version: 1,
  input: z.object({ email: z.string(), password: z.string() }),
  handler: async (ctx) => { /* ... */ }
};

// Version 2 (added firstName/lastName)
const userCreateV2: ServiceAction = {
  name: "user.create",
  version: 2,
  input: z.object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
  }),
  handler: async (ctx) => { /* ... */ }
};

serviceManager.register(userCreateV1);
serviceManager.register(userCreateV2);

// Call specific version
await serviceManager.call("user.create@1", params);
await serviceManager.call("user.create@2", params);

// Call latest (defaults to v2)
await serviceManager.call("user.create", params);
```

---

## **11. EXAMPLE ENDPOINT SPECIFICATIONS**

### **Example 1: User Management**

```yaml
UserCreate:
  name: user.create
  method: POST
  path: /api/v1/users
  input:
    email: string (email format, required)
    password: string (min 8 chars, required)
    firstName: string
    lastName: string
  output:
    userId: string (uuid)
    email: string
    createdAt: ISO 8601 datetime
  tags: [user, create, public]
  auth: none

UserGet:
  name: user.get
  method: GET
  path: /api/v1/users/:id
  input:
    id: string (uuid, path param, required)
  output:
    id: string
    email: string
    firstName: string
    lastName: string
    createdAt: ISO 8601 datetime
  tags: [user, read, public]
  auth: none

UserUpdate:
  name: user.update
  method: PATCH
  path: /api/v1/users/:id
  input:
    id: string (path param, required)
    firstName: string
    lastName: string
    email: string
  output:
    id: string
    email: string
    firstName: string
    lastName: string
    updatedAt: ISO 8601 datetime
  tags: [user, update]
  auth: required, scopes: [write:user]

UserDelete:
  name: user.delete
  method: DELETE
  path: /api/v1/users/:id
  input:
    id: string (path param, required)
  output:
    success: boolean
    message: string
  tags: [user, delete]
  auth: required, roles: [admin]
```

### **Example 2: AI Action**

```yaml
AIProcessText:
  name: ai.processText
  method: POST
  path: /api/v1/ai/process
  input:
    text: string (required)
    model: string (enum: ["claude-3-opus", "gpt-4"])
    temperature: number (0-2, default: 0.7)
    maxTokens: number (1-4096)
  output:
    processed: string
    tokens:
      input: number
      output: number
      total: number
    model: string
  tags: [ai, llm]
  auth: required, scopes: [use:ai]
  events:
    - name: ai.processed
      data: { model, tokenCount }
```

---

## **12. CLIENT USAGE PATTERNS**

### **A. REST Client (cURL)**

```bash
# Create user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: abc-123" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Get user
curl -X GET http://localhost:3000/api/v1/users/123 \
  -H "X-Correlation-ID: abc-123"

# List users with filters
curl -X GET "http://localhost:3000/api/v1/users?limit=10&offset=0&status=active"

# Update user
curl -X PATCH http://localhost:3000/api/v1/users/123 \
  -H "Content-Type: application/json" \
  -d '{ "firstName": "Jane" }'

# Delete user
curl -X DELETE http://localhost:3000/api/v1/users/123
```

### **B. HttpClient (TypeScript)**

```typescript
const client = new HttpClient("http://localhost:3000");
await client.load(); // Load meta routes

const newUser = await client.call("user.create", {
  email: "user@example.com",
  password: "SecurePass123",
  firstName: "John",
  lastName: "Doe"
});

const user = await client.call("user.get", { id: newUser.userId });
```

### **C. ServiceManager (Direct)**

```typescript
const result = await serviceManager.call("user.create", {
  email: "user@example.com",
  password: "SecurePass123"
});
```

### **D. LLM Integration (Adapter)**

```typescript
const adapter = new Adapter(serviceManager);

const response = await adapter.prompt({
  model: "gpt-4",
  messages: [
    { role: "user", content: "Create a new user with email test@example.com" }
  ],
  actions: serviceManager.getAll(),
  systemPrompt: "You are a helpful assistant..."
});

// LLM can now see all actions and invoke them autonomously
```

---

## **13. DISCOVERY & INTROSPECTION API**

### **List All Actions**
```
GET /api/v1/_meta/routes
```

### **List Actions by Domain**
```
GET /api/v1/_meta/routes?domain=user
```

### **List Actions by Tag**
```
GET /api/v1/_meta/routes?tag=create
```

### **Get Action Details**
```
GET /api/v1/_meta/action/user.create
```