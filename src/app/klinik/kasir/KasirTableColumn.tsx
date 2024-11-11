"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { format } from "date-fns";
import Link from "next/link";
import { EpisodePasien } from "./interface/typeListPasien";

const columHelper = createColumnHelper<EpisodePasien>();

const KasirTableCoulumn = [
  columHelper.accessor((row) => row.pasien.noRm, {
    cell: (info) => info.getValue(),
    header: "No. Rekam Medis",
  }),
  columHelper.accessor((row) => row.pasien.namaPasien, {
    cell: (info) => info.getValue(),
    header: "Nama",
  }),
  columHelper.accessor((row) => row.pasien.jenisKelamin, {
    cell: (info) => info.getValue(),
    header: "Jenis Kelamin",
  }),
  columHelper.accessor((row) => row.createdAt, {
    cell: (info) => format(info.getValue(), "dd/MM/yyyy HH:mm"),
    header: "Jam Regis",
  }),
  columHelper.accessor((row) => [row.pasienId, row.id], {
    cell: (info) => (
      <div className="flex gap-1 justify-center">
        <div className="tooltip tooltip-left" data-tip="Pembayaran">
          <Link
            className="btn btn-outline btn-success btn-circle btn-xs"
            href={`/klinik/kasir/billing/${info.getValue()[0]}/${
              info.getValue()[1]
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path d="M6.375 5.5h.875v1.75h-.875a.875.875 0 1 1 0-1.75ZM8.75 10.5V8.75h.875a.875.875 0 0 1 0 1.75H8.75Z" />
              <path
                fillRule="evenodd"
                d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM7.25 3.75a.75.75 0 0 1 1.5 0V4h2.5a.75.75 0 0 1 0 1.5h-2.5v1.75h.875a2.375 2.375 0 1 1 0 4.75H8.75v.25a.75.75 0 0 1-1.5 0V12h-2.5a.75.75 0 0 1 0-1.5h2.5V8.75h-.875a2.375 2.375 0 1 1 0-4.75h.875v-.25Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    ),
    header: "Aksi",
  }),
];

export default KasirTableCoulumn;
