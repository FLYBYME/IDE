import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
    userId: string;
    email: string;
}

/**
 * JWT-based token helper.
 */
export function signToken(payload: TokenPayload, expiresInSeconds?: number): string {
    const expiresIn = expiresInSeconds ?? config.jwt.expiresIn;
    return jwt.sign(payload, config.jwt.secret, { expiresIn });
}

export function verifyToken(token: string, ignoreExpiration: boolean = false): TokenPayload & { exp: number } {
    try {
        return jwt.verify(token, config.jwt.secret, { ignoreExpiration }) as TokenPayload & { exp: number };
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        }
        throw new Error('Invalid token');
    }
}
