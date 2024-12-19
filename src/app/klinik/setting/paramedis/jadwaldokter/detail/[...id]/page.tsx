import React from "react";
import AlertHeaderComponent from "../../../components/AlertHeaderComponent";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import DetailJadwalDokterColumn from "../../DetailJadwalDokterColumn";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import ButtonDetailJadwal from "../../pageclient/ButtonDetailJadwal";
import ModalEditJadwal from "../../pageclient/ModalEditJadwal";

const getData = async (idFasyankes: string, id: number) => {
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
    const data = await getapi.json();

    const doctorSchedule = data.find((item: any) => item.id === id);

    if (!doctorSchedule) {
      console.error(`No schedule found for id: ${id}`);
      return [];
    }

    return doctorSchedule;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const DetailJadwalDokter = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);
  const data = await getData(session?.user.idFasyankes, Number(params.id));
  return (
    <div className="flex flex-col gap-2">
      <AlertHeaderComponent message="Detail Jadwal Dokter" />
      <ButtonDetailJadwal session={session} dataJadwal={data} />
      <TableFilterComponent
        rowsData={data.schedule}
        columnsData={DetailJadwalDokterColumn}
      />
      <ModalEditJadwal
        session={session}
        dataJadwal={data}
        availableDay={data.schedule}
      />
    </div>
  );
};

export default DetailJadwalDokter;
