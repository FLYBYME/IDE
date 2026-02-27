import { TestHarness } from '../helpers/test-harness';
import authActions from '../../src/canvas-llm-server/actions/auth/auth.actions';
import { prisma } from '../../src/canvas-llm-server/core/prisma';
import { hashPassword } from '../../src/canvas-llm-server/utils/password.helper';
import jwt from 'jsonwebtoken';
import { config } from '../../src/canvas-llm-server/config';

describe('Auth & Admin API', () => {
    const userId = '33333333-3333-3333-3333-333333333333';
    const adminId = '44444444-4444-4444-4444-444444444444';
    const userEmail = 'test-user@example.com';
    const adminEmail = 'admin-user@example.com';

    const harness = new TestHarness(4020, authActions);
    const adminHarness = new TestHarness(4021, authActions);

    beforeAll(async () => {
        // Setup regular user harness
        await harness.setup(userId, userEmail, 'USER');

        // Setup admin harness
        // We need to manually ensure the admin user exists in DB with ADMIN role
        // The harness.setup handles user creation/cleanup
        await adminHarness.setup(adminId, adminEmail, 'ADMIN');
    });

    afterAll(async () => {
        await harness.teardown();
        await adminHarness.teardown();
    });

    describe('Public Endpoints', () => {
        const tempUsername = 'newuser';
        const tempEmail = 'newuser@example.com';
        const tempPassword = 'Password123!';

        it('should register a new user', async () => {
            // Ensure no leftover user
            await prisma.user.deleteMany({ where: { email: tempEmail } });

            const result = await harness.client.call('auth.register', {
                username: tempUsername,
                email: tempEmail,
                password: tempPassword
            });

            expect(result.success).toBe(true);
            expect(result.user.username).toBe(tempUsername);
            expect(result.user.email).toBe(tempEmail);
            expect(result.token).toBeDefined();

            // Cleanup
            await prisma.user.delete({ where: { email: tempEmail } });
        });

        it('should login an existing user', async () => {
            // First ensure user exists with known password
            const passwordHash = await hashPassword(tempPassword);
            await prisma.user.upsert({
                where: { email: tempEmail },
                update: { passwordHash, isActive: true },
                create: {
                    id: 'temp-login-id',
                    username: tempUsername,
                    email: tempEmail,
                    passwordHash,
                    role: 'USER',
                    isActive: true
                }
            });

            const result = await harness.client.call('auth.login', {
                username: tempUsername,
                password: tempPassword
            });

            expect(result.success).toBe(true);
            expect(result.token).toBeDefined();
            expect(result.user.username).toBe(tempUsername);
        });

        it('should fail login with invalid credentials', async () => {
            await expect(harness.client.call('auth.login', {
                username: tempUsername,
                password: 'wrongpassword'
            })).rejects.toThrow('Invalid credentials');
        });

        it('should refresh a token', async () => {
            const loginResult = await harness.client.call('auth.login', {
                username: tempUsername,
                password: tempPassword
            });

            const refreshResult = await harness.client.call('auth.refreshToken', {
                token: loginResult.token
            });

            expect(refreshResult.token).toBeDefined();
            expect(refreshResult.expiresIn).toBeDefined();
        });

        it('should flow through password reset request', async () => {
            const result = await harness.client.call('auth.requestPasswordReset', {
                email: tempEmail
            });

            expect(result.success).toBe(true);
            expect(result.message).toContain('reset token has been generated');
        });
    });

    describe('Protected Endpoints', () => {
        it('should get current session info', async () => {
            const result = await harness.client.call('auth.getSession', {});

            expect(result.user.id).toBe(userId);
            expect(result.user.email).toBe(userEmail);
            expect(result.permissions).toContain('read');
            expect(result.permissions).toContain('write');
        });

        it('should update user profile', async () => {
            const newBio = 'I am a test user';
            const result = await harness.client.call('auth.updateProfile', {
                bio: newBio
            });

            expect(result.success).toBe(true);

            const user = await prisma.user.findUnique({ where: { id: userId } });
            expect(user?.bio).toBe(newBio);
        });

        it('should update password', async () => {
            // Harness setup uses 'mock-hash' which is NOT valid for verifyPassword 
            // because it doesn't follow salt:hash format.
            // Let's set a real hash for the user.
            const currentPassword = 'CurrentPassword123!';
            const newPassword = 'NewPassword123!';
            const currentHash = await hashPassword(currentPassword);

            await prisma.user.update({
                where: { id: userId },
                data: { passwordHash: currentHash }
            });

            const result = await harness.client.call('auth.updatePassword', {
                currentPassword,
                newPassword
            });

            expect(result.success).toBe(true);

            // Verify we can login with new password
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const verifyResult = await import('../../src/canvas-llm-server/utils/password.helper').then(m => m.verifyPassword(newPassword, user!.passwordHash));
            expect(verifyResult).toBe(true);
        });

        it('should logout successfully', async () => {
            const result = await harness.client.call('auth.logout', {});
            expect(result.success).toBe(true);
        });
    });

    describe('Admin Endpoints', () => {
        it('should list users (admin only)', async () => {
            const result = await adminHarness.client.call('admin.listUsers', {
                limit: 10,
                offset: 0
            });

            expect(result.total).toBeGreaterThanOrEqual(2); // At least test user and admin
            expect(Array.isArray(result.users)).toBe(true);
        });

        it('should get specific user details', async () => {
            const result = await adminHarness.client.call('admin.getUser', {
                id: userId
            });

            expect(result.id).toBe(userId);
            expect(result.email).toBe(userEmail);
            expect(result.passwordHash).toBeUndefined(); // Sensitive data should be stripped
        });

        it('should toggle user status', async () => {
            // Suspend user
            await adminHarness.client.call('admin.toggleStatus', {
                id: userId,
                isActive: false
            });

            let user = await prisma.user.findUnique({ where: { id: userId } });
            expect(user?.isActive).toBe(false);

            // Unsuspend
            await adminHarness.client.call('admin.toggleStatus', {
                id: userId,
                isActive: true
            });

            user = await prisma.user.findUnique({ where: { id: userId } });
            expect(user?.isActive).toBe(true);
        });

        it('should change user role', async () => {
            await adminHarness.client.call('admin.changeRole', {
                id: userId,
                role: 'ADMIN'
            });

            let user = await prisma.user.findUnique({ where: { id: userId } });
            expect(user?.role).toBe('ADMIN');

            // Revert
            await adminHarness.client.call('admin.changeRole', {
                id: userId,
                role: 'USER'
            });

            user = await prisma.user.findUnique({ where: { id: userId } });
            expect(user?.role).toBe('USER');
        });

        it('should force reset password', async () => {
            const result = await adminHarness.client.call('admin.forceResetPassword', {
                id: userId
            });

            expect(result.success).toBe(true);
            expect(result.tempPassword).toBeDefined();

            // Verify user can login with temp password
            const loginResult = await harness.client.call('auth.login', {
                username: userEmail.split('@')[0],
                password: result.tempPassword
            });
            expect(loginResult.success).toBe(true);
        });

        it('should delete a user', async () => {
            const deleteUserId = '55555555-5555-5555-5555-555555555555';
            // Cleanup first
            await prisma.user.deleteMany({ where: { id: deleteUserId } });

            await prisma.user.create({
                data: {
                    id: deleteUserId,
                    username: 'delete-me',
                    email: 'delete-me@example.com',
                    passwordHash: 'dummy'
                }
            });

            const result = await adminHarness.client.call('admin.deleteUser', {
                id: deleteUserId
            });

            expect(result.success).toBe(true);
            const user = await prisma.user.findUnique({ where: { id: deleteUserId } });
            expect(user).toBeNull();
        });
    });
});
