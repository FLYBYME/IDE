import { ServiceManager, GatewayManager } from 'tool-ms';
import { config } from './config';
import { authGuard } from './middleware/auth-guard';
import { vfsManager } from './core/vfs-manager';
import path from 'path';


// ── Import all service actions ───────────────────────
import allActions from './actions';

import { Logger } from 'tool-ms';
import fs from 'fs';

class FileLogger implements Logger {
    info(message: string): void {
        fs.appendFileSync('log.txt', message + '\n');
        if (config.debug) {
            console.log(message);
        }
    }
    debug(message: string): void {
        fs.appendFileSync('log.txt', message + '\n');
        if (config.debug) {
            console.log(message);
        }
    }
    warn(message: string): void {
        fs.appendFileSync('log.txt', message + '\n');
        if (config.debug) {
            console.log(message);
        }
    }
    error(message: string): void {
        fs.appendFileSync('log.txt', message + '\n');
        if (config.debug) {
            console.log(message);
        }
    }
    createChild(name: string): Logger {
        return new FileLogger();
    }
}

const logger = new FileLogger();
let gatewayManager: GatewayManager | null = null;
let serviceManager: ServiceManager | null = null;

export async function bootstrap() {
    logger.info('🚀 Starting CanvasLLM IDE Server...');

    // ── 1. Create ServiceManager ─────────────────────
    serviceManager = new ServiceManager({ logger });

    // ── 2. Register all actions ──────────────────────
    serviceManager.registerMany(allActions);
    logger.info(`✅ Registered ${allActions.length} service actions across ${serviceManager.getDomains().length} domains`);

    // ── 3. Create HTTP Server ────────────────────────
    gatewayManager = new GatewayManager(serviceManager, {
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
            //requireAuth: authGuard,
        },
        staticFiles: [
            {
                path: '/public',
                directory: path.join(process.cwd(), 'public'),
            },
        ],
        authenticate: async (token, action) => {
            try {
                const payload = verifyToken(token);

                // 1. Enforce RBAC if the action requires specific roles
                if (action.auth?.roles && action.auth.roles.length > 0) {
                    if (!action.auth.roles.includes(payload.role)) {
                        throw new Error("Forbidden: Insufficient privileges");
                    }
                }

                // 2. Return enriched user object to Context metadata
                return {
                    user: {
                        id: payload.userId,
                        email: payload.email,
                        role: payload.role
                    }
                };
            } catch (err: any) {
                if (err.message === "Forbidden: Insufficient privileges") {
                    throw err;
                }
                throw new Error("Invalid Token");
            }
        }
    });

    // ── 4. Start VFS Manager ────────────────────────
    vfsManager.start();
    logger.info('📁 VFS Manager started');

    // ── 5. Start ServiceManager lifecycle ────────────
    await serviceManager.start();
    logger.info('⚙️  ServiceManager started');

    // ── 6. Start Unified Communications Bridge Gateway  ────────────────
    await gatewayManager.start();

    logger.info(`🌍 HTTP Server listening on ${config.host}:${config.port}`);
    logger.info(`📋 Meta routes: http://${config.host}:${config.port}${config.apiPrefix}/_meta/routes`);
    logger.info(`❤️  Health check: http://${config.host}:${config.port}/api/_meta/health`);

    return { serviceManager, gatewayManager, vfsManager };
}

export async function stopServer() {
    logger.info('🛑 Shutting down server gracefully...');
    if (serviceManager) {
        logger.info('Stopping ServiceManager...');
        await serviceManager.stop();
        logger.info('ServiceManager stopped');
    }
    if (gatewayManager) {
        logger.info('Stopping GatewayManager...');
        await gatewayManager.stop();
        logger.info('GatewayManager stopped');
    }
    logger.info('Stopping VFS Manager...');
    await vfsManager.stop();
    logger.info('👋 Goodbye!');
}

// ── Graceful Shutdown for Process ────────────────────
const handleShutdown = async (signal: string) => {
    logger.info(`\n🛑 Received ${signal}.`);
    await stopServer();
    process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

import { fileURLToPath } from 'url';
import { verifyToken } from './utils/token.helper';

// ── Run if direct ────────────────────────────────────
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === (process.argv[1].startsWith('/') ? process.argv[1] : path.resolve(process.cwd(), process.argv[1]));

if (isDirectRun) {
    bootstrap().catch((err) => {
        console.error('❌ Fatal error during bootstrap:', err);
        process.exit(1);
    });
}
