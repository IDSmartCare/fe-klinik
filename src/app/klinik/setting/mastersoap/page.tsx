import React from "react";
import AlertHeaderComponent from "../paramedis/components/AlertHeaderComponent";
import FormAddSOAP from "./pageclient/FormAddSOAP";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import MasterSOAPColumn from "./MasterSOAPColumn";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import ModalEdit from "./pageclient/ModalEditPertanyaan";

const getSOAP = async (idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/soap/all/${idFasyankes}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );
    if (!getapi.ok) {
      return [];
    }
    return getapi.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const MasterSOAP = async () => {
  const session = await getServerSession(authOption);
  const data = await getSOAP(session?.user.idFasyankes);

  return (
    <>
      <AlertHeaderComponent message="Master SOAP" />
      <FormAddSOAP session={session} />
      <TableFilterComponent rowsData={data} columnsData={MasterSOAPColumn} />
    </>
  );
};

export default MasterSOAP;
