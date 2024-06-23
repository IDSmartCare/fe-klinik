import prisma from "@/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const idFasyankes = searchParams.get('idFasyankes') as string
    const data = await prisma.user.findMany({
        where: {
            isAktif: true,
            idFasyankes
        }
    })
    return Response.json(data)
}
export const dynamic = "force-dynamic";