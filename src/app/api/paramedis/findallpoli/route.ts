import prisma from "@/db";

export async function GET() {
    const data = await prisma.poliKlinik.findMany({
        where: {
            isAktif: true
        }
    })
    return Response.json(data)
}
export const dynamic = "force-dynamic";