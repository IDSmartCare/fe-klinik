'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { typeFormPoliklinik } from "./interface/typeFormPoliklinik"

const columHelper = createColumnHelper<typeFormPoliklinik>()

const PoliTableColumnTester = [
    columHelper.accessor(row => row.kodePoli, {
        cell: info => info.getValue(),
        header: "Kode Poli"
    }),
    columHelper.accessor(row => row.namaPoli, {
        cell: info => info.getValue(),
        header: "Nama Poli"
    }),
]

export default PoliTableColumnTester