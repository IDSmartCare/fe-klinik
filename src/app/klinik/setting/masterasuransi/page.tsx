import React from "react";
import AlertHeaderComponent from "../paramedis/components/AlertHeaderComponent";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import MasterAsuransiColumn from "./MasterAsuransiColumn";
import ModalAddAsuransi from "./pageclient/ModalAddAsuransi";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";

const getData = async (idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/masterasuransi/${idFasyankes}`,
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
const MasterAsuransi = async () => {
  const session = await getServerSession(authOption);
  const data = await getData(session?.user.idFasyankes);

  return (
    <>
      <AlertHeaderComponent message="Master Asuransi" />
      <ModalAddAsuransi session={session} />
      <TableFilterComponent
        rowsData={data}
        columnsData={MasterAsuransiColumn}
      />
    </>
  );
};

export default MasterAsuransi;
