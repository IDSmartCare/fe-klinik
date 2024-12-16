"use server";

import prisma from "@/db";

export async function getBillingDetail(billingId: number) {
  try {
    const post = await prisma.billPasien.findFirst({
      include: {
        pembayaranBill: true,
        billPasienDetail: true,
        Pendaftaran: {
          include: {
            episodePendaftaran: {
              include: {
                pasien: true,
              },
            },
          },
        },
      },
      where: {
        id: billingId,
      },
    });
    return {
      status: true,
      message: "Berhasil",
      data: post,
    };
  } catch (error) {
    return {
      status: false,
      message: error,
      data: "null",
    };
  }
}
