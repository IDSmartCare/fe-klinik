'use server'

import { revalidatePath } from "next/cache";
import { typeFormDokter } from "./interface/typeFormDokter";
import prisma from "@/db";


export async function createDokter(form: typeFormDokter, idFasyankes: string) {
    const poliId: any = form.poliKlinikId
    const userId: any = form.userId
    try {
        const postData = await prisma.profile.create({
            data: {
                namaLengkap: form.namaLengkap,
                profesi: "Dokter",
                kodeDokter: form.kodeDokter,
                poliKlinikId: Number(poliId.value),
                userId: Number(userId.value),
                idFasyankes,
            }
        })
        revalidatePath("/klinik/setting/paramedis/dokter")
        return {
            status: true,
            message: "Berhasil tersimpan",
            data: postData
        }
    } catch (error) {
        return {
            status: false,
            message: error,
            data: null
        }
    }

}