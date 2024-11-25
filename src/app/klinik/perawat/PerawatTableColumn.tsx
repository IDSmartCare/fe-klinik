"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { typeListTerdaftar } from "./interface/typeListTerdaftar";
import { format } from "date-fns";
import Link from "next/link";

const columHelper = createColumnHelper<any>();

const PerawatTableColumn = [
  columHelper.accessor((row) => row.episodePendaftaran.pasien.noRm, {
    cell: (info) => info.getValue(),
    header: "No. Rekam Medis",
  }),
  columHelper.accessor((row) => row.episodePendaftaran.pasien.namaPasien, {
    cell: (info) => info.getValue(),
    header: "Nama",
  }),
  columHelper.accessor((row) => row.episodePendaftaran.pasien.jenisKelamin, {
    cell: (info) => info.getValue(),
    header: "Jenis Kelamin",
  }),
  columHelper.accessor((row) => row.penjamin, {
    cell: (info) => info.getValue(),
    header: "Penjamin",
  }),
  columHelper.accessor((row) => row.doctor.name, {
    cell: (info) => info.getValue(),
    header: "Dokter",
  }),
  columHelper.accessor((row) => row.createdAt, {
    cell: (info) => format(info.getValue(), "dd/MM/yyyy-HH:mm"),
    header: "Jam Regis",
  }),

  columHelper.accessor((row) => row.isSoapPerawat, {
    cell: (info) =>
      info.getValue() && (
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
    header: "SOAP",
  }),

  columHelper.accessor((row) => [row.id, row.episodePendaftaran.pasien.id], {
    cell: (info) => (
      <div className="flex gap-1 justify-center">
        <div className="tooltip" data-tip="Riwayat Pendaftaran">
          <Link
            className="btn btn-outline btn-success btn-circle btn-xs"
            href={`/klinik/pendaftaran/riwayat/${info.getValue()[1]}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Z" />
              <path
                fillRule="evenodd"
                d="M13 6H3v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6ZM8.75 7.75a.75.75 0 0 0-1.5 0v2.69L6.03 9.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.22 1.22V7.75Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <div className="tooltip" data-tip="Detail Pasien">
          <Link
            className="btn btn-outline btn-info btn-circle btn-xs"
            href={`/klinik/pasien/detail/${info.getValue()[1]}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M3 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3Zm2.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10 5.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm.75 3.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5ZM10 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 10 8Zm-2.378 3c.346 0 .583-.343.395-.633A2.998 2.998 0 0 0 5.5 9a2.998 2.998 0 0 0-2.517 1.367c-.188.29.05.633.395.633h4.244Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <div className="tooltip tooltip-left" data-tip="Tambah CPPT Baru">
          <Link
            className="btn btn-primary btn-outline btn-circle btn-xs"
            href={`/klinik/cppt/${info.getValue()[0]}/${info.getValue()[1]}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path d="M7.25 3.688a8.035 8.035 0 0 0-4.872-.523A.48.48 0 0 0 2 3.64v7.994c0 .345.342.588.679.512a6.02 6.02 0 0 1 4.571.81V3.688ZM8.75 12.956a6.02 6.02 0 0 1 4.571-.81c.337.075.679-.167.679-.512V3.64a.48.48 0 0 0-.378-.475 8.034 8.034 0 0 0-4.872.523v9.268Z" />
            </svg>
          </Link>
        </div>
        <div className="tooltip" data-tip="Panggil Antrian">
          <button
            className="btn btn-circle btn-outline btn-warning btn-xs"
            // onClick={() => onDeleteData(info.getValue())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path d="M16.881 4.345A23.112 23.112 0 0 1 8.25 6H7.5a5.25 5.25 0 0 0-.88 10.427 21.593 21.593 0 0 0 1.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.593.772-2.468a17.116 17.116 0 0 1-.628-1.607c1.918.258 3.76.75 5.5 1.446A21.727 21.727 0 0 0 18 11.25c0-2.414-.393-4.735-1.119-6.905ZM18.26 3.74a23.22 23.22 0 0 1 1.24 7.51 23.22 23.22 0 0 1-1.41 7.992.75.75 0 1 0 1.409.516 24.555 24.555 0 0 0 1.415-6.43 2.992 2.992 0 0 0 .836-2.078c0-.807-.319-1.54-.836-2.078a24.65 24.65 0 0 0-1.415-6.43.75.75 0 1 0-1.409.516c.059.16.116.321.17.483Z" />
            </svg>
          </button>
        </div>
      </div>
    ),
    header: "Aksi",
  }),
];

export default PerawatTableColumn;
