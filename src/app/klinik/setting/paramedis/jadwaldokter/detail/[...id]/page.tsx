import React from "react";
import AlertHeaderComponent from "../../../components/AlertHeaderComponent";
import Link from "next/link";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import DetailJadwalDokterColumn from "../../DetailJadwalDokterColumn";
import { processDataDoctorsSchedule } from "@/app/helper/JadwalDokterHelper";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";

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
    }

    return [doctorSchedule];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const DetailJadwalDokter = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);
  const data = await getData(session?.user.idFasyankes, Number(params.id));
  const formatSchedule = processDataDoctorsSchedule(data);
  return (
    <div className="flex flex-col gap-2">
      <AlertHeaderComponent message="Detail Jadwal Dokter" />
      <div className="mb-[-50px] z-[9999] flex gap-3">
        <Link
          href={"/klinik/setting/paramedis/jadwaldokter"}
          className=" w-max"
        >
          <button className="btn btn-sm btn-primary text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z"
                clipRule="evenodd"
              />
            </svg>
            Kembali
          </button>
        </Link>
        <button className="btn btn-success btn-sm text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z"
              clipRule="evenodd"
            />
          </svg>
          Tambah/Edit Jadwal
        </button>
      </div>
      <TableFilterComponent
        rowsData={formatSchedule}
        columnsData={DetailJadwalDokterColumn}
      />
    </div>
  );
};

export default DetailJadwalDokter;
