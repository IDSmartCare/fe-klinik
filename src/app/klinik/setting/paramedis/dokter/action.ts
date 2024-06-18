'use server'

import { revalidatePath } from "next/cache";
import { typeFormDokter } from "./interface/typeFormDokter";
import prisma from "@/db";


export async function createDokter(form: typeFormDokter) {
    const poliId: any = form.poliKlinikId
    try {
        const postData = await prisma.dokter.create({
            data: {
                namaDokter: form.namaDokter,
                kodeDokter: form.kodeDokter,
                poliKlinikId: Number(poliId.value)
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