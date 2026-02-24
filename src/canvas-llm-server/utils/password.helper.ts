import * as crypto from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const ITERATIONS = 100_000;
const DIGEST = 'sha512';

/**
 * Hash a plain-text password using PBKDF2.
 * In production, prefer Argon2 (argon2 npm package).
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
            if (err) return reject(err);
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(':');
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
            if (err) return reject(err);
            resolve(derivedKey.toString('hex') === key);
        });
    });
}
