import React from "react";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import FormEditAnswer from "../../pageclient/FormEditAnswer";

const getData = async (id: string, endPoint: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/${endPoint}/detail/${id}`,
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
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const EditJawaban = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { category: string };
}) => {
  const category = searchParams.category || "";
  const newEndpoint = `${category}-answer`.toLowerCase();
  const session = await getServerSession(authOption);
  const data = await getData(params.id, newEndpoint);


  return (
    <FormEditAnswer
      data={data}
      session={session}
      alertTitle="Edit Jawaban"
      title="Jawaban"
      endPoint={newEndpoint}
    />
  );
};

export default EditJawaban;
