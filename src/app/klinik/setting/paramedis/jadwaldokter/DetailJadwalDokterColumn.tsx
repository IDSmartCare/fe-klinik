"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { ToastAlert } from "@/app/helper/ToastAlert";
import Link from "next/link";
const columHelper = createColumnHelper<any>();

const DetailJadwalDokterColumn = [
  columHelper.accessor((row) => row.days, {
    cell: (info) => info.getValue().join(", "), // Menampilkan hari dalam format yang sesuai
    header: "Hari",
  }),
  columHelper.accessor((row) => row.times, {
    cell: (info) => (
      <>
        {info
          .getValue()
          .map((slot: { from: string; to: string }, index: number) => (
            <div key={index}>
              {slot.from} - {slot.to}
            </div>
          ))}
      </>
    ),
    header: "Jam Praktek",
  }),

  columHelper.accessor((row) => row.slot, {
    cell: (info) => (info.getValue() ? info.getValue() + " Menit" : "-"),
    header: "Sesi perhari",
  }),
];

export default DetailJadwalDokterColumn;
