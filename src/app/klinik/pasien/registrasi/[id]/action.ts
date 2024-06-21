'use server'

import prisma from "@/db";
import { typeFormRegis } from "../../interface/typeFormRegistrasi";
import { revalidatePath } from "next/cache";

export async function createRegistrasi(form: typeFormRegis) {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const transaksi = await prisma.$transaction(async (tx) => {
            const lastEpisode = await tx.episodePendaftaran.findMany({
                where: {
                    pasienId: form.pasienId,
                },
                orderBy: {
                    id: "desc",
                },
                take: 1,
            })

            if (lastEpisode.length === 0) {
                const episodeBaru = await tx.episodePendaftaran.create({
                    data: {
                        pasienId: form.pasienId,
                        episode: 1
                    }
                })
                const registrasi = await tx.pendaftaran.create({
                    data: {
                        episodePendaftaranId: episodeBaru.id,
                        jadwalDokterId: form.jadwalDokterId,
                        penjamin: form.penjamin,
                        namaAsuransi: form.namaAsuransi,
                    }
                })
                return registrasi
            }
            else {
                const count = await tx.pendaftaran.count({
                    where: {
                        AND: [
                            { createdAt: { gte: today } },
                            { createdAt: { lt: tomorrow } },
                        ],
                        episodePendaftaranId: lastEpisode[0].id,
                    },
                })
                if (count > 0) {
                    const registrasi = await tx.pendaftaran.create({
                        data: {
                            episodePendaftaranId: lastEpisode[0].id,
                            jadwalDokterId: form.jadwalDokterId,
                            penjamin: form.penjamin,
                            namaAsuransi: form.namaAsuransi,
                        }
                    })
                    return registrasi
                } else {

                    const episodeBaru = await tx.episodePendaftaran.create({
                        data: {
                            pasienId: form.pasienId,
                            episode: lastEpisode[0].episode + 1
                        }
                    })
                    const registrasi = await tx.pendaftaran.create({
                        data: {
                            episodePendaftaranId: episodeBaru.id,
                            jadwalDokterId: form.jadwalDokterId,
                            penjamin: form.penjamin,
                            namaAsuransi: form.namaAsuransi,
                        }
                    })
                    return registrasi
                }

            }
        })
        revalidatePath(`/klinik/pasien/registrasi/${form.pasienId}`)
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