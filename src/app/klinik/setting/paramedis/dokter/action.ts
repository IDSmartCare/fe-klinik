'use server'

import { revalidatePath } from "next/cache";
import { typeFormDokter } from "./interface/typeFormDokter";
import prisma from "@/db";


export async function createDokter(form: typeFormDokter, idFasyankes: string) {
    const poliId: any = form.poliKlinikId
    try {
        const postData = await prisma.profile.create({
            data: {
                namaLengkap: form.namaLengkap,
                profesi: "DOKTER",
                kodeDokter: form.kodeDokter,
                poliKlinikId: Number(poliId.value),
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