"use client";

import { createColumnHelper } from "@tanstack/table-core";
import { ToastAlert } from "@/app/helper/ToastAlert";
// import { typeFormMasterSOAP } from "./interface/typeFormMasterSOAP";
import Link from "next/link";

const columHelper = createColumnHelper<any>();

const MasterSOAPColumn = [
  columHelper.accessor((row) => row.id, {
    cell: (info) => info.getValue(),
    header: "ID",
  }),
  columHelper.accessor((row) => row.soap, {
    cell: (info) => info.getValue(),
    header: "Kagetori SOAP",
  }),
  columHelper.accessor((row) => row.pertanyaan, {
    cell: (info) => info.getValue(),
    header: "Pertanyaan",
  }),
  columHelper.accessor((row) => row.createdAt, {
    cell: (info) => info.getValue(),
    header: "Created At",
  }),
  columHelper.accessor((row) => row.createdBy, {
    cell: (info) => info.getValue(),
    header: "Created By",
  }),
  columHelper.accessor((row) => row.id, {
    cell: (info) => (
      <div className="flex gap-2 justify-center">
        <div className="tooltip" data-tip="Ubah Pertanyaan">
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
        </div>
        <div className="tooltip" data-tip="Hapus Pertanyaan">
          <Link
            className="btn btn-outline btn-info btn-circle btn-xs"
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
                  d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                  stroke="#e82121"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </Link>
        </div>
        <div className="tooltip" data-tip="Tambah Jawaban">
          <Link
            className="btn btn-outline btn-info btn-circle btn-xs"
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
                  d="M6 12H18M12 6V18"
                  stroke="#7e38ff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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

export default MasterSOAPColumn;
