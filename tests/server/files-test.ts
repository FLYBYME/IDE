import { jest } from '@jest/globals';
import { testHelper } from '../test-utils';

describe('Files API Endpoints', () => {
    jest.setTimeout(60000);
    const testDirPath = '/test-dir';
    const testFilePath = `${testDirPath}/hello.ts`;
    const renamedFilePath = `${testDirPath}/hello-renamed.ts`;
    const copiedFilePath = `${testDirPath}/hello-copy.ts`;
    const initialContent = 'console.log("Hello, World!");';
    const updatedContent = 'console.log("Hello, Universe!");';

    beforeAll(async () => {
        await testHelper.start();
    });

    afterAll(async () => {
        await testHelper.stop();
    });

    it('should create a new folder and file', async () => {
        // Create directory
        const dirResult = await testHelper.call('file.create', {
            path: testDirPath,
            type: 'folder'
        });
        expect(dirResult.path).toBe(testDirPath);
        expect(dirResult.type).toBe('folder');

        // Create file
        const fileResult = await testHelper.call('file.create', {
            path: testFilePath,
            type: 'file',
            content: initialContent
        });
        expect(fileResult.path).toBe(testFilePath);
        expect(fileResult.type).toBe('file');
    });

    it('should retrieve the file content', async () => {
        const getResult = await testHelper.call('file.get', {
            path: testFilePath
        });
        expect(getResult.path).toBe(testFilePath);
        expect(getResult.content).toBe(initialContent);
        expect(getResult.size).toBeGreaterThan(0);
    });

    it('should list the file tree', async () => {
        const treeResult = await testHelper.call('file.listTree', {
            path: testDirPath,
            recursive: true
        });
        expect(treeResult.path).toBe(testDirPath);
        expect(treeResult.entries).toBeInstanceOf(Array);
        expect(treeResult.entries.length).toBeGreaterThan(0);
        expect(treeResult.entries.some((e: any) => e.path === testFilePath)).toBe(true);
    });

    it('should save/update the file content', async () => {
        const saveResult = await testHelper.call('file.save', {
            path: testFilePath,
            content: updatedContent
        });
        expect(saveResult.path).toBe(testFilePath);
        expect(saveResult.size).toBe(updatedContent.length);

        // Verify update
        const getResult = await testHelper.call('file.get', { path: testFilePath });
        expect(getResult.content).toBe(updatedContent);
    });

    it('should copy the file', async () => {
        const copyResult = await testHelper.call('file.copy', {
            path: testFilePath,
            destinationPath: copiedFilePath
        });
        expect(copyResult.original).toBe(testFilePath);
        expect(copyResult.copy).toBe(copiedFilePath);

        // Verify copy exists
        const getResult = await testHelper.call('file.get', { path: copiedFilePath });
        expect(getResult.content).toBe(updatedContent);
    });

    it('should rename the file', async () => {
        const renameResult = await testHelper.call('file.rename', {
            oldPath: testFilePath,
            newPath: renamedFilePath
        });
        expect(renameResult.oldPath).toBe(testFilePath);
        expect(renameResult.newPath).toBe(renamedFilePath);

        // Verify old file is gone
        await expect(testHelper.call('file.get', { path: testFilePath }))
            .rejects.toThrow(/File not found/);
    });

    it('should search for file content', async () => {
        const searchResult = await testHelper.call('file.search', {
            query: 'Universe',
            type: 'content',
            caseSensitive: false
        });
        expect(searchResult.total).toBeGreaterThan(0);
        expect(searchResult.results[0].matches.length).toBeGreaterThan(0);
        expect(searchResult.results.some((r: any) => r.path === renamedFilePath)).toBe(true);
    });

    it('should delete the folder and its contents recursively', async () => {
        const deleteResult = await testHelper.call('file.delete', {
            path: testDirPath,
            recursive: true
        });
        expect(deleteResult.success).toBe(true);
        expect(deleteResult.deleted).toBeGreaterThan(0);

        // Verify it's gone
        const treeResult = await testHelper.call('file.listTree', { path: '/' });
        expect(treeResult.entries.some((e: any) => e.path === testDirPath)).toBe(false);
    });
});