'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { typeFormPoliklinik } from "./interface/typeFormPoliklinik"
import { ToastAlert } from "@/app/helper/ToastAlert"

const columHelper = createColumnHelper<typeFormPoliklinik>()
const onChange = async (e: any, id: any) => {
    try {
        const fetchBody = await fetch('/api/paramedis/updatepoli', {
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

const PoliTableColumn = [
    columHelper.accessor(row => row.kodePoli, {
        cell: info => info.getValue(),
        header: "Kode Poli"
    }),
    columHelper.accessor(row => row.namaPoli, {
        cell: info => info.getValue(),
        header: "Nama Poli"
    }),
    columHelper.accessor(row => [row.isAktif, row.id], {
        cell: info => <input type="checkbox" onChange={(e) => onChange(e, info.getValue()[1])} className="toggle toggle-xs toggle-primary" defaultChecked={info.getValue()[0] ? true : false} />,
        header: "Status"
    }),
]

export default PoliTableColumn