'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { typeFormJadwal } from "./interface/typeFormJadwal"

const columHelper = createColumnHelper<typeFormJadwal>()

const JadwalTableColumnTester = [
    columHelper.accessor(row => row.hari, {
        cell: info => info.getValue(),
        header: "Hari"
    }),
    columHelper.accessor(row => row.dokter?.namaLengkap, {
        cell: info => info.getValue(),
        header: "Dokter"
    }),
    columHelper.accessor(row => row.dokter?.poliklinik?.namaPoli, {
        cell: info => info.getValue(),
        header: "Poli"
    }),
    columHelper.accessor(row => row.jamPraktek, {
        cell: info => info.getValue(),
        header: "Jam Praktek"
    }),
]

export default JadwalTableColumnTester