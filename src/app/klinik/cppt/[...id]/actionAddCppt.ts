'use server'

import { revalidatePath } from "next/cache";
import prisma from "@/db";
import { typeFormCppt } from "../interface/typeFormCppt";


export async function createCppt(form: typeFormCppt, idpasien: string) {
    try {
        const postDb = await prisma.sOAP.create({
            data: {
                profesi: form.profesi,
                subjective: form.subjective,
                objective: form.objective,
                assesment: form.assesment,
                plan: form.plan,
                instruksi: form.instruksi,
                inputBy: form.inputBy,
                pendaftaranId: form.pendaftaranId
            }
        })
        revalidatePath(`/klinik/cppt/${form.pendaftaranId}/${idpasien}`)
        return {
            status: true,
            message: "Berhasil tersimpan",
            data: postDb
        }
    } catch (error) {
        return {
            status: false,
            message: error,
            data: "null"
        }
    }
}