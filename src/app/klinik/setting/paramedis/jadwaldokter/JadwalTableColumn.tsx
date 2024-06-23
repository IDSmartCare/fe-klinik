'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { typeFormJadwal } from "./interface/typeFormJadwal"

const columHelper = createColumnHelper<typeFormJadwal>()
const onChange = async (e: any, id: any) => {
    try {
        const fetchBody = await fetch('/api/paramedis/updatejadwal', {
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

const JadwalTableColumn = [
    columHelper.accessor(row => row.hari, {
        cell: info => info.getValue(),
        header: "Hari"
    }),
    columHelper.accessor(row => row.dokter?.namaLengkap, {
        cell: info => info.getValue(),
        header: "Dokter"
    }),
    columHelper.accessor(row => row.dokter?.poliklinik.namaPoli, {
        cell: info => info.getValue(),
        header: "Poli"
    }),
    columHelper.accessor(row => row.jamPraktek, {
        cell: info => info.getValue(),
        header: "Jam Praktek"
    }),
    columHelper.accessor(row => [row.isAktif, row.id], {
        cell: info => <input type="checkbox" onChange={(e) => onChange(e, info.getValue()[1])} className="toggle toggle-xs toggle-primary" defaultChecked={info.getValue()[0] ? true : false} />,
        header: "Status"
    }),
]

export default JadwalTableColumn