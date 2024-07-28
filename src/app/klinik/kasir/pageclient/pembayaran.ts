'use server'

import prisma from "@/db"
import { revalidatePath } from "next/cache"

export async function actionPembayaran(billId: number, pendaftaranId: number, totalBayar: number,
    totalBill: number, totalDiskon: number, totalPajak: number) {
    try {
        const post = await prisma.$transaction(async (tx) => {
            const payment = await tx.pembayaranPasien.create({
                data: {
                    billPasienId: billId,
                    tglBayar: new Date(),
                    totalBayar: totalBayar.toString(),
                    totalDiskon: totalDiskon.toString(),
                    totalPajak: totalPajak.toString()
                }
            })
            await tx.billPasien.update({
                where: {
                    id: billId
                },
                data: {
                    totalBill: totalBill.toString(),
                    status: "LUNAS"
                }
            })
            await tx.pendaftaran.update({
                where: {
                    id: pendaftaranId
                },
                data: {
                    isClose: true
                }
            })
            return payment
        })
        revalidatePath(`/klinik/kasir/detail/${pendaftaranId}`)
        return {
            status: true,
            message: "Berhasil tersimpan",
            data: post
        }
    } catch (error) {
        return {
            status: false,
            message: error,
            data: "null"
        }
    }
}