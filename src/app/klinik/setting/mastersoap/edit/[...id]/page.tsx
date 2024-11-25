import React from "react";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import FormEdit from "../../pageclient/FormEditQuestion";

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
    const newData = data.data;
    return newData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const EditPertanyaan = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { category: string };
}) => {
  const category = searchParams.category || "";
  const newEndpoint = `master-${category}`.toLowerCase();
  const session = await getServerSession(authOption);
  const data = await getData(params.id, newEndpoint);

  return (
    <FormEdit
      data={data}
      session={session}
      alertTitle="Edit Pertanyaan"
      title="Pertanyaan"
      endPoint={newEndpoint}
    />
  );
};

export default EditPertanyaan;
