"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { FormAddUser } from "../interface/typeFormUser";

export async function createUser(form: FormAddUser, idFasyankes: string) {
  try {
    const postData = await prisma.profile.create({
      data: {
        namaLengkap: form.namaLengkap,
        profesi: form.role.value.toUpperCase(),
        kodeDokter: form?.kodedokter ?? null,
        unit: form.role.value.toUpperCase(),
        poliKlinikId: Number(form.poliklinik?.value) || null,
        idFasyankes,
        str: form.str,
        sip: form.sip,
      },
    });
    revalidatePath("/klinik/setting/userlogin");
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

export async function deleteUser(profileId: string) {
  try {
    await prisma.profile.delete({
      where: {
        id: Number(profileId),
      },
    });
    revalidatePath("/klinik/setting/userlogin");
    return {
      status: true,
      message: "User berhasil dihapus",
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: error,
    };
  }
}

export async function checkUserExistsByRole(role: string, idFasyankes: string) {
  const existingUser = await prisma.profile.count({
    where: {
      profesi: role.toUpperCase(),
      unit: role.toUpperCase(),
      idFasyankes,
    },
  });
  return existingUser;
}
