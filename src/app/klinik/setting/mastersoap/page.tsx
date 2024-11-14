import React from "react";
import AlertHeaderComponent from "../paramedis/components/AlertHeaderComponent";
import FormAddSOAP from "./pageclient/FormAddSOAP";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import MasterSOAPColumn from "./MasterSOAPColumn";

const Page = () => {
  return (
    <>
      <AlertHeaderComponent message="Master SOAP" />
      <FormAddSOAP />
      <TableFilterComponent rowsData={[]} columnsData={MasterSOAPColumn} />
    </>
  );
};

export default Page;
