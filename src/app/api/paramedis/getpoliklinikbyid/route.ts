import prisma from "@/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const idData = searchParams.get('idpoli') as string
    const data = await prisma.poliKlinik.findFirst({
        where: {
            id: Number(idData)
        }
    })
    return Response.json(data)
}
export const dynamic = "force-dynamic";