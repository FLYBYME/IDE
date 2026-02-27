import { jest } from '@jest/globals';
import { ServiceManager, GatewayManager, GatewayClient } from 'tool-ms';
import { vfsManager } from '../../src/canvas-llm-server/core/vfs-manager';
import { prisma } from '../../src/canvas-llm-server/core/prisma';

export const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    createChild: function () { return this; }
} as any;

export class TestHarness {
    public serviceManager!: ServiceManager;
    public gatewayManager!: GatewayManager;
    public client!: GatewayClient;

    constructor(private port: number, private actions: any[]) { }

    async setup(userId: string, email: string, role: string = 'USER') {
        // 1. Database Seeding (User)
        // Cleanup existing user with this ID or email to avoid unique constraints
        await prisma.user.deleteMany({
            where: {
                OR: [{ id: userId }, { email }]
            }
        });

        await prisma.user.create({
            data: {
                id: userId,
                email,
                username: email.split('@')[0],
                passwordHash: 'mock-hash',
                role
            }
        });

        // 2. System Startup
        this.serviceManager = new ServiceManager({ logger: mockLogger });
        this.serviceManager.registerMany(this.actions);

        this.gatewayManager = new GatewayManager(this.serviceManager, {
            port: this.port,
            apiPrefix: '/api',
            logger: mockLogger,
            authenticate: async () => ({ user: { id: userId, email, role } })
        });

        await vfsManager.start();
        await this.serviceManager.start();
        await this.gatewayManager.start();

        this.client = new GatewayClient({
            baseUrl: `http://localhost:${this.port}`,
            token: 'test-token',
            logger: mockLogger
        });
        await this.client.init(false);
    }

    async teardown() {
        if (this.gatewayManager) await this.gatewayManager.stop();
        if (this.serviceManager) await this.serviceManager.stop();
        await vfsManager.stop();
        await prisma.$disconnect();
    }
}
