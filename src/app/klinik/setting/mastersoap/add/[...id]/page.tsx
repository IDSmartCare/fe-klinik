import React from "react";
import AlertHeaderComponent from "../../../paramedis/components/AlertHeaderComponent";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import FormInputJawaban from "../../pageclient/FormInputJawaban";
import TambahJawabanColumn from "./TambahJawabanColumn";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import { useRouter } from "next/router";

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

const TambahJawaban = async ({
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
    <>
      <AlertHeaderComponent message="Tambah Jawaban" />
      <FormInputJawaban
        data={data}
        session={session}
        category={data.category}
      />
      <TableFilterComponent
        rowsData={data.keyword}
        columnsData={TambahJawabanColumn}
      />
    </>
  );
};

export default TambahJawaban;
