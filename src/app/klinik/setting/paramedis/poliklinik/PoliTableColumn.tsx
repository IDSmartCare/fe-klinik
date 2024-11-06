"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { typeFormPoliklinik } from "./interface/typeFormPoliklinik";
import { ToastAlert } from "@/app/helper/ToastAlert";
import Swal from "sweetalert2";
import Link from "next/link";

const columHelper = createColumnHelper<typeFormPoliklinik>();
const onChange = async (e: any, id: any) => {
  try {
    const fetchBody = await fetch("/api/paramedis/updatepoli", {
      method: "POST",
      body: JSON.stringify({ status: e.target.checked, id }),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await fetchBody.json();
    if (res.id) {
      ToastAlert({ icon: "success", title: "Ok, silahkan di refresh!" });
    } else {
      ToastAlert({ icon: "error", title: "Error" });
    }
  } catch (error: any) {
    ToastAlert({ icon: "error", title: error.message });
  }
};

const onDeleteData = async (id: any) => {
  Swal.fire({
    title: "Are you sure?",
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
        const fetchBody = await fetch("/api/paramedis/hapuspoli", {
          method: "DELETE",
          body: JSON.stringify({ id }),
          headers: {
            "conten-type": "application/json",
          },
        });
        const res = await fetchBody.json();
        if (res.id) {
          ToastAlert({ icon: "success", title: "Ok, silahkan refresh!" });
        } else {
          ToastAlert({ icon: "error", title: res });
        }
      } catch (error: any) {
        ToastAlert({ icon: "error", title: error.message });
      }
    }
  });
};

const PoliTableColumn = [
  columHelper.accessor((row) => row.kodePoli, {
    cell: (info) => info.getValue(),
    header: "Kode Poli",
  }),
  columHelper.accessor((row) => row.namaPoli, {
    cell: (info) => info.getValue(),
    header: "Nama Poli",
  }),
  columHelper.accessor((row) => [row.isAktif, row.id], {
    cell: (info) => (
      <input
        type="checkbox"
        onChange={(e) => onChange(e, info.getValue()[1])}
        className="toggle toggle-xs toggle-primary"
        defaultChecked={info.getValue()[0] ? true : false}
      />
    ),
    header: "Status",
  }),
  columHelper.accessor((row) => row.id, {
    cell: (info) => (
      <div className="flex gap-2 justify-center">
        <div data-tip="Hapus Poli" className="tooltip">
          <button
            className="btn btn-circle btn-error btn-xs"
            onClick={() => onDeleteData(info.getValue())}
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
        <div data-tip="Edit Poli" className="tooltip">
          <Link
          href={`/klinik/setting/paramedis/poliklinik/edit/${info.getValue()}`}
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
      </div>
    ),
    header: "Aksi",
  }),
];

export default PoliTableColumn;
