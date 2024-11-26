import TableFilterComponent from "@/app/components/TableFilterComponent";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import AntrianAdmisiColumn from "./AntrianAdmisiColumn";

const getData = async (idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/listregistrasi/${idFasyankes}`,
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

const AntrianAdmisi = async () => {
  const session = await getServerSession(authOption);
  const data = await getData(session?.user.idFasyankes);

  return (
    <>
      <AlertHeaderComponent message="Antrian terdaftar hari ini" />
      <TableFilterComponent rowsData={data} columnsData={AntrianAdmisiColumn} />
    </>
  );
};

export default AntrianAdmisi;
