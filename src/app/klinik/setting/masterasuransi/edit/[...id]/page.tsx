import { authOption } from "@/auth";
import { getServerSession } from "next-auth";
import React from "react";
import FormEditAsuransi from "../../pageclient/FormEditAsuransi";

const getDetailAsuransi = async (id: string, idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/masterasuransi/${id}/${idFasyankes}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );
    if (!getapi.ok) {
      return [];
    }
    const data = await getapi.json();
    const newData = data.data;
    return newData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const EditAsuransi = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);
  const data = await getDetailAsuransi(params.id, session?.user.idFasyankes);

  return <FormEditAsuransi data={data} session={session} />;
};

export default EditAsuransi;
