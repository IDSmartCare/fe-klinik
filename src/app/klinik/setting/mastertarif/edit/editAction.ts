'use server'

import prisma from "@/db"
import { revalidatePath } from "next/cache"

export default async function EditAction(body: formEditTarif) {
    try {
        const updateDb = await prisma.masterTarif.update({
            where: {
                id: body.id
            },
            data: {
                namaTarif: body.namaTarif,
                hargaTarif: body.hargaTarif,
            }
        })
        revalidatePath("/klinik/setting/mastertarif")
        return {
            status: true,
            message: "Berhasil tersimpan",
            data: updateDb
        }

    } catch (error) {
        return {
            status: false,
            message: error,
            data: "null"
        }
    }
}