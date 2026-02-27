// ============================================================================
// FILE: integration/extensions.test.ts
// PATH: IDE/tests/integration/extensions.test.ts
// ============================================================================

import { TestHarness } from '../helpers/test-harness';
import { prisma } from '../../src/canvas-llm-server/core/prisma';
import { jest } from '@jest/globals';
import extensionsActions from '../../src/canvas-llm-server/actions/extension/extension.actions';

// Mock the builder service and file system to avoid real builds and file operations during tests
jest.mock('../../src/canvas-llm-server/services/ExtensionBuilderService', () => ({
    extensionBuilderService: {
        build: jest.fn().mockImplementation(async () => undefined)
    }
}));

jest.mock('fs/promises', () => ({
    readFile: jest.fn().mockImplementation(async () => JSON.stringify({ name: 'test-extension', version: '1.0.0' })),
    rm: jest.fn().mockImplementation(async () => undefined)
}));

describe('Extensions API', () => {
    const userId = '55555555-5555-5555-5555-555555555555';
    // Using a dedicated port to avoid conflicts with other test suites
    const harness = new TestHarness(3021, extensionsActions);
    let extensionId: string;
    let versionId: string;

    beforeAll(async () => {
        // Setup user with 'ADMIN' role to allow testing both USER and ADMIN endpoints
        await harness.setup(userId, 'test-extensions@example.com', 'ADMIN');

        // Clean up any existing extension data to ensure a clean slate
        await prisma.userExtension.deleteMany({ where: { userId } });
        await prisma.extensionVersion.deleteMany({});
        await prisma.extension.deleteMany({});
    });

    afterAll(() => harness.teardown());

    describe('Marketplace & Discovery', () => {
        it('should list dummy extensions when database is empty', async () => {
            const result = await harness.client.call('extensions.list', {});
            expect(result.extensions.length).toBeGreaterThan(0);
            expect(result.extensions[0].id).toBe('ext-dummy-1');
            expect(result.extensions[0].name).toBe('Python Support');
        });
    });

    describe('Developer Operations', () => {
        it('should submit a new extension for building', async () => {
            const result = await harness.client.call('extensions.submit', {
                gitUrl: 'https://github.com/test/test-extension.git',
                gitBranch: 'main',
                manifestPath: '/package.json'
            });

            expect(result).toHaveProperty('buildId');
            versionId = result.buildId;

            // Fetch the created extension ID from DB to use in subsequent tests
            const version = await prisma.extensionVersion.findUnique({
                where: { id: versionId },
                include: { extension: true }
            });
            expect(version).toBeDefined();
            extensionId = version!.extensionId;
            expect(version!.extension.name).toBe('test-extension');
        });

        it('should retrieve the build status', async () => {
            const result = await harness.client.call('extensions.getBuildStatus', {
                buildId: versionId
            });
            expect(result.id).toBe(versionId);
            expect(result.status).toBe('CLONING');
            expect(result.extensionId).toBe(extensionId);
        });

        it('should update extension metadata', async () => {
            const result = await harness.client.call('extensions.update', {
                id: extensionId,
                description: 'Updated test description'
            });
            expect(result.success).toBe(true);

            const ext = await prisma.extension.findUnique({ where: { id: extensionId } });
            expect(ext?.description).toBe('Updated test description');
        });
    });

    describe('User Installation & Management', () => {
        it('should install an extension version for the user', async () => {
            const result = await harness.client.call('extensions.install', {
                versionId
            });
            expect(result.success).toBe(true);

            const userExt = await prisma.userExtension.findUnique({
                where: { userId_extensionId: { userId, extensionId } }
            });
            expect(userExt).toBeDefined();
            expect(userExt?.active).toBe(true);
            expect(userExt?.installedVersionId).toBe(versionId);
        });

        it('should safely disable the installed extension', async () => {
            const result = await harness.client.call('extensions.toggle', {
                id: extensionId,
                enabled: false
            });
            expect(result.success).toBe(true);

            const userExt = await prisma.userExtension.findUnique({
                where: { userId_extensionId: { userId, extensionId } }
            });
            expect(userExt?.active).toBe(false);
        });

        it('should uninstall the extension', async () => {
            const result = await harness.client.call('extensions.uninstall', {
                id: extensionId
            });
            expect(result.success).toBe(true);

            const userExt = await prisma.userExtension.findUnique({
                where: { userId_extensionId: { userId, extensionId } }
            });
            expect(userExt).toBeNull();
        });
    });

    describe('Admin Moderation', () => {
        it('should globally approve/activate an extension (Admin)', async () => {
            const result = await harness.client.call('admin.extensions.toggleStatus', {
                id: extensionId,
                isActive: true
            });
            expect(result.success).toBe(true);

            const ext = await prisma.extension.findUnique({ where: { id: extensionId } });
            expect(ext?.active).toBe(true);
        });

        it('should successfully search for the globally active extension', async () => {
            const result = await harness.client.call('extensions.search', {
                q: 'test-extension'
            });
            expect(result.extensions.some((e: any) => e.id === extensionId)).toBe(true);
        });

        it('should list all extension versions across the system (Admin)', async () => {
            const result = await harness.client.call('admin.extensions.listVersions', {});
            expect(result.versions.length).toBeGreaterThan(0);
            expect(result.versions.some((v: any) => v.id === versionId)).toBe(true);
        });

        it('should force-delete the extension and cascade versions (Admin)', async () => {
            const result = await harness.client.call('admin.extensions.delete', {
                id: extensionId
            });
            expect(result.success).toBe(true);

            // Verify the extension and its versions are wiped
            const ext = await prisma.extension.findUnique({ where: { id: extensionId } });
            expect(ext).toBeNull();

            const version = await prisma.extensionVersion.findUnique({ where: { id: versionId } });
            expect(version).toBeNull();
        });
    });
});