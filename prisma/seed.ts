import { PrismaClient } from './generated/prisma/client.js';
import { hashPassword } from '../src/canvas-llm-server/utils/password.helper.js';
import * as crypto from 'crypto';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
    url: 'file:prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
    const hash = await hashPassword('admin123');

    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            id: crypto.randomUUID(),
            email: 'admin@canvas-llm.dev',
            username: 'admin',
            passwordHash: hash,
        },
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
