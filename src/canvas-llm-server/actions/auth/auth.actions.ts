import { ServiceAction } from 'tool-ms';
import { z } from 'zod';
import {
    LoginInput, RefreshInput, SuccessOutput, RegisterInput,
    RegisterOutput, RequestPasswordResetInput, ResetPasswordInput,
    UpdatePasswordInput
} from '../../models/schemas';
import { hashPassword, verifyPassword } from '../../utils/password.helper';
import { signToken, verifyToken } from '../../utils/token.helper';
import { config } from '../../config';
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { prisma } from '../../core/prisma';

// ============================================================================
// I. PUBLIC ENDPOINTS
// ============================================================================

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

        // Check if the user is suspended
        if (!user.isActive) throw new Error('Account is suspended');

        // Update lastLogin timestamp
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        const expiresIn = rememberMe ? config.jwt.refreshExpiresIn : config.jwt.expiresIn;
        const token = signToken({ userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role }, expiresIn);

        return {
            success: true,
            token,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive,
                lastLogin: updatedUser.lastLogin?.toISOString(),
                bio: updatedUser.bio,
                createdAt: updatedUser.createdAt.toISOString(),
            },
            expiresIn,
        };
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

        const token = signToken({ userId: user.id, email: user.email, role: user.role });

        return {
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin?.toISOString(),
                bio: user.bio,
                createdAt: user.createdAt.toISOString(),
            },
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

            const newToken = signToken({ userId: payload.userId, email: payload.email, role: payload.role });
            return {
                token: newToken,
                expiresIn: config.jwt.expiresIn,
            };
        } catch {
            throw new Error('Invalid refresh token');
        }
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

// ============================================================================
// II. PROTECTED ENDPOINTS (Requires USER or ADMIN Role)
// ============================================================================

// ── auth.getSession ──────────────────────────────────
export const getSessionAction: ServiceAction = {
    name: 'auth.getSession',
    version: 1,
    description: 'Get current session/user info',
    domain: 'auth',
    tags: ['auth', 'session'],
    rest: { method: 'GET', path: '/auth/session' },
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
        const userId = ctx.metadata.user.id;

        const foundUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!foundUser) throw new Error('User not found');

        return {
            user: {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
                role: foundUser.role,
                isActive: foundUser.isActive,
                lastLogin: foundUser.lastLogin?.toISOString(),
                bio: foundUser.bio,
                createdAt: foundUser.createdAt.toISOString(),
            },
            permissions: foundUser.role === 'ADMIN' ? ['read', 'write', 'admin'] : ['read', 'write'],
            tokenExpires: new Date(Date.now() + config.jwt.expiresIn * 1000).toISOString(),
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
    rest: { method: 'POST', path: '/auth/logout' },
    auth: { required: true },
    input: z.object({}),
    output: SuccessOutput,
    handler: async (ctx) => {
        return { success: true, message: 'Logged out successfully' };
    },
};

// ── auth.updatePassword ──────────────────────────────
export const updatePasswordAction: ServiceAction = {
    name: 'auth.updatePassword',
    version: 1,
    description: 'Update password for authenticated user',
    domain: 'auth',
    tags: ['auth', 'password'],
    rest: { method: 'POST', path: '/auth/update-password' },
    auth: { required: true },
    input: UpdatePasswordInput,
    output: SuccessOutput,
    handler: async (ctx) => {
        const { currentPassword, newPassword } = ctx.params as z.infer<typeof UpdatePasswordInput>;
        const userId = ctx.metadata.user.id;

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

// ── auth.updateProfile ───────────────────────────────
export const updateProfileAction: ServiceAction = {
    name: 'auth.updateProfile',
    version: 1,
    description: 'Update the authenticated user profile information',
    domain: 'auth',
    tags: ['auth', 'profile'],
    rest: { method: 'PATCH', path: '/auth/profile' },
    auth: { required: true },
    input: z.object({
        username: z.string().min(3).max(50).optional(),
        email: z.string().email().optional(),
        bio: z.string().optional().nullable()
    }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { username, email, bio } = ctx.params as { username?: string, email?: string, bio?: string | null };
        const userId = ctx.metadata.user.id;

        if (username) {
            const existing = await prisma.user.findUnique({ where: { username } });
            if (existing && existing.id !== userId) throw new Error('Username already taken');
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                ...(username && { username }),
                ...(email && { email }),
                ...(bio !== undefined && { bio })
            }
        });

        return { success: true, message: 'Profile updated successfully' };
    }
};

// ============================================================================
// III. ADMIN ENDPOINTS (Requires ADMIN Role)
// ============================================================================

// ── admin.listUsers ──────────────────────────────────
export const adminListUsersAction: ServiceAction = {
    name: 'admin.listUsers',
    version: 1,
    description: 'List all users with filtering and pagination',
    domain: 'admin',
    tags: ['admin', 'users'],
    rest: { method: 'GET', path: '/admin/users' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({
        limit: z.coerce.number().optional().default(20),
        offset: z.coerce.number().optional().default(0),
        role: z.string().optional(),
        search: z.string().optional()
    }),
    output: z.object({
        total: z.number(),
        users: z.array(z.any())
    }),
    handler: async (ctx) => {
        const { limit, offset, role, search } = ctx.params as { limit: number, offset: number, role?: string, search?: string };

        const whereClause: any = {};
        if (role) whereClause.role = role;
        if (search) {
            whereClause.OR = [
                { username: { contains: search } },
                { email: { contains: search } }
            ];
        }

        const [total, users] = await prisma.$transaction([
            prisma.user.count({ where: whereClause }),
            prisma.user.findMany({
                where: whereClause,
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                select: { id: true, username: true, email: true, role: true, isActive: true, lastLogin: true, createdAt: true }
            })
        ]);

        return { total, users };
    }
};

// ── admin.getUser ────────────────────────────────────
export const adminGetUserAction: ServiceAction = {
    name: 'admin.getUser',
    version: 1,
    description: 'Retrieve detailed information for a specific user',
    domain: 'admin',
    tags: ['admin', 'users'],
    rest: { method: 'GET', path: '/admin/users/:id' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({ id: z.string().uuid() }),
    output: z.any(),
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                workspaces: true,
                extensions: true
            }
        });

        if (!user) throw new Error('User not found');

        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
};

// ── admin.toggleStatus ───────────────────────────────
export const adminToggleStatusAction: ServiceAction = {
    name: 'admin.toggleStatus',
    version: 1,
    description: 'Suspend or unban a user',
    domain: 'admin',
    tags: ['admin', 'users', 'status'],
    rest: { method: 'PATCH', path: '/admin/users/:id/status' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({
        id: z.string().uuid(),
        isActive: z.boolean()
    }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id, isActive } = ctx.params as { id: string, isActive: boolean };

        await prisma.user.update({
            where: { id },
            data: { isActive }
        });

        return { success: true, message: `User status updated to ${isActive ? 'Active' : 'Suspended'}` };
    }
};

// ── admin.changeRole ─────────────────────────────────
export const adminChangeRoleAction: ServiceAction = {
    name: 'admin.changeRole',
    version: 1,
    description: 'Change a user permission level',
    domain: 'admin',
    tags: ['admin', 'users', 'role'],
    rest: { method: 'PATCH', path: '/admin/users/:id/role' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({
        id: z.string().uuid(),
        role: z.enum(['USER', 'ADMIN'])
    }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id, role } = ctx.params as { id: string, role: string };

        await prisma.user.update({
            where: { id },
            data: { role }
        });

        return { success: true, message: `User role updated to ${role}` };
    }
};

// ── admin.forceResetPassword ─────────────────────────
export const adminForceResetPasswordAction: ServiceAction = {
    name: 'admin.forceResetPassword',
    version: 1,
    description: 'Admin-initiated password reset generating a temporary password',
    domain: 'admin',
    tags: ['admin', 'users', 'password'],
    rest: { method: 'POST', path: '/admin/users/:id/force-reset' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({ id: z.string().uuid() }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
        tempPassword: z.string()
    }),
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) throw new Error('User not found');

        const tempPassword = crypto.randomBytes(8).toString('hex');
        const passwordHash = await hashPassword(tempPassword);

        await prisma.user.update({
            where: { id },
            data: { passwordHash }
        });

        return {
            success: true,
            message: 'Password forcefully reset.',
            tempPassword
        };
    }
};

// ── admin.deleteUser ─────────────────────────────────
export const adminDeleteUserAction: ServiceAction = {
    name: 'admin.deleteUser',
    version: 1,
    description: 'Permanently delete a user account and associated data',
    domain: 'admin',
    tags: ['admin', 'users', 'delete'],
    rest: { method: 'DELETE', path: '/admin/users/:id' },
    auth: { required: true, roles: ['ADMIN'] },
    input: z.object({ id: z.string().uuid() }),
    output: SuccessOutput,
    handler: async (ctx) => {
        const { id } = ctx.params as { id: string };

        await prisma.user.delete({
            where: { id }
        });

        return { success: true, message: 'User deleted successfully' };
    }
};

export default [
    loginAction,
    logoutAction,
    getSessionAction,
    refreshTokenAction,
    registerAction,
    requestPasswordResetAction,
    resetPasswordAction,
    updatePasswordAction,
    updateProfileAction,
    adminListUsersAction,
    adminGetUserAction,
    adminToggleStatusAction,
    adminChangeRoleAction,
    adminForceResetPasswordAction,
    adminDeleteUserAction
];