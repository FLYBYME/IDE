/**
 * Application configuration loaded from environment variables.
 */
export const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || '0.0.0.0',
    apiPrefix: process.env.API_PREFIX || '/api',

    docsPath: process.env.DOCS_PATH || '/_meta/routes',

    jwt: {
        secret: process.env.JWT_SECRET || 'canvas-llm-dev-secret-change-in-production',
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10), // 24h in seconds
        refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800', 10), // 7d
    },

    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    },

    snapshotDir: process.env.SNAPSHOT_DIR || './snapshots',
};
