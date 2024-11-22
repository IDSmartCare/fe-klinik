"use client";

import { createColumnHelper } from "@tanstack/table-core";
import { ToastAlert } from "@/app/helper/ToastAlert";
// import { typeFormMasterSOAP } from "./interface/typeFormMasterSOAP";
import Link from "next/link";
import { format } from "date-fns";

const columHelper = createColumnHelper<any>();

const MasterSOAPColumn = [
  columHelper.accessor((row) => row.category, {
    cell: (info) => info.getValue(),
    header: "Kategori SOAP",
  }),
  columHelper.accessor((row) => row.question, {
    cell: (info) => info.getValue(),
    header: "Pertanyaan",
  }),

  columHelper.accessor(
    (row) => {
      const capitalizeWords = (str: string) =>
        str.replace(/\b\w/g, (char) => char.toUpperCase());

      return capitalizeWords(row.questionType);
    },
    {
      cell: (info) => info.getValue(),
      header: "Tipe Pertanyaan",
    }
  ),
  columHelper.accessor((row) => row.createdAt, {
    cell: (info) => format(info.getValue(), "dd/MM/yyyy HH:mm"),
    header: "Dibuat tanggal",
  }),
  columHelper.accessor(
    (row) => {
      const capitalizeWords = (str: string) =>
        str.replace(/\b\w/g, (char) => char.toUpperCase());

      return capitalizeWords(row.createdBy);
    },
    {
      cell: (info) => info.getValue(),
      header: "Dibuat oleh",
    }
  ),

  columHelper.accessor((row) => row.id, {
    cell: (info) => {
      const rowData = info.row.original.questionType;
      const category = info.row.original.category;
      const formattedCategory = category.replace(/\s+/g, "-");
      const shouldShowTambahJawaban =
        rowData !== "number" && rowData !== "date";

      return (
        <div className="flex gap-2 justify-center">
          <div className="tooltip" data-tip="Ubah Pertanyaan">
            <Link
              className="btn btn-outline btn-success btn-circle btn-xs"
              href={`/klinik/setting/mastersoap/add/${info.getValue()}`}
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
          {shouldShowTambahJawaban && (
            <div className="tooltip" data-tip="Tambah Jawaban">
              <Link
                className="btn btn-outline btn-info btn-circle btn-xs"
                href={`/klinik/setting/mastersoap/add/${info.getValue()}?category=${category}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12H18M12 6V18"
                    stroke="#7e38ff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
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

export default MasterSOAPColumn;
