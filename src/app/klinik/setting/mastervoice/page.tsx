import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "../paramedis/components/AlertHeaderComponent";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import ModalAddVoice from "./pageclient/ModalAddVoice";
import VoiceTableColumn from "./VoiceTableColumn";

const getVoice = async (idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/setting/voicepoli/${idFasyankes}`,
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

const MasterVoice = async () => {
  const session = await getServerSession(authOption);
  const voice = await getVoice(session?.user.idFasyankes);

  return (
    <>
      <AlertHeaderComponent message="List Master Voice" />
      <ModalAddVoice session={session} />
      <TableFilterComponent rowsData={voice} columnsData={VoiceTableColumn} />
    </>
  );
};

export default MasterVoice;
