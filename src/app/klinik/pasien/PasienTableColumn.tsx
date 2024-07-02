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
    columHelper.accessor(row => row.noRm, {
        cell: info => info.getValue(),
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

    columHelper.accessor(row => row.noHp, {
        cell: info => info.getValue(),
        header: "HP"
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
        cell: info => <input type="checkbox" onChange={(e) => onChange(e, info.getValue()[1])} className="toggle toggle-xs toggle-primary" defaultChecked={info.getValue()[0] ? true : false} />,
        header: "Status"
    }),
    columHelper.accessor(row => row.id, {
        cell: info => <div className="flex gap-1 justify-center">
            <div className="tooltip" data-tip="Riwayat Pendaftaran">
                <Link className="btn btn-outline btn-success btn-circle btn-xs" href={`/klinik/pendaftaran/riwayat/${info.getValue()}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Z" />
                        <path fillRule="evenodd" d="M13 6H3v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6ZM8.75 7.75a.75.75 0 0 0-1.5 0v2.69L6.03 9.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.22 1.22V7.75Z" clipRule="evenodd" />
                    </svg>


                </Link>
            </div>
            <div className="tooltip" data-tip="Detail Pasien">
                <Link className="btn btn-outline btn-info btn-circle btn-xs" href={`/klinik/pasien/detail/${info.getValue()}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M3 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3Zm2.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10 5.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm.75 3.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5ZM10 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 10 8Zm-2.378 3c.346 0 .583-.343.395-.633A2.998 2.998 0 0 0 5.5 9a2.998 2.998 0 0 0-2.517 1.367c-.188.29.05.633.395.633h4.244Z" clipRule="evenodd" />
                    </svg>

                </Link>
            </div>
            <div className="tooltip" data-tip="Registrasi">
                <Link className="btn btn-primary btn-outline btn-circle btn-xs" href={`/klinik/pasien/registrasi/${info.getValue()}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>
        </div>
        ,
        header: "Aksi"
    }),
]

export default PasienTableColumn