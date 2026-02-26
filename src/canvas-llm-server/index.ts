import { ServiceManager, HttpServerManager, ConsoleLogger, Adapter } from 'tool-ms';
import { config } from './config';
import { authGuard } from './middleware/auth-guard';
import { vfsManager } from './core/vfs-manager';
import path from 'path';

// ── Import all service actions ───────────────────────
import authActions from './actions/auth/auth.actions';
import workspaceActions from './actions/workspace/workspace.actions';
import filesActions from './actions/files/files.actions';
import editorActions from './actions/editor/editor.actions';
import settingsActions from './actions/settings/settings.actions';
import aiActions from './actions/ai/ai.actions';
import realtimeActions from './actions/realtime/realtime.actions';
import metaActions from './actions/meta/meta.actions';
import sourceControlActions from './actions/source-control/source-control.actions';
import extensionActions from './actions/extension/extension.actions';
import secretsActions from './actions/secrets/secrets.actions';
import { gatewayManager } from './core/gateway-manager';

async function bootstrap() {
    const logger = new ConsoleLogger();
    logger.info('🚀 Starting CanvasLLM IDE Server...');

    // ── 1. Create ServiceManager ─────────────────────
    const serviceManager = new ServiceManager({ logger });

    // ── 2. Register all actions ──────────────────────
    const allActions = [
        ...authActions,
        ...workspaceActions,
        ...filesActions,
        ...editorActions,
        ...settingsActions,
        ...aiActions,
        ...realtimeActions,
        ...metaActions,
        ...sourceControlActions,
        ...extensionActions,
        ...secretsActions,
    ];

    serviceManager.registerMany(allActions);
    logger.info(`✅ Registered ${allActions.length} service actions across ${serviceManager.getDomains().length} domains`);

    // ── 3. Create HTTP Server ────────────────────────
    const httpServer = new HttpServerManager(serviceManager, {
        port: config.port,
        //host: config.host,
        apiPrefix: config.apiPrefix,
        docsPath: config.docsPath,
        logger,
        cors: {
            origin: config.cors.origin,
            credentials: config.cors.credentials,
        },
        middlewareRegistry: {
            requireAuth: authGuard,
        },
        routers: [],
        staticFiles: [
            {
                path: '/public',
                directory: path.join(process.cwd(), 'public'),
            },
        ],
    });
    console.log('[StaticFiles]', path.join(process.cwd(), 'public'));

    // ── 4. Start VFS Manager ────────────────────────
    vfsManager.start();
    logger.info('📁 VFS Manager started');

    // ── 5. Start ServiceManager lifecycle ────────────
    await serviceManager.start();
    logger.info('⚙️  ServiceManager started');

    // ── 6. Start Unified Communications Bridge Gateway  ────────────────
    await gatewayManager.init(config.ssePort);
    logger.info(`🌐 UCB Gateway Server started on port ${config.ssePort}`);

    // ── 7. Start HTTP Server ─────────────────────────
    await httpServer.start();
    logger.info(`🌍 HTTP Server listening on ${config.host}:${config.port}`);
    logger.info(`📋 Meta routes: http://${config.host}:${config.port}${config.apiPrefix}/_meta/routes`);
    logger.info(`❤️  Health check: http://${config.host}:${config.port}/api/_meta/health`);

    // ── Graceful Shutdown ────────────────────────────
    const shutdown = async (signal: string) => {
        logger.info(`\n🛑 Received ${signal}. Shutting down gracefully...`);
        await httpServer.stop();
        await serviceManager.stop();
        await gatewayManager.stop();
        await vfsManager.stop();
        logger.info('👋 Goodbye!');
        process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
    console.error('❌ Fatal error during bootstrap:', err);
    process.exit(1);
});
