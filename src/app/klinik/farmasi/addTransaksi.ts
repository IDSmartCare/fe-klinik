'use server'

import prisma from "@/db"
import { ListResepInterface } from "./interface/typeListResep"

export async function addTransaksiObat(form: ListResepInterface[] | undefined, pendaftaranId: number) {
    try {
        if (form) {
            const list: any = form.map(item => {
                return {
                    deskripsi: item?.namaObat,
                    total: item?.total?.toString(),
                    jenisBill: 'OBAT',
                    pendaftaranId: Number(pendaftaranId),
                }
            })
            const post = await prisma.billPasien.createMany({
                data: list
            })
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