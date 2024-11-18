import { authOption } from "@/auth";
import { getServerSession } from "next-auth";
import React from "react";
import FormEditAsuransi from "../../pageclient/FormEditAsuransi";

const EditAsuransi = async ({ params }: { params: { id: string } }) => {
    // const data = await getJadwalDokter(params.id);
  const session = await getServerSession(authOption);
  return <FormEditAsuransi data={params.id} session={session} />;
};

export default EditAsuransi;
