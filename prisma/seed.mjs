import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    const transaksi = await prisma.$transaction(async (tx) => {
        const createProfile = await tx.profile.create({
            data: {
                namaLengkap: "Administrator",
                profesi: "Admin",
                idFasyankes: "1",
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