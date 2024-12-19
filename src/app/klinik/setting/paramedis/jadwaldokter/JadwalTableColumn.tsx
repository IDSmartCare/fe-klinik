"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { typeFormJadwal } from "./interface/typeFormJadwal";
import Link from "next/link";
const columHelper = createColumnHelper<any>();
const onChange = async (e: any, id: any) => {
  try {
    const fetchBody = await fetch("/api/paramedis/updatejadwal", {
      method: "POST",
      body: JSON.stringify({ status: e.target.checked, id }),
      headers: {
        "conten-type": "application/json",
      },
    });
    const res = await fetchBody.json();
    if (res.id) {
      ToastAlert({ icon: "success", title: "Ok" });
    } else {
      ToastAlert({ icon: "error", title: "Error" });
    }
  } catch (error: any) {
    ToastAlert({ icon: "error", title: error.message });
  }
};

const JadwalTableColumn = [
  // columHelper.accessor((row) => row.hari, {
  //   cell: (info) => info.getValue(),
  //   header: "Hari",
  // }),
  columHelper.accessor((row) => row.name, {
    cell: (info) => info.getValue(),
    header: "Dokter",
  }),
  columHelper.accessor((row) => row.unit, {
    cell: (info) => info.getValue(),
    header: "Poli",
  }),
  // columHelper.accessor((row) => row.jamPraktek, {
  //   cell: (info) => info.getValue(),
  //   header: "Jam Praktek",
  // }),
  // columHelper.accessor((row) => [row.isAktif, row.id], {
  //   cell: (info) => (
  //     <input
  //       type="checkbox"
  //       onChange={(e) => onChange(e, info.getValue()[1])}
  //       className="toggle toggle-xs toggle-primary"
  //       defaultChecked={info.getValue()[0] ? true : false}
  //     />
  //   ),
  //   header: "Status",
  // }),
  columHelper.accessor((row) => row.slot, {
    cell: (info) => (info.getValue() ? info.getValue() + " Menit" : "-"),
    header: "Durasi Konsultasi",
  }),
  columHelper.accessor((row) => row.id, {
    cell: (info) =>
      info.row.original.schedule.length > 0 && (
        <div className="flex gap-2 justify-center">
          {/* <div className="tooltip" data-tip="Edit Jadwal Dokter">
            <Link
              className="btn btn-outline btn-success btn-circle btn-xs"
              href={`/klinik/setting/paramedis/jadwaldokter/edit/${info.getValue()}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
              </svg>
            </Link>
          </div> */}
          <div className="tooltip" data-tip="Detail Jadwal Dokter">
            <Link
              className="btn btn-outline btn-primary btn-circle btn-xs"
              href={`/klinik/setting/paramedis/jadwaldokter/detail/${info.getValue()}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 7C12.8284 7 13.5 6.32843 13.5 5.5C13.5 4.67157 12.8284 4 12 4C11.1716 4 10.5 4.67157 10.5 5.5C10.5 6.32843 11.1716 7 12 7ZM11 9C10.4477 9 10 9.44772 10 10C10 10.5523 10.4477 11 11 11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V10C13 9.44772 12.5523 9 12 9H11Z"
                    fill="#5d61d5"
                  ></path>{" "}
                </g>
              </svg>
            </Link>
          </div>
        </div>
      ),
    header: "Aksi",
  }),
];

export default JadwalTableColumn;
