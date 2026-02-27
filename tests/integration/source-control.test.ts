import { TestHarness } from '../helpers/test-harness';
import sourceControlActions from '../../src/canvas-llm-server/actions/source-control/source-control.actions';
import { createTestWorkspace } from '../helpers/factories';
import { vfsManager } from '../../src/canvas-llm-server/core/vfs-manager';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../../src/canvas-llm-server/config';

describe('Source Control API', () => {
    const userId = '22222222-2222-2222-2222-222222222222';
    const workspaceId = '33333333-3333-3333-3333-333333333333';
    const harness = new TestHarness(3020, sourceControlActions);

    beforeAll(async () => {
        await harness.setup(userId, 'sc-test@example.com');
        await createTestWorkspace(workspaceId, 'SC Test Workspace', userId);

        // Cleanup VFS snapshots
        const snapshotPath = path.resolve(config.snapshotDir, `${workspaceId}.json`);
        if (fs.existsSync(snapshotPath)) {
            fs.unlinkSync(snapshotPath);
        }
    });

    afterAll(() => harness.teardown());

    it('should show new files in status and allow committing them', async () => {
        const vfs = await vfsManager.getVFS(workspaceId);
        await vfs.write('/test.txt', 'hello sc');

        const status = await harness.client.call('source-control.status', { workspaceId });
        expect(status.new).toContain('test.txt');

        await harness.client.call('source-control.commit', {
            workspaceId,
            message: 'Initial commit'
        });

        const log = await harness.client.call('source-control.log', { workspaceId });
        expect(log[0].message).toBe('Initial commit');
    });

    it('should create branches', async () => {
        await harness.client.call('source-control.createBranch', {
            workspaceId,
            name: 'feature-beta'
        });

        const result = await harness.client.call('source-control.listBranches', { workspaceId });
        expect(result.branches.some((b: any) => b.name === 'feature-beta')).toBe(true);
    });

    it('should successfully checkout a branch', async () => {
        const result = await harness.client.call('source-control.checkout', {
            workspaceId,
            ref: 'feature-beta'
        });
        expect(result.success).toBe(true);
    });
});
