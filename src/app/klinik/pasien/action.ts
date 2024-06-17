'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache";
import { typeFormPasienBaru } from "./interface/typeFormPasienBaru";
import { formatISO } from 'date-fns'


const prisma = new PrismaClient()
export async function createPasien(form: typeFormPasienBaru) {
    try {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth()
        const monthStart = new Date(year, month, 1).getTime()
        const nextMonthStart = new Date(year, month + 1, 1).getTime()
        const transaksi = await prisma.$transaction(async (tx) => {
            const count = await tx.pasien.count({
                where: {
                    AND: [
                        { createdAt: { gte: new Date(monthStart) } }, // Greater than or equal to this month's start
                        { createdAt: { lt: new Date(nextMonthStart) } }, // Less than next month's start
                    ],
                }
            })
            const totalPasien = count.toString().padStart(4, "0")
            const totalBulan = month.toString().padStart(2, "0")
            const rm = `${year.toString().slice(-2)}${totalBulan}${totalPasien}`
            const postData = await tx.pasien.create({
                data: {
                    noRm: rm,
                    namaPasien: form.namaPasien.toUpperCase(),
                    wargaNegara: form.wargaNegara ?? null,
                    nik: form.nik ?? null,
                    bpjs: form.bpjs ?? null,
                    noAsuransi: form.noAsuransi ?? null,
                    paspor: form.paspor ?? null,
                    bahasa: form.bahasa ?? null,
                    noHp: form.noHp,
                    tempatLahir: form.tempatLahir,
                    tanggalLahir: formatISO(new Date(form.tanggalLahir)),
                    jenisKelamin: form.jenisKelamin,
                    statusMenikah: form.statusMenikah,
                    agama: form.agama,
                    alamat: form.alamat,
                    ibuKandung: form.ibuKandung,
                    provinsi: form.provinsi,
                    idProv: form.idProv,
                    kota: form.kota,
                    idKota: form.idKota,
                    kecamatan: form.kecamatan,
                    idKecamatan: form.idKecamatan,
                    kelurahan: form.kelurahan,
                    idKelurahan: form.idKelurahan,
                    rt: form.rt,
                    rw: form.rw,
                    kodePos: form.kodePos,
                    pendidikan: form.pendidikan,
                    pekerjaan: form.pekerjaan,
                    alamatDomisili: form.alamatDomisili,
                    provinsiDomisili: form.provinsiDomisili,
                    idProvDomisili: form.idProvDomisili,
                    kotaDomisili: form.kotaDomisili,
                    idKotaDomisili: form.idKotaDomisili,
                    kecamatanDomisili: form.kecamatanDomisili,
                    idKecamatanDomisili: form.idKecamatanDomisili,
                    kelurahanDomisili: form.kelurahanDomisili,
                    idKelurahanDomisili: form.idKelurahanDomisili,
                    rtDomisili: form.rtDomisili,
                    rwDomisili: form.rwDomisili,
                    kodePosDomisili: form.kodePosDomisili
                }
            })
            return postData
        })
        revalidatePath("/klinik/pasien")
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