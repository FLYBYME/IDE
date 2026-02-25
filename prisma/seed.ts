import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/canvas-llm-server/utils/password.helper';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

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
