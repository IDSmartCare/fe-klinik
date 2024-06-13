'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { typeFormDokter } from "./interface/typeFormDokter"

const columHelper = createColumnHelper<typeFormDokter>()
const onChange = async (e: any, id: any) => {
    try {
        const fetchBody = await fetch('/api/paramedis/updatedokter', {
            method: "POST",
            body: JSON.stringify({ status: e.target.checked, id }),
            headers: {
                "conten-type": "application/json"
            }
        })
        const res = await fetchBody.json()
        if (res.id) {
            ToastAlert({ icon: 'success', title: "Ok" })
        } else {
            ToastAlert({ icon: 'error', title: "Error" })
        }

    } catch (error: any) {
        ToastAlert({ icon: 'error', title: error.message })
    }
}

const DokterTableColumn = [
    columHelper.accessor(row => row.kodeDokter, {
        cell: info => info.getValue(),
        header: "Kode Dokter"
    }),
    columHelper.accessor(row => row.namaDokter, {
        cell: info => info.getValue(),
        header: "Nama Dokter"
    }),
    columHelper.accessor(row => row.poliKlinik?.namaPoli, {
        cell: info => info.getValue(),
        header: "Poliklinik"
    }),
    columHelper.accessor(row => [row.isAktif, row.id], {
        cell: info => <input type="checkbox" onChange={(e) => onChange(e, info.getValue()[1])} className="toggle toggle-primary" defaultChecked={info.getValue()[0] ? true : false} />,
        header: "Status"
    }),
]

export default DokterTableColumn