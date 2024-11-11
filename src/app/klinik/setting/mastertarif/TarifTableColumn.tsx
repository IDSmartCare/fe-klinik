"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { ListTarifInterface } from "./interface/listTarif";
import Link from "next/link";
import { formatRupiah } from "@/app/helper/formatRupiah";

const columHelper = createColumnHelper<ListTarifInterface>();

const TarifTableColumn = [
  columHelper.accessor((row) => row.namaTarif, {
    cell: (info) =>
      info.getValue().charAt(0).toUpperCase() +
      info.getValue().slice(1).toLowerCase(),
    header: "Tarif",
  }),
  columHelper.accessor((row) => row.kategoriTarif, {
    cell: (info) =>
      info.getValue().charAt(0).toUpperCase() +
      info.getValue().slice(1).toLowerCase(),
    header: "Kategori",
  }),
  columHelper.accessor((row) => row.hargaTarif, {
    cell: (info) => formatRupiah(info.getValue()),
    header: "Nominal",
  }),
  columHelper.accessor((row) => row.penjamin, {
    cell: (info) => info.getValue().toUpperCase(),
    header: "Penjamin",
  }),

  columHelper.accessor((row) => row.id, {
    cell: (info) => (
      <div className="tooltip" data-tip="Edit Tarif">
        <Link
          className="btn btn-outline btn-success btn-circle btn-xs"
          href={`/klinik/setting/mastertarif/edit/${info.getValue()}`}
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
    ),
    header: "Edit",
  }),
];

export default TarifTableColumn;
