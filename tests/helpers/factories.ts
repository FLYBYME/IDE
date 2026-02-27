import { prisma } from '../../src/canvas-llm-server/core/prisma';

export async function createTestWorkspace(workspaceId: string, name: string, ownerId: string) {
    return await prisma.workspace.upsert({
        where: { id: workspaceId },
        update: {},
        create: {
            id: workspaceId,
            name,
            ownerId
        }
    });
}

// Add more factories as needed
