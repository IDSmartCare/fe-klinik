import prisma from "@/db"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
    const body = await req.json()
    const update = await prisma.profile.update({
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