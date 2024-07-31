'use server'

import prisma from "@/db"
import { PembelianInterface } from "./interface/postInterface"
import { revalidatePath } from "next/cache"

export default async function simpanPOS(pembelian: PembelianInterface[], nama: string, email: string, hp: string, groupId: string) {
    try {

        const listBody: any = pembelian.map(item => {
            return {
                barangId: item.barang_id,
                namaBarang: item.nama_barang,
                groupTransaksiId: groupId,
                hargaJual: item.harga_jual,
                qty: item.qty,
                subTotal: item.totalHarga.toString(),
                emailPelanggan: email ?? null,
                hpPelanggan: hp ?? null,
                namaPelanggan: nama
            }
        })
        const post = await prisma.transaksiPOS.createMany({
            data: listBody
        })
        revalidatePath("/pos")
        return {
            status: true,
            message: "Berhasil",
            data: post,
        }
    } catch (error) {
        return {
            status: false,
            message: error,
            data: "null"
        }
    }
}