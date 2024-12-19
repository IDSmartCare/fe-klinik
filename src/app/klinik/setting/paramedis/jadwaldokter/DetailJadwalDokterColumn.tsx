"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { ToastAlert } from "@/app/helper/ToastAlert";
import Swal from "sweetalert2";

const onDeleteData = async (id: string) => {
  Swal.fire({
    title: "Apakah anda yakin?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Tidak",
    confirmButtonText: "Ya, Hapus!",
  }).then(async (result: any) => {
    if (result.isConfirmed) {
      try {
        const fetchBody = await fetch("/api/dokter/jadwaldokter/hapusjadwal", {
          method: "DELETE",
          body: JSON.stringify({ id }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = await fetchBody.json();
        if (res) {
          ToastAlert({ icon: "success", title: "Berhasil" });
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

const columnHelper = createColumnHelper<any>();

const DetailJadwalDokterColumn = [
  columnHelper.accessor((row) => row.day, {
    cell: (info) => info.getValue(), // Menampilkan hari
    header: "Hari",
  }),
  columnHelper.accessor((row) => row.times, {
    cell: (info) => {
      const times = info.getValue();
      return times.length > 0
        ? times.map((time: any) => (
            <div
              key={`${time.from}-${time.to}`}
            >{`${time.from} - ${time.to}`}</div>
          ))
        : "-";
    },
    header: "Jam Praktek",
  }),
  columnHelper.accessor((row) => row.slot, {
    cell: (info) => (info.getValue() ? `${info.getValue()} Menit` : "-"),
    header: "Sesi perhari",
  }),
  columnHelper.accessor((row) => row.id, {
    cell: (info) => {
      return (
        <div className="flex gap-2 justify-center">
          <div className="tooltip" data-tip="Ubah Keyword">
            <button
              className="btn btn-outline btn-success btn-circle btn-xs"
              onClick={() => {
                const modal: any = document.getElementById("edit-jadwal");
                modal.setAttribute("data-id", info.getValue());
                modal.showModal();
              }}
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
            </button>
          </div>
          <div className="tooltip" data-tip="Hapus Jadwal">
            <button
              className="btn btn-circle btn-outline btn-error btn-xs"
              onClick={() => onDeleteData(info.getValue())}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
              >
                <path
                  d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                  stroke="#e82121"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      );
    },
    header: "Aksi",
  }),
];

export default DetailJadwalDokterColumn;
