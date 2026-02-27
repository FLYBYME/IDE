import { TestHarness } from '../helpers/test-harness';
import workspaceActions from '../../src/canvas-llm-server/actions/workspace/workspace.actions';
import { prisma } from '../../src/canvas-llm-server/core/prisma';

describe('Workspace API', () => {
    const userId = '12341234-1234-1234-1234-123412341234';
    let workspaceId: string;
    const harness = new TestHarness(3017, workspaceActions);

    beforeAll(async () => {
        await harness.setup(userId, 'test-workspace@example.com');

        // Cleanup workspaces for this user
        await prisma.workspace.deleteMany({ where: { ownerId: userId } });
    });

    afterAll(() => harness.teardown());

    it('should create a new workspace', async () => {
        const result = await harness.client.call('workspace.create', {
            name: 'New Test Workspace'
        });

        expect(result).toHaveProperty('id');
        expect(result.name).toBe('New Test Workspace');
        expect(result.owner).toBe(userId);
        workspaceId = result.id;
    });

    it('should list workspaces for the user', async () => {
        const result = await harness.client.call('workspace.list', {});
        expect(Array.isArray(result.workspaces)).toBe(true);
        expect(result.workspaces.length).toBeGreaterThan(0);
        expect(result.workspaces.some((w: any) => w.id === workspaceId)).toBe(true);
    });

    it('should get a workspace by ID', async () => {
        const result = await harness.client.call('workspace.get', {
            id: workspaceId
        });
        expect(result.id).toBe(workspaceId);
        expect(result.name).toBe('New Test Workspace');
        expect(result.owner).toBe(userId);
    });

    it('should update a workspace name', async () => {
        const result = await harness.client.call('workspace.update', {
            id: workspaceId,
            name: 'Updated Workspace Name'
        });
        expect(result.id).toBe(workspaceId);
        expect(result.updated).toBeTruthy();
    });

    it('should delete a workspace', async () => {
        const result = await harness.client.call('workspace.delete', {
            id: workspaceId
        });
        expect(result.success).toBe(true);

        // Verify deletion
        const listResult = await harness.client.call('workspace.list', {});
        expect(listResult.workspaces.some((w: any) => w.id === workspaceId)).toBe(false);
    });
});
