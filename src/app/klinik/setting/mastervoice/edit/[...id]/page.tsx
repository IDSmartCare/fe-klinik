import React from "react";
import FormEditVoice from "../../pageclient/FormEditVoice";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";

const getData = async (id: string, idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/setting/detailvoice/${id}/${idFasyankes}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        cache: "no-cache",
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

const PageEditVoice = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);
  const data = await getData(params.id, session?.user.idFasyankes);
  console.log(data);

  return <FormEditVoice data={data} session={session} />;
};

export default PageEditVoice;
