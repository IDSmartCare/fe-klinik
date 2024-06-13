import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export async function GET() {
    const data = await prisma.poliKlinik.findMany({
        where: {
            isAktif: true
        }
    })
    return Response.json(data)
}