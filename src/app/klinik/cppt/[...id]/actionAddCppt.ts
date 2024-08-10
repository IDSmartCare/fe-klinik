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
                        sOAPId: simpanSoap.id,
                        namaObat: item.namaObat,
                        obatId: item.obatId,
                        jumlah: Number(item.jumlah),
                        signa1: item.signa1,
                        signa2: item.signa2,
                        aturanPakai: item.aturanPakai,
                        waktu: item.waktu,
                        catatan: item?.catatan,
                        satuan: item?.satuan,
                        hargaJual: item?.harga_jual,
                        stok: item?.stok
                    }
                })
                await tx.resepDokter.createMany({
                    data: resepDokter
                })
            }
            if (form.profesi === "dokter") {

                await tx.pendaftaran.update({
                    where: {
                        id: Number(form.pendaftaranId)
                    },
                    data: {
                        isSoapDokter: true
                    }
                })
                const getPenjamin = await tx.pendaftaran.findFirst({
                    where: {
                        id: Number(form.pendaftaranId)
                    }
                })
                const konsulDokter = await tx.masterTarif.findFirst({
                    where: {
                        idFasyankes,
                        penjamin: getPenjamin?.penjamin,
                        kategoriTarif: "Dokter",
                        isAktif: true
                    }
                })
                const bill = await tx.billPasien.findFirst({
                    where: {
                        pendaftaranId: form.pendaftaranId
                    }
                })
                await tx.billPasienDetail.create({
                    data: {
                        harga: konsulDokter?.hargaTarif,
                        jenisBill: "Dokter",
                        deskripsi: konsulDokter?.namaTarif as string,
                        billPasienId: bill?.id,
                        jumlah: 1,
                        subTotal: (Number(konsulDokter?.hargaTarif) * 1).toString()
                    }
                })
            } else {
                await tx.pendaftaran.update({
                    where: {
                        id: Number(form.pendaftaranId)
                    },
                    data: {
                        isSoapPerawat: true
                    }
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