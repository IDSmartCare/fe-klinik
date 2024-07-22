'use server'

import prisma from "@/db"
import { ListResepInterface } from "./interface/typeListResep"
import { revalidatePath } from "next/cache"

export async function addTransaksiObat(form: ListResepInterface[] | undefined, pendaftaranId: number, soapId: number) {
    try {
        if (form) {

            const post = await prisma.$transaction(async (tx) => {
                const bill = await tx.billPasien.findFirst({
                    where: {
                        pendaftaranId: Number(pendaftaranId)
                    }
                })

                const list: any = form.map(item => {
                    return {
                        deskripsi: item?.namaObat,
                        subTotal: item?.total?.toString(),
                        jenisBill: 'OBAT',
                        harga: item.hargaJual,
                        jumlah: item.jumlah,
                        billPasienId: bill?.id
                    }
                })
                await tx.billPasienDetail.createMany({
                    data: list
                })

                await tx.sOAP.update({
                    data: {
                        isBillingFarmasi: true
                    },
                    where: {
                        id: Number(soapId)
                    }
                })

                return bill


            })
            revalidatePath(`/klinik/farmasi`)
            return {
                status: true,
                message: "Berhasil tersimpan",
                data: post
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error,
            data: "null"
        }
    }
}