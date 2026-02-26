import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import * as crypto from 'crypto';
import {
    SecretSetInput,
    SecretListInput,
    SecretDeleteInput,
    SecretOutput,
    SuccessOutput,
} from '../../models/schemas';

import { prisma } from '../../core/prisma';
import { gatewayManager } from '../../core/gateway-manager';
import { config } from '../../config';

// ── Encryption Utilities ─────────────────────────────

// We need a stable encryption key. In a real production app this should come from process.env, 
// but for the sake of this prompt, we'll derive it from the JWT secret explicitly to safely store it.
// Ensure it's exactly 32 bytes for aes-256-cbc.
const ENCRYPTION_KEY = crypto.scryptSync(config.jwt?.secret || 'default_secret', 'salt', 32);
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts a plaintext string into a hex string with a random IV prepended.
 */
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Return "iv:encrypted" so we can decipher it later
    return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts a hex string (formatted as "iv:encrypted") back into plaintext.
 */
export function decrypt(text: string): string {
    const parts = text.split(':');
    if (parts.length !== 2) throw new Error('Invalid encrypted format');

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// ── Service Actions ──────────────────────────────────

export const setSecretAction: ServiceAction = {
    name: 'secrets.set',
    version: 1,
    description: 'Set an environment variable secret for a workspace',
    domain: 'secrets',
    tags: ['secrets', 'environment', 'set'],
    rest: { method: 'POST', path: '/workspaces/:workspaceId/secrets', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SecretSetInput,
    output: SecretOutput,
    handler: async (ctx) => {
        const { workspaceId, key, value } = ctx.params as z.infer<typeof SecretSetInput>;
        const userId = ctx.headers['x-user-id'] as string;

        // Verify Workspace Ownership
        const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
        if (!ws) throw new Error('Workspace not found');
        if (ws.ownerId !== userId) throw new Error('Unauthorized');

        // Upsert Secret (encrypted)
        const encryptedValue = encrypt(value);

        const secret = await prisma.workspaceSecret.upsert({
            where: {
                workspaceId_key: { workspaceId, key }
            },
            update: {
                value: encryptedValue
            },
            create: {
                workspaceId,
                key,
                value: encryptedValue
            }
        });

        // Broadcast restart requirement
        gatewayManager.broadcastFrame('system', 'notification', {
            type: 'info',
            message: `Secret ${key} has been saved. You must restart the workspace container for environment variables to take effect.`
        }, workspaceId);

        return {
            key: secret.key,
            updatedAt: secret.updatedAt.toISOString(),
        };
    }
};

export const listSecretsAction: ServiceAction = {
    name: 'secrets.list',
    version: 1,
    description: 'List workspace secrets',
    domain: 'secrets',
    tags: ['secrets', 'list'],
    rest: { method: 'GET', path: '/workspaces/:workspaceId/secrets', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SecretListInput,
    output: z.object({
        secrets: z.array(SecretOutput)
    }),
    handler: async (ctx) => {
        const { workspaceId } = ctx.params as z.infer<typeof SecretListInput>;
        const userId = ctx.headers['x-user-id'] as string;

        // Verify Workspace Ownership
        const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
        if (!ws) throw new Error('Workspace not found');
        if (ws.ownerId !== userId && !ws.isPublic) throw new Error('Unauthorized'); // Read-only access allowed for public w/o decrypted values

        const secrets = await prisma.workspaceSecret.findMany({
            where: { workspaceId },
            orderBy: { key: 'asc' }
        });

        return {
            secrets: secrets.map((s: any) => ({
                key: s.key,
                updatedAt: s.updatedAt.toISOString()
            }))
        };
    }
};

export const deleteSecretAction: ServiceAction = {
    name: 'secrets.delete',
    version: 1,
    description: 'Delete a workspace secret',
    domain: 'secrets',
    tags: ['secrets', 'delete'],
    rest: { method: 'DELETE', path: '/workspaces/:workspaceId/secrets/:key', middleware: ['requireAuth'] },
    auth: { required: true },
    input: SecretDeleteInput,
    output: SuccessOutput,
    handler: async (ctx) => {
        const { workspaceId, key } = ctx.params as z.infer<typeof SecretDeleteInput>;
        const userId = ctx.headers['x-user-id'] as string;

        // Verify Workspace Ownership
        const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
        if (!ws) throw new Error('Workspace not found');
        if (ws.ownerId !== userId) throw new Error('Unauthorized');

        try {
            await prisma.workspaceSecret.delete({
                where: {
                    workspaceId_key: { workspaceId, key }
                }
            });

            // Broadcast restart requirement
            gatewayManager.broadcastFrame('system', 'notification', {
                type: 'info',
                message: `Secret ${key} deleted. Restart the workspace to clear it from the environment.`
            }, workspaceId);

        } catch (e: any) {
            if (e.code === 'P2025') { // Prisma: Record not found
                throw new Error(`Secret ${key} not found.`);
            }
            throw e;
        }

        return { success: true };
    }
};

export default [
    setSecretAction,
    listSecretsAction,
    deleteSecretAction
];
