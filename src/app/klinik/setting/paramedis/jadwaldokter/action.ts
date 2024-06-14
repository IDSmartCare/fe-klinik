'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache";
import { typeFormJadwal } from "./interface/typeFormJadwal";


const prisma = new PrismaClient()
export async function createJadwal(form: typeFormJadwal) {
    const kodeHari: any = form.kodeHari.value
    const hari: any = form.kodeHari.label
    const dokterId: any = form.dokterId.value

    try {
        const postData = await prisma.jadwalDokter.create({
            data: {
                hari,
                kodeHari,
                dokterId,
                jamPraktek: `${form.jamDari}-${form.jamSampai}`
            }
        })
        revalidatePath("/klinik/setting/paramedis/jadwaldokter")
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