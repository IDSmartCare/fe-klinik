import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import ModalAddJadwal from "./pageclient/ModalAddJadwal";
import JadwalTableColumn from "./JadwalTableColumn";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import JadwalTableColumnTester from "./JadwalTableColumnTester";

const getData = async (idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/dokter/jadwaldokter/${idFasyankes}`,
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

const PageMasterJadwalDokter = async () => {
  const session = await getServerSession(authOption);
  const data = await getData(session?.user.idFasyankes);

  return (
    <>
      <AlertHeaderComponent message="List Jadwal Dokter" />
      <ModalAddJadwal session={session} />

      {session?.user.role === "tester" ? (
        <TableFilterComponent
          rowsData={data}
          columnsData={JadwalTableColumnTester}
        />
      ) : (
        <TableFilterComponent rowsData={data} columnsData={JadwalTableColumn} />
      )}
    </>
  );
};

export default PageMasterJadwalDokter;
