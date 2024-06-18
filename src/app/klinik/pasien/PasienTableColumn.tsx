'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { typeFormPasienBaru } from "./interface/typeFormPasienBaru"
import { format } from "date-fns"
import Link from "next/link"

const columHelper = createColumnHelper<typeFormPasienBaru>()
const onChange = async (e: any, id: any) => {
    try {
        const fetchBody = await fetch('/api/pasien/updatestatus', {
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

const PasienTableColumn = [
    columHelper.accessor(row => [row.noRm, row.id], {
        cell: info => <div className="tooltip" data-tip="Detail">
            <Link className="btn btn-info btn-xs" href={`/klinik/pasien/detail/${info.getValue()[1]}`}>{info.getValue()[0]}</Link>
        </div>,
        header: "RM"
    }),
    columHelper.accessor(row => row.namaPasien, {
        cell: info => info.getValue(),
        header: "Pasien"
    }),
    columHelper.accessor(row => [row.tempatLahir, row.tanggalLahir], {
        cell: info => <p>{info.getValue()[0]}, {format(new Date(info.getValue()[1]), 'dd/MM/yyyy')}</p>,
        header: "TTL"
    }),
    columHelper.accessor(row => row.jenisKelamin, {
        cell: info => info.getValue(),
        header: "JK"
    }),

    columHelper.accessor(row => row.nik, {
        cell: info => info.getValue(),
        header: "NIK"
    }),
    columHelper.accessor(row => row.bpjs, {
        cell: info => info.getValue(),
        header: "BPJS"
    }),
    columHelper.accessor(row => row.kelurahan, {
        cell: info => info.getValue(),
        header: "Alamat"
    }),
    columHelper.accessor(row => [row.isAktif, row.id], {
        cell: info => <input type="checkbox" onChange={(e) => onChange(e, info.getValue()[1])} className="toggle toggle-primary" defaultChecked={info.getValue()[0] ? true : false} />,
        header: "Status"
    }),
]

export default PasienTableColumn