'use server'

import { revalidatePath } from "next/cache";
import prisma from "@/db";
import { typeFormCppt } from "../interface/typeFormCppt";


export async function createCppt(form: typeFormCppt, idpasien: string, idFasyankes: string) {
    try {
        const listResep = form.resep
        const transaksi = await prisma.$transaction(async (tx) => {
            const simpanSoap = await tx.sOAP.create({
                data: {
                    profesi: form.profesi,
                    subjective: form.subjective,
                    objective: form.objective,
                    assesment: form.assesment,
                    plan: form.plan,
                    instruksi: form.instruksi,
                    profileId: form.profileId,
                    idFasyankes,
                    pendaftaranId: form.pendaftaranId,
                    isDokter: form.isDokter,
                    isVerifDokter: form.isVerifDokter,
                    jamVerifDokter: form.jamVerifDokter
                }
            })

            if (listResep.length > 0) {
                const resepDokter = listResep.map((item) => {
                    return {
                        resep: item,
                        sOAPId: simpanSoap.id
                    }
                })
                await tx.resepDokter.createMany({
                    data: resepDokter
                })
            }
            return simpanSoap

        })
        revalidatePath(`/klinik/cppt/${form.pendaftaranId}/${idpasien}`)
        return {
            status: true,
            message: "Berhasil tersimpan",
            data: transaksi
        }
    } catch (error) {
        return {
            status: false,
            message: error,
            data: "null"
        }
    }
}