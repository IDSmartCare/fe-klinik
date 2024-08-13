import prisma from "@/db"
import { revalidatePath } from "next/cache"

export async function DELETE(req: Request) {
    const body = await req.json()
    const findPoliWithPatient = await prisma.$transaction(async (tx) => {
        const findRegis = await tx.pendaftaran.findMany({
            where: {
                jadwal: {
                    dokter: {
                        poliKlinikId: body.id
                    }
                }
            }
        })
        if (findRegis.length > 0) {
            return "Poli sudah ada pasienya!"
        } else {
            const update = await prisma.poliKlinik.delete({
                where: {
                    id: body.id
                }
            })
            return update
        }
    })
    revalidatePath("/klinik/setting/paramedis/poliklinik")
    return Response.json(findPoliWithPatient)
}