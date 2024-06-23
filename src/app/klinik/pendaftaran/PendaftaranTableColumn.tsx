'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { format } from "date-fns"
import { typeListTerdaftar } from "../perawat/interface/typeListTerdaftar"

const columHelper = createColumnHelper<typeListTerdaftar>()

const PendaftaranTableCoulumn = [
    columHelper.accessor(row => row.episodePendaftaran.pasien.noRm, {
        cell: info => info.getValue(),
        header: "RM"
    }),
    columHelper.accessor(row => row.episodePendaftaran.pasien.namaPasien, {
        cell: info => info.getValue(),
        header: "Nama"
    }),
    columHelper.accessor(row => row.episodePendaftaran.pasien.jenisKelamin, {
        cell: info => info.getValue(),
        header: "JK"
    }),
    columHelper.accessor(row => row.penjamin, {
        cell: info => info.getValue(),
        header: "Penjamin"
    }),
    columHelper.accessor(row => row.jadwal.dokter.namaLengkap, {
        cell: info => info.getValue(),
        header: "Dokter"
    }),
    columHelper.accessor(row => row.createdAt, {
        cell: info => format(info.getValue(), 'dd/MM/yyyy HH:mm'),
        header: "Jam Regis"
    }),
]

export default PendaftaranTableCoulumn