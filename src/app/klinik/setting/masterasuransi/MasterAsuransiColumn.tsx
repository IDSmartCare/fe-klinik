"use client";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { createColumnHelper } from "@tanstack/table-core";
import { format } from "date-fns";
import Link from "next/link";
import Swal from "sweetalert2";
const columHelper = createColumnHelper<any>();

const onDeleteData = async (id: string, idFasyankes: string) => {
  Swal.fire({
    title: "Apakah anda yakin?",
    text: "Data yang terhapus tidak bisa di kembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Tidak",
    confirmButtonText: "Ya, Hapus!",
  }).then(async (result: any) => {
    if (result.isConfirmed) {
      try {
        const fetchBody = await fetch(
          `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/masterasuransi/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
            body: JSON.stringify({ idFasyankes }),
          }
        );
        const res = await fetchBody.json();
        if (res) {
          ToastAlert({ icon: "success", title: "Ok, silahkan refresh!" });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          ToastAlert({ icon: "error", title: res });
        }
      } catch (error: any) {
        ToastAlert({ icon: "error", title: error.message });
      }
    }
  });
};

const MasterAsuransiColumn = [
  columHelper.accessor((row) => row.kodeAsuransi, {
    cell: (info) => info.getValue(),
    header: "id Asuransi",
  }),
  columHelper.accessor((row) => row.namaAsuransi, {
    cell: (info) => info.getValue(),
    header: "Nama Asuransi",
  }),
  columHelper.accessor((row) => row.alamat, {
    cell: (info) => info.getValue(),
    header: "Alamat",
  }),
  columHelper.accessor((row) => row.namaPic, {
    cell: (info) => info.getValue(),
    header: "Nama PIC",
  }),
  columHelper.accessor((row) => row.picEmail, {
    cell: (info) => info.getValue(),
    header: "PIC Email",
  }),
  columHelper.accessor((row) => row.picPhone, {
    cell: (info) => info.getValue(),
    header: "Nomor Telepon PIC",
  }),
  columHelper.accessor(
    (row) =>
      `${format(new Date(row.from), "dd/MM/yyyy")} - ${format(
        new Date(row.to),
        "dd/MM/yyyy"
      )}`,
    {
      cell: (info) => info.getValue(),
      header: "Tanggal Kerjasama",
    }
  ),
  columHelper.accessor((row) => row.id, {
    cell: (info) => (
      <div className="flex gap-2 justify-center">
        <div data-tip="Edit Asuransi" className="tooltip">
          <Link
            href={`/klinik/setting/masterasuransi/edit/${info.getValue()}`}
            className="btn btn-circle btn-info btn-xs"
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
        <div data-tip="Hapus Asuransi" className="tooltip">
          <button
            className="btn btn-circle btn-error btn-xs"
            onClick={() =>
              onDeleteData(info.getValue(), info.row.original.idFasyankes)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    ),
    header: "Aksi",
  }),
];

export default MasterAsuransiColumn;
