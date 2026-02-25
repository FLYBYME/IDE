import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import { LoginInput, RefreshInput, SuccessOutput } from '../../models/schemas';
import { hashPassword, verifyPassword } from '../../utils/password.helper';
import { signToken, verifyToken } from '../../utils/token.helper';
import { config } from '../../config';
import * as crypto from 'crypto';

// ── In-memory user store (replace with Prisma/DB in production) ──
interface UserRecord {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: string;
}

const users: Map<string, UserRecord> = new Map();
const revokedTokens: Set<string> = new Set();

// Seed a default user for development
(async () => {
    const hash = await hashPassword('admin123');
    const id = crypto.randomUUID();
    users.set('admin', {
        id,
        email: 'admin@canvas-llm.dev',
        username: 'admin',
        passwordHash: hash,
        createdAt: new Date().toISOString(),
    });
})();

// ── auth.login ───────────────────────────────────────
export const loginAction: ServiceAction = {
    name: 'auth.login',
    version: 1,
    description: 'Authenticate user and create session',
    domain: 'auth',
    tags: ['auth', 'login', 'public'],
    rest: { method: 'POST', path: '/auth/login' },
    input: LoginInput,
    output: z.object({
        success: z.boolean(),
        token: z.string(),
        user: z.object({
            id: z.string(),
            username: z.string(),
            email: z.string(),
            createdAt: z.string(),
        }),
        expiresIn: z.number().optional().nullable(),
    }),
    handler: async (ctx) => {
        const { username, password, rememberMe } = ctx.params as z.infer<typeof LoginInput>;
        const user = users.get(username);
        if (!user) throw new Error('Invalid credentials');

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) throw new Error('Invalid credentials');

        const expiresIn = rememberMe ? config.jwt.refreshExpiresIn : config.jwt.expiresIn;
        const token = signToken({ userId: user.id, email: user.email }, expiresIn);

        return {
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            expiresIn,
        };
    },
};

// ── auth.logout ──────────────────────────────────────
export const logoutAction: ServiceAction = {
    name: 'auth.logout',
    version: 1,
    description: 'Invalidate user session',
    domain: 'auth',
    tags: ['auth', 'logout'],
    rest: { method: 'POST', path: '/auth/logout', middleware: ['requireAuth'] },
    auth: { required: true },
    input: z.object({}),
    output: SuccessOutput,
    handler: async (ctx) => {
        // In a real system we'd revoke the token
        return { success: true, message: 'Logged out successfully' };
    },
};

// ── auth.getSession ──────────────────────────────────
export const getSessionAction: ServiceAction = {
    name: 'auth.getSession',
    version: 1,
    description: 'Get current session/user info',
    domain: 'auth',
    tags: ['auth', 'session'],
    rest: { method: 'GET', path: '/auth/session', middleware: ['requireAuth'] },
    auth: { required: true },
    input: z.object({}),
    output: z.object({
        user: z.object({
            id: z.string(),
            username: z.string(),
            email: z.string(),
        }),
        permissions: z.array(z.string()),
        tokenExpires: z.string(),
    }),
    handler: async (ctx) => {
        const userId = ctx.headers['x-user-id'];
        const email = ctx.headers['x-user-email'];

        // Find user
        let foundUser: UserRecord | undefined;
        for (const u of users.values()) {
            if (u.id === userId) { foundUser = u; break; }
        }
        if (!foundUser) throw new Error('User not found');

        return {
            user: {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
            },
            permissions: ['read', 'write'],
            tokenExpires: new Date(Date.now() + config.jwt.expiresIn * 1000).toISOString(),
        };
    },
};

// ── auth.refreshToken ────────────────────────────────
export const refreshTokenAction: ServiceAction = {
    name: 'auth.refreshToken',
    version: 1,
    description: 'Refresh expired session token',
    domain: 'auth',
    tags: ['auth', 'refresh'],
    rest: { method: 'POST', path: '/auth/refresh' },
    input: RefreshInput,
    output: z.object({
        token: z.string(),
        expiresIn: z.number(),
    }),
    handler: async (ctx) => {
        const { token: oldToken } = ctx.params as z.infer<typeof RefreshInput>;
        try {
            // Allow expired tokens for refresh — just verify signature
            const payload = verifyToken(oldToken, true);

            const newToken = signToken({ userId: payload.userId, email: payload.email });
            return {
                token: newToken,
                expiresIn: config.jwt.expiresIn,
            };
        } catch {
            throw new Error('Invalid refresh token');
        }
    },
};

export default [loginAction, logoutAction, getSessionAction, refreshTokenAction];
