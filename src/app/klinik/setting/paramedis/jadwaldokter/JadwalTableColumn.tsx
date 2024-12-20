"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { typeFormJadwal } from "./interface/typeFormJadwal";
import Link from "next/link";
const columHelper = createColumnHelper<any>();

const JadwalTableColumn = [
  columHelper.accessor((row) => row.name, {
    cell: (info) => info.getValue(),
    header: "Dokter",
  }),
  columHelper.accessor((row) => row.unit, {
    cell: (info) => info.getValue(),
    header: "Poli",
  }),

  columHelper.accessor((row) => row.id, {
    cell: (info) =>
      info.row.original.schedule.length > 0 && (
        <div className="flex gap-2 justify-center">
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
