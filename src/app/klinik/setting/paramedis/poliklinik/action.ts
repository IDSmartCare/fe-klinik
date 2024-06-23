'use server'

import prisma from "@/db";
import { typeFormPoliklinik } from "./interface/typeFormPoliklinik";
import { revalidatePath } from "next/cache";


export async function createPoli(form: typeFormPoliklinik, idFasyankes: string) {
    try {
        const postData = await prisma.poliKlinik.create({
            data: {
                namaPoli: form.namaPoli,
                kodePoli: form.kodePoli,
                idFasyankes
            }
        })
        revalidatePath("/klinik/setting/paramedis/poliklinik")
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