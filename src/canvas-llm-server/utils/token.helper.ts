import * as crypto from 'crypto';
import { config } from '../config';

export interface TokenPayload {
    userId: string;
    email: string;
}

/**
 * Lightweight HMAC-based token helper.
 * In production, replace with a full JWT library (jsonwebtoken).
 */
export function signToken(payload: TokenPayload, expiresInSeconds?: number): string {
    const exp = Math.floor(Date.now() / 1000) + (expiresInSeconds ?? config.jwt.expiresIn);
    const data = JSON.stringify({ ...payload, exp });
    const encoded = Buffer.from(data).toString('base64url');
    const signature = crypto
        .createHmac('sha256', config.jwt.secret)
        .update(encoded)
        .digest('base64url');
    return `${encoded}.${signature}`;
}

export function verifyToken(token: string): TokenPayload & { exp: number } {
    const parts = token.split('.');
    if (parts.length !== 2) throw new Error('Invalid token format');

    const [encoded, signature] = parts;
    const expectedSig = crypto
        .createHmac('sha256', config.jwt.secret)
        .update(encoded)
        .digest('base64url');

    if (signature !== expectedSig) throw new Error('Invalid token signature');

    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
    }
    return data;
}
