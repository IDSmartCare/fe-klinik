import React from "react";
import AlertHeaderComponent from "../../../paramedis/components/AlertHeaderComponent";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import FormInputJawaban from "../../pageclient/FormInputJawaban";

const TambahJawaban = () => {
  return (
    <>
      <AlertHeaderComponent message="Tambah Jawaban" />
      <FormInputJawaban />
      <TableFilterComponent rowsData={[]} columnsData={[]} />
    </>
  );
};

export default TambahJawaban;
