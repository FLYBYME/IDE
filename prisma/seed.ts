import { PrismaClient } from './generated/prisma/client';
import { hashPassword } from '../src/canvas-llm-server/utils/password.helper';
import * as crypto from 'crypto';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
    url: 'file:/home/ubuntu/code/IDE/prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminPassword = await hashPassword('admin123');
    const devPassword = await hashPassword('dev123');

    const adminEmail = 'admin@canvas-llm.local';
    const adminUsername = 'admin';
    const devEmail = 'user@canvas-llm.local';
    const devUsername = 'devuser';

    // Cleanup
    await prisma.user.deleteMany({
        where: {
            OR: [
                { email: adminEmail },
                { username: adminUsername },
                { email: devEmail },
                { username: devUsername }
            ]
        }
    });

    // 1. Create Admin
    await prisma.user.create({
        data: {
            id: crypto.randomUUID(),
            email: adminEmail,
            username: adminUsername,
            passwordHash: adminPassword,
            role: 'ADMIN',
            bio: 'System Administrator',
        },
    });

    // 2. Create Standard User
    await prisma.user.create({
        data: {
            id: crypto.randomUUID(),
            email: devEmail,
            username: devUsername,
            passwordHash: devPassword,
            role: 'USER',
        },
    });

    console.log('✅ Seeded database with ADMIN and USER accounts.');
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
