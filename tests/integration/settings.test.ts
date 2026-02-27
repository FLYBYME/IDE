import { TestHarness } from '../helpers/test-harness';
import settingsActions from '../../src/canvas-llm-server/actions/settings/settings.actions';
import { prisma } from '../../src/canvas-llm-server/core/prisma';
import { createTestWorkspace } from '../helpers/factories';

describe('Settings API', () => {
    const userId = '77777777-7777-7777-7777-777777777777';
    const workspaceId = '66666666-6666-6666-6666-666666666666';
    const harness = new TestHarness(3016, settingsActions);

    beforeAll(async () => {
        await harness.setup(userId, 'test-settings@example.com');

        await createTestWorkspace(workspaceId, 'Test Workspace Settings', userId);

        // Cleanup any existing settings
        await prisma.workspaceSettings.deleteMany({ where: { workspaceId } });
        await prisma.userSettings.deleteMany({ where: { userId } });
    });

    afterAll(() => harness.teardown());

    it('should retrieve default workspace settings initially', async () => {
        const result = await harness.client.call('settings.getWorkspaceSettings', {
            workspaceId
        });

        const settings = result.workspace;
        expect(settings).toHaveProperty('language');
        expect(settings).toHaveProperty('formatter');
        expect(settings).toHaveProperty('linter');
    });

    it('should update workspace settings', async () => {
        const updateData = {
            language: 'typescript',
            formatter: 'prettier'
        };

        const result = await harness.client.call('settings.updateWorkspaceSettings', {
            workspaceId,
            ...updateData
        });

        expect(result).toHaveProperty('updated');

        // Verify update
        const getResult = await harness.client.call('settings.getWorkspaceSettings', { workspaceId });
        expect(getResult.workspace.language).toBe('typescript');
    });

    it('should update user settings', async () => {
        const result = await harness.client.call('settings.updateUserSettings', {
            theme: 'dark',
            fontSize: 14
        });

        expect(result).toHaveProperty('updated');
        expect(result.settings.theme).toBe('dark');
        expect(result.settings.fontSize).toBe(14);
    });

    it('should retrieve updated user settings', async () => {
        const result = await harness.client.call('settings.getUserSettings', {});
        expect(result.user.theme).toBe('dark');
        expect(result.user.fontSize).toBe(14);
    });
});
