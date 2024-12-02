"use client";
import { createColumnHelper } from "@tanstack/table-core";
import Link from "next/link";
import { formatRupiah } from "@/app/helper/formatRupiah";

const columHelper = createColumnHelper<any>();

const VoiceTableColumn = [
  columHelper.accessor((row) => row.namaFile, {
    cell: (info) => info.getValue(),
    header: "Nama File",
  }),
  columHelper.accessor((row) => row.namaPoli, {
    cell: (info) => info.getValue(),
    header: "Nama Poli",
  }),

  columHelper.accessor((row) => row.id, {
    cell: (info) => {
      const dataFasyankes = info.row.original.idFasyankes != null;
      return (
        <div className="flex gap-2 justify-center">
          <div className="tooltip" data-tip="Putar Voice">
            <Link
              className="btn btn-outline btn-primary btn-circle btn-xs"
              href={info.row.original.url}
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z"
                  clip-rule="evenodd"
                />
              </svg>
            </Link>
          </div>
          {dataFasyankes && (
            <div className="tooltip" data-tip="Edit Voice">
              <Link
                className="btn btn-circle btn-outline btn-success btn-xs"
                href={`/klinik/setting/mastervoice/edit/${info.getValue()}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                  <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      );
    },

    header: "Aksi",
  }),
];

export default VoiceTableColumn;
