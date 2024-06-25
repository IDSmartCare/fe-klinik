import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    const transaksi = await prisma.$transaction(async (tx) => {
        const createUser = await tx.user.create({
            data: {
                username: 'admin',
                password: 'coba123',
                role: 'admin',
                idFasyankes: "1"
            }
        })
        const createProfile = await tx.profile.create({
            data: {
                namaLengkap: "Administrator",
                profesi: "Admin",
                idFasyankes: "1",
                userId: createUser.id,
            }
        })
        return createProfile
    })
    console.log(`Database seeded with profile ${transaksi.namaLengkap}`);
}

seed()
    .catch((e) => {
        console.error("Seeding failed", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });