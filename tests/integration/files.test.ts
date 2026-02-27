import { TestHarness } from '../helpers/test-harness';
import filesActions from '../../src/canvas-llm-server/actions/files/files.actions';
import { createTestWorkspace } from '../helpers/factories';
import WebSocket from 'ws';

// Polyfill WebSocket for Node.js environment
global.WebSocket = WebSocket as any;

describe('Files API', () => {
    const userId = '33333333-3333-3333-3333-333333333333';
    const workspaceId = '44444444-4444-4444-4444-444444444444';
    const harness = new TestHarness(3018, filesActions);

    const testDirPath = '/test-dir';
    const testFilePath = `${testDirPath}/hello.ts`;
    const renamedFilePath = `${testDirPath}/hello-renamed.ts`;
    const copiedFilePath = `${testDirPath}/hello-copy.ts`;
    const initialContent = 'console.log("Hello, World!");';
    const updatedContent = 'console.log("Hello, Universe!");';

    beforeAll(async () => {
        await harness.setup(userId, 'test-files@example.com');
        await createTestWorkspace(workspaceId, 'Test Workspace Files', userId);

        // Ensure client is initialized with WS if needed (files actions might care about sync)
        await harness.client.init(true);
    });

    afterAll(() => harness.teardown());

    it('should create a new folder and file', async () => {
        const dirResult = await harness.client.call('file.create', {
            workspaceId,
            path: testDirPath,
            type: 'folder'
        });
        expect(dirResult.path).toBe(testDirPath);

        const fileResult = await harness.client.call('file.create', {
            workspaceId,
            path: testFilePath,
            type: 'file',
            content: initialContent
        });
        expect(fileResult.path).toBe(testFilePath);
    });

    it('should retrieve the file content', async () => {
        const getResult = await harness.client.call('file.get', {
            workspaceId,
            path: testFilePath
        });
        expect(getResult.content).toBe(initialContent);
    });

    it('should list the file tree', async () => {
        const treeResult = await harness.client.call('file.listTree', {
            workspaceId,
            path: testDirPath,
            recursive: true
        });
        expect(treeResult.entries.some((e: any) => e.path === testFilePath)).toBe(true);
    });

    it('should save/update the file content', async () => {
        await harness.client.call('file.save', {
            workspaceId,
            path: testFilePath,
            content: updatedContent
        });

        const getResult = await harness.client.call('file.get', { workspaceId, path: testFilePath });
        expect(getResult.content).toBe(updatedContent);
    });

    it('should copy the file', async () => {
        await harness.client.call('file.copy', {
            workspaceId,
            path: testFilePath,
            destinationPath: copiedFilePath
        });

        const getResult = await harness.client.call('file.get', { workspaceId, path: copiedFilePath });
        expect(getResult.content).toBe(updatedContent);
    });

    it('should rename the file', async () => {
        await harness.client.call('file.rename', {
            workspaceId,
            oldPath: testFilePath,
            newPath: renamedFilePath
        });

        await expect(harness.client.call('file.get', { workspaceId, path: testFilePath }))
            .rejects.toThrow(/File not found/);
    });

    it('should delete folders recursively', async () => {

        await harness.client.call('file.create', {
            workspaceId,
            path: testDirPath + "/test-dir-file.ts",
            type: 'file'
        });

        const deleteResult = await harness.client.call('file.delete', {
            workspaceId,
            path: testDirPath,
            recursive: true
        });
        expect(deleteResult.success).toBe(true);

        const treeResult = await harness.client.call('file.listTree', { workspaceId, path: '/' });
        expect(treeResult.entries.some((e: any) => e.path === testDirPath)).toBe(false);
    });
});
