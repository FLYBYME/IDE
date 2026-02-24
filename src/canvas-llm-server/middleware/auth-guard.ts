import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.helper';

/**
 * Express middleware that verifies Bearer tokens and attaches
 * the decoded user payload to `req.headers['x-user-id']` and `req.headers['x-user-email']`.
 *
 * The tool-ms HttpServerManager forwards headers into Context,
 * so ServiceAction handlers can read ctx.headers['x-user-id'].
 */
export function authGuard(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized', message: 'Missing or malformed Authorization header' });
        return;
    }

    try {
        const token = authHeader.slice(7);
        const payload = verifyToken(token);
        // Inject user info into headers so the Context can access them
        req.headers['x-user-id'] = payload.userId;
        req.headers['x-user-email'] = payload.email;
        next();
    } catch (err: any) {
        res.status(401).json({ error: 'Unauthorized', message: err.message || 'Invalid token' });
    }
}
