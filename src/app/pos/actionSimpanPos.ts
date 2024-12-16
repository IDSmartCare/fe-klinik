"use server";

import prisma from "@/db";
import { DataInvoice, PembelianInterface } from "./interface/postInterface";
import { revalidatePath } from "next/cache";

export default async function simpanPOS(
  pembelian: PembelianInterface[],
  dataInvoice: DataInvoice | undefined,
  idFasyankes: string | undefined,
  packageType: string
) {
  try {
    if (packageType === "FREE") {
      const transactionCount = await prisma.transaksiPOS.count({
        where: { idFasyankes },
      });
      if (transactionCount >= 10) {
        return {
          status: false,
          message: "Transaksi untuk paket FREE sudah mencapai batas.",
          data: null,
        };
      }
    }

    const transaksi = await prisma.$transaction(async (tx) => {
      const postToTransaksiPos = await tx.transaksiPOS.create({
        data: {
          groupTransaksiId: dataInvoice?.groupTransaksiId as string,
          biayaLainnya: dataInvoice?.biayaLainnya,
          diskonInvoice: dataInvoice?.diskonInvoice,
          emailPelanggan: dataInvoice?.emailPelanggan,
          hpPelanggan: dataInvoice?.hpPelanggan,
          namaPelanggan: dataInvoice?.namaPelanggan,
          kategoriBayar: dataInvoice?.kategoriBayar,
          pajak: dataInvoice?.pajak,
          subTotal: dataInvoice?.subTotal,
          total: dataInvoice?.total,
          totalBayar: dataInvoice?.totalBayar,
          idFasyankes,
        },
      });

      const listBody = pembelian.map((item) => ({
        barangId: item.barang_id,
        namaBarang: item.nama_barang,
        hargaJual: item.harga_jual,
        diskonFromBo: item.diskonFromBo.toString(),
        hargaSetelahDiskon: (
          Number(item.harga_jual) - Number(item.diskonFromBo)
        ).toString(),
        qty: item.qty,
        transaksiPOSId: postToTransaksiPos.groupTransaksiId,
      }));

      await tx.transaksiPOSDetail.createMany({
        data: listBody,
      });
      return postToTransaksiPos;
    });

    revalidatePath("/pos");

    return {
      status: true,
      message: "Berhasil",
      data: transaksi,
    };
  } catch (error) {
    return {
      status: false,
      message: error,
      data: null,
    };
  }
}
