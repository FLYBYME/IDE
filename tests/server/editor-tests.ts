import { jest } from '@jest/globals';
import { testHelper } from '../test-utils';

describe('Editor API Endpoints', () => {
    jest.setTimeout(60000);
    let tabId: string;
    const testFilePath = '/test-editor.ts';

    beforeAll(async () => {
        await testHelper.start();

        // Create a test file to be used across the editor tests
        await testHelper.createTestFile(testFilePath);
    });

    afterAll(async () => {
        await testHelper.stop();
    });

    // ── Tests ──
    it('should open a file in the editor', async () => {
        const openResult = await testHelper.call('editor.openFile', {
            path: testFilePath,
            activate: true
        });

        expect(openResult).toHaveProperty('tabId');
        expect(openResult.path).toBe(testFilePath);
        expect(openResult.content).toBe('console.log("Initial Content");');

        // Save tabId for future tests
        tabId = openResult.tabId;
    });

    it('should retrieve the current editor state', async () => {
        const state = await testHelper.call('editor.getState');

        expect(state.workspaceId).toBe(testHelper.workspaceId);
        expect(state.tabs.length).toBeGreaterThan(0);
        expect(state.tabs[0].id).toBe(tabId);
        expect(state.activeTabId).toBe(tabId);
    });

    it('should successfully autosave a draft', async () => {
        const draftContent = 'console.log("Draft Content");';
        const autosaveDraftResult = await testHelper.call('editor.autosave', {
            path: testFilePath,
            content: draftContent,
            isDraft: true
        });

        expect(autosaveDraftResult).toHaveProperty('saved');
        expect(autosaveDraftResult.isDraft).toBe(true);
    });

    it('should successfully autosave the real file', async () => {
        const realContent = 'console.log("Real Content");';
        const autosaveRealResult = await testHelper.call('editor.autosave', {
            path: testFilePath,
            content: realContent,
            isDraft: false
        });

        expect(autosaveRealResult).toHaveProperty('saved');
        expect(autosaveRealResult.isDraft).toBe(false);
    });

    it('should save the editor layout/session state', async () => {
        const saveStateResult = await testHelper.call('editor.saveState', {
            tabs: [
                {
                    path: testFilePath,
                    cursorLine: 10,
                    cursorColumn: 5,
                    scrollTop: 100
                }
            ],
            activeTabPath: testFilePath
        });

        expect(saveStateResult).toHaveProperty('saved');

        // Verify state applied correctly
        const finalState = await testHelper.call('editor.getState');
        const updatedTab = finalState.tabs.find((t: any) => t.path === testFilePath);

        expect(updatedTab).toBeDefined();
        expect(updatedTab.cursorLine).toBe(10);
        expect(updatedTab.cursorColumn).toBe(5);
        expect(updatedTab.scrollTop).toBe(100);

        // Update tabId because saveState regenerates IDs
        tabId = updatedTab.id;
    });

    it('should successfully close the file tab', async () => {
        const closeResult = await testHelper.call('editor.closeFile', {
            tabId
        });

        expect(closeResult.success).toBe(true);

        // Verify the tab is no longer in the state
        const stateAfterClose = await testHelper.call('editor.getState');
        const closedTab = stateAfterClose.tabs.find((t: any) => t.id === tabId);
        expect(closedTab).toBeUndefined();
    });
});
