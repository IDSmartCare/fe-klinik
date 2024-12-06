"use server";

import prisma from "@/db";

export async function getBillingPasien(pendaftaranId: number) {
  try {
    const getDb = await prisma.billPasien.findFirst({
      where: {
        pendaftaranId: Number(pendaftaranId),
      },
      include: {
        billPasienDetail: true,
        Pendaftaran: true,
      },
    });
    return {
      status: true,
      message: "Berhasil",
      data: getDb,
    };
  } catch (error) {
    return {
      status: false,
      message: error,
      data: "null",
    };
  }
}
