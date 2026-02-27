import { TestHarness } from '../helpers/test-harness';
import editorActions from '../../src/canvas-llm-server/actions/editor/editor.actions';
import filesActions from '../../src/canvas-llm-server/actions/files/files.actions';
import { createTestWorkspace } from '../helpers/factories';
import { vfsManager } from '../../src/canvas-llm-server/core/vfs-manager';

describe('Editor API', () => {
    const userId = '11111111-1111-1111-1111-111111111111';
    const workspaceId = '22222222-2222-2222-2222-222222222222';
    const harness = new TestHarness(3019, [...editorActions, ...filesActions]);
    const testFilePath = '/test-editor.ts';
    let tabId: string;

    beforeAll(async () => {
        await harness.setup(userId, 'test-editor@example.com');
        await createTestWorkspace(workspaceId, 'Test Workspace Editor', userId);

        const vfs = await vfsManager.getVFS(workspaceId);
        vfs.write(testFilePath, 'console.log("Initial Content");');
    });

    afterAll(() => harness.teardown());

    it('should open a file in the editor', async () => {
        const openResult = await harness.client.call('editor.openFile', {
            workspaceId,
            path: testFilePath,
            activate: true
        });

        expect(openResult.path).toBe(testFilePath);
        expect(openResult.content).toBe('console.log("Initial Content");');
        tabId = openResult.tabId;
    });

    it('should retrieve the current editor state', async () => {
        const state = await harness.client.call('editor.getState', { workspaceId });
        expect(state.tabs.some((t: any) => t.id === tabId)).toBe(true);
    });

    it('should successfully autosave a draft', async () => {
        const draftContent = 'console.log("Draft Content");';
        const result = await harness.client.call('editor.autosave', {
            workspaceId,
            path: testFilePath,
            content: draftContent,
            isDraft: true
        });
        expect(result.saved).toBeTruthy();
        expect(result.isDraft).toBe(true);
    });

    it('should successfully close the file tab', async () => {
        const result = await harness.client.call('editor.closeFile', {
            workspaceId,
            tabId
        });
        expect(result.success).toBe(true);
    });
});
