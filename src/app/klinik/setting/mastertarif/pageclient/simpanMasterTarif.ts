"use server";
import prisma from "@/db";
import { AddMasterTarif } from "../interface/typeFormAddTarif";
import { revalidatePath } from "next/cache";

export async function createTarif(form: AddMasterTarif, idFasyankes: string) {
  try {
    const postData = await prisma.masterTarif.create({
      data: {
        namaTarif: form.namaTarif,
        kategoriTarif: form.kategoriTarif.value,
        hargaTarif: form.hargaTarif,
        penjamin: form.penjamin.value.toString(),
        idFasyankes: idFasyankes,
        isAktif: true,
      },
    });
    revalidatePath("/klinik/setting/mastertarif");
    return {
      status: true,
      message: "Berhasil tersimpan",
      data: postData,
    };
  } catch (error) {
    console.log(error);

    return {
      status: false,
      message: error,
      data: null,
    };
  }
}
