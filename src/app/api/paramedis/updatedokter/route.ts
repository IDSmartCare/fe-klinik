import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()
export async function POST(req: Request) {
    const body = await req.json()
    const update = await prisma.dokter.update({
        data: {
            isAktif: body.status
        },
        where: {
            id: body.id
        }
    })
    revalidatePath("/klinik/setting/paramedis/dokter")
    return Response.json(update)
}