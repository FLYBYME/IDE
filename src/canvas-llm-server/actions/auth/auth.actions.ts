import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import { LoginInput, RefreshInput, SuccessOutput, RegisterInput, RegisterOutput, RequestPasswordResetInput, ResetPasswordInput, UpdatePasswordInput } from '../../models/schemas';
import { hashPassword, verifyPassword } from '../../utils/password.helper';
import { signToken, verifyToken } from '../../utils/token.helper';
import { config } from '../../config';
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { prisma } from '../../core/prisma';

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
        const user = await prisma.user.findUnique({ where: { username } });
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
                createdAt: user.createdAt.toISOString(),
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

        const foundUser = await prisma.user.findUnique({ where: { id: userId } });
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

// ── auth.register ───────────────────────────────────
export const registerAction: ServiceAction = {
    name: 'auth.register',
    version: 1,
    description: 'Create new user account',
    domain: 'auth',
    tags: ['auth', 'register', 'public'],
    rest: { method: 'POST', path: '/auth/register' },
    input: RegisterInput,
    output: RegisterOutput,
    handler: async (ctx) => {
        const { username, email, password } = ctx.params as z.infer<typeof RegisterInput>;

        // Check if user already exists
        const existing = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        });
        if (existing) throw new Error('Username or email already exists');

        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            }
        });

        const token = signToken({ userId: user.id, email: user.email });

        return {
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            },
        };
    },
};

// ── auth.requestPasswordReset ────────────────────────
export const requestPasswordResetAction: ServiceAction = {
    name: 'auth.requestPasswordReset',
    version: 1,
    description: 'Request a password reset token via email',
    domain: 'auth',
    tags: ['auth', 'reset', 'public'],
    rest: { method: 'POST', path: '/auth/request-reset' },
    input: RequestPasswordResetInput,
    output: SuccessOutput,
    handler: async (ctx) => {
        const { email } = ctx.params as z.infer<typeof RequestPasswordResetInput>;
        const user = await prisma.user.findUnique({ where: { email } });

        // Don't leak user existence
        if (user) {
            // Secret Binding: Sign the token with a combination of the global secret and the user's current password hash.
            // This makes the token single-use because the hash changes after a successful reset.
            const secret = config.jwt.secret + user.passwordHash;
            const resetToken = jwt.sign(
                { userId: user.id, type: 'reset' },
                secret,
                { expiresIn: '1h' }
            );

            // In a real system, send email here. For now, we return it in message for testing or just log.
            console.log(`Password reset token for ${email}: ${resetToken}`);
        }

        return {
            success: true,
            message: 'If an account exists with that email, a reset token has been generated.'
        };
    },
};

// ── auth.resetPassword ───────────────────────────────
export const resetPasswordAction: ServiceAction = {
    name: 'auth.resetPassword',
    version: 1,
    description: 'Reset password using a token',
    domain: 'auth',
    tags: ['auth', 'reset', 'public'],
    rest: { method: 'POST', path: '/auth/reset-password' },
    input: ResetPasswordInput,
    output: SuccessOutput,
    handler: async (ctx) => {
        const { token, newPassword } = ctx.params as z.infer<typeof ResetPasswordInput>;

        try {
            // 1. Decode token to get userId without verification
            const decoded = jwt.decode(token) as any;
            if (!decoded || !decoded.userId || decoded.type !== 'reset') {
                throw new Error('Invalid token');
            }

            // 2. Fetch user to get their current passwordHash
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user) throw new Error('User not found');

            // 3. Verify token with Secret Binding (global secret + current passwordHash)
            const secret = config.jwt.secret + user.passwordHash;
            jwt.verify(token, secret);

            const passwordHash = await hashPassword(newPassword);
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash }
            });

            return { success: true, message: 'Password has been reset successfully.' };
        } catch (err) {
            console.error('Reset password error:', err);
            throw new Error('Invalid or expired reset token');
        }
    },
};

// ── auth.updatePassword ──────────────────────────────
export const updatePasswordAction: ServiceAction = {
    name: 'auth.updatePassword',
    version: 1,
    description: 'Update password for authenticated user',
    domain: 'auth',
    tags: ['auth', 'password'],
    rest: { method: 'POST', path: '/auth/update-password', middleware: ['requireAuth'] },
    auth: { required: true },
    input: UpdatePasswordInput,
    output: SuccessOutput,
    handler: async (ctx) => {
        const { currentPassword, newPassword } = ctx.params as z.infer<typeof UpdatePasswordInput>;
        const userId = ctx.headers['x-user-id'];

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const valid = await verifyPassword(currentPassword, user.passwordHash);
        if (!valid) throw new Error('Incorrect current password');

        const passwordHash = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash }
        });

        return { success: true, message: 'Password updated successfully' };
    },
};

export default [
    loginAction,
    logoutAction,
    getSessionAction,
    refreshTokenAction,
    registerAction,
    requestPasswordResetAction,
    resetPasswordAction,
    updatePasswordAction
];
