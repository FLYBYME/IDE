import { TestHarness } from '../helpers/test-harness';
import secretsActions from '../../src/canvas-llm-server/actions/secrets/secrets.actions';
import { prisma } from '../../src/canvas-llm-server/core/prisma';
import { createTestWorkspace } from '../helpers/factories';

describe('Secrets API', () => {
    const userId = '88888888-8888-8888-8888-888888888888';
    const workspaceId = '99999999-9999-9999-9999-999999999999';
    const harness = new TestHarness(3015, secretsActions);

    beforeAll(async () => {
        await harness.setup(userId, 'test-secrets@example.com');

        await createTestWorkspace(workspaceId, 'Test Workspace Secrets', userId);

        // Cleanup any existing secrets
        await prisma.workspaceSecret.deleteMany({
            where: { workspaceId }
        });
    });

    afterAll(() => harness.teardown());

    it('should set a new secret', async () => {
        const result = await harness.client.call('secrets.set', {
            workspaceId,
            key: 'API_KEY',
            value: 'super-secret-value'
        });

        expect(result.key).toBe('API_KEY');
        expect(result).toHaveProperty('updatedAt');
    });

    it('should list workspace secrets', async () => {
        const result = await harness.client.call('secrets.list', {
            workspaceId
        });

        expect(result.secrets).toHaveLength(1);
        expect(result.secrets[0].key).toBe('API_KEY');
    });

    it('should update an existing secret', async () => {
        const result = await harness.client.call('secrets.set', {
            workspaceId,
            key: 'API_KEY',
            value: 'updated-secret-value'
        });

        expect(result.key).toBe('API_KEY');
    });

    it('should delete a secret', async () => {
        const deleteResult = await harness.client.call('secrets.delete', {
            workspaceId,
            key: 'API_KEY'
        });

        expect(deleteResult.success).toBe(true);

        // Verify it's gone
        const listResult = await harness.client.call('secrets.list', {
            workspaceId
        });
        expect(listResult.secrets).toHaveLength(0);
    });

    it('should fail when deleting a non-existent secret', async () => {
        await expect(harness.client.call('secrets.delete', {
            workspaceId,
            key: 'NOT_THERE'
        })).rejects.toThrow(/Secret NOT_THERE not found/);
    });
});
