/**
 * Demo file tree data for the VFS.
 * Extracted from FileTreeExtension so it can be used by IDE.ts to initialize the worker.
 */

import { VirtualFolder } from './WorkerFileSystemProvider';

export const DEMO_FILES: VirtualFolder = {
    name: 'my-project',
    type: 'folder',
    expanded: true,
    children: [
        {
            name: 'src',
            type: 'folder',
            expanded: true,
            children: [
                {
                    name: 'index.ts',
                    type: 'file',
                    language: 'typescript',
                    content: `import { App } from './app';\n\nconst app = new App();\napp.start();\n\nconsole.log('Application started successfully!');\n`
                },
                {
                    name: 'app.ts',
                    type: 'file',
                    language: 'typescript',
                    content: `export class App {\n    private name: string;\n\n    constructor() {\n        this.name = 'My Application';\n    }\n\n    public start(): void {\n        console.log(\`Starting \${this.name}...\`);\n        this.initialize();\n    }\n\n    private initialize(): void {\n        // Setup event listeners\n        document.addEventListener('DOMContentLoaded', () => {\n            this.render();\n        });\n    }\n\n    private render(): void {\n        const root = document.getElementById('root');\n        if (root) {\n            root.innerHTML = '<h1>Hello World</h1>';\n        }\n    }\n}\n`
                },
                {
                    name: 'utils.ts',
                    type: 'file',
                    language: 'typescript',
                    content: `/**\n * Utility functions\n */\n\nexport function debounce<T extends (...args: any[]) => void>(\n    fn: T,\n    delay: number\n): (...args: Parameters<T>) => void {\n    let timer: ReturnType<typeof setTimeout>;\n    return (...args) => {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn(...args), delay);\n    };\n}\n\nexport function formatDate(date: Date): string {\n    return date.toISOString().split('T')[0];\n}\n\nexport function clamp(value: number, min: number, max: number): number {\n    return Math.min(Math.max(value, min), max);\n}\n`
                },
                {
                    name: 'styles',
                    type: 'folder',
                    children: [
                        {
                            name: 'main.css',
                            type: 'file',
                            language: 'css',
                            content: `:root {\n    --primary: #007acc;\n    --bg: #1e1e1e;\n    --text: #d4d4d4;\n}\n\nbody {\n    margin: 0;\n    padding: 0;\n    background-color: var(--bg);\n    color: var(--text);\n    font-family: 'Segoe UI', sans-serif;\n}\n\n#root {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    min-height: 100vh;\n}\n`
                        },
                        {
                            name: 'theme.css',
                            type: 'file',
                            language: 'css',
                            content: `/* Dark Theme Variables */\n.dark-theme {\n    --bg-primary: #1e1e1e;\n    --bg-secondary: #252526;\n    --accent: #007acc;\n    --text-primary: #ffffff;\n    --text-secondary: #cccccc;\n}\n`
                        }
                    ]
                }
            ]
        },
        {
            name: 'package.json',
            type: 'file',
            language: 'json',
            content: `{\n  "name": "my-project",\n  "version": "1.0.0",\n  "description": "A sample project",\n  "main": "dist/index.js",\n  "scripts": {\n    "build": "tsc",\n    "start": "node dist/index.js",\n    "dev": "ts-node src/index.ts"\n  },\n  "dependencies": {},\n  "devDependencies": {\n    "typescript": "^5.0.0"\n  }\n}\n`
        },
        {
            name: 'tsconfig.json',
            type: 'file',
            language: 'json',
            content: `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "commonjs",\n    "strict": true,\n    "outDir": "./dist",\n    "rootDir": "./src"\n  },\n  "include": ["src/**/*"]\n}\n`
        },
        {
            name: 'README.md',
            type: 'file',
            language: 'markdown',
            content: `# My Project\n\nA sample TypeScript project for demonstrating the IDE.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run build\nnpm start\n\`\`\`\n\n## Features\n\n- TypeScript support\n- Modern build tooling\n- Hot module replacement\n`
        },
        {
            name: 'index.html',
            type: 'file',
            language: 'html',
            content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My Project</title>\n    <link rel="stylesheet" href="styles/main.css">\n</head>\n<body>\n    <div id="root"></div>\n    <script src="dist/index.js"></script>\n</body>\n</html>\n`
        }
    ]
};
