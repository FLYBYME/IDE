import { ServiceAction } from 'tool-ms';
import { z } from 'zod';

const startTime = Date.now();

// ── meta.healthCheck ─────────────────────────────────
export const healthCheckAction: ServiceAction = {
    name: 'meta.healthCheck',
    version: 1,
    description: 'Server health and status',
    domain: 'meta',
    tags: ['meta', 'health'],
    rest: { method: 'GET', path: '/_meta/health' },
    auth: { required: false },
    input: z.object({}),
    output: z.object({
        status: z.enum(['healthy', 'degraded', 'down']),
        timestamp: z.string(),
        uptime: z.number(),
        version: z.string(),
        services: z.object({
            database: z.boolean().optional().nullable(),
            cache: z.boolean().optional().nullable(),
            fileStorage: z.boolean().optional().nullable(),
            aiModels: z.boolean().optional().nullable(),
        }),
    }),
    handler: async () => {
        return {
            status: 'healthy' as const,
            timestamp: new Date().toISOString(),
            uptime: Math.floor((Date.now() - startTime) / 1000),
            version: '1.0.0',
            services: {
                database: false,
                cache: false,
                fileStorage: true,
                aiModels: false,
            },
        };
    },
};

// ── meta.getCapabilities ─────────────────────────────
export const getCapabilitiesAction: ServiceAction = {
    name: 'meta.getCapabilities',
    version: 1,
    description: 'Get IDE capabilities and feature list',
    domain: 'meta',
    tags: ['meta', 'capabilities'],
    rest: { method: 'GET', path: '/_meta/capabilities' },
    input: z.object({}),
    output: z.object({
        features: z.object({
            collab: z.boolean(),
            ai: z.boolean(),
            linting: z.boolean(),
            formatting: z.boolean(),
            terminal: z.boolean(),
            git: z.boolean(),
        }),
        limits: z.object({
            maxWorkspaces: z.number(),
            maxFileSize: z.number(),
            maxProjectSize: z.number(),
        }),
        supportedLanguages: z.array(z.string()),
        supportedFormatters: z.array(z.string()),
        supportedLinters: z.array(z.string()),
    }),
    handler: async () => {
        return {
            features: {
                collab: false,
                ai: true,
                linting: false,
                formatting: false,
                terminal: false,
                git: true,
            },
            limits: {
                maxWorkspaces: 50,
                maxFileSize: 10 * 1024 * 1024, // 10MB
                maxProjectSize: 500 * 1024 * 1024, // 500MB
            },
            supportedLanguages: ['typescript', 'javascript', 'json', 'text'],
            supportedFormatters: ['prettier'],
            supportedLinters: ['eslint'],
        };
    },
};

export default [healthCheckAction, getCapabilitiesAction];
