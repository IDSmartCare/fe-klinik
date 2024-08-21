'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { format } from "date-fns"
import Link from "next/link"
import { TransaksiPosInterface } from "../interface/listHistoryPos"

const columHelper = createColumnHelper<TransaksiPosInterface>()

const HistoryPostColumn = [

    columHelper.accessor(row => row.groupTransaksiId, {
        cell: info => info.getValue(),
        header: "No Ref"
    }),
    columHelper.accessor(row => row.namaPelanggan, {
        cell: info => info.getValue(),
        header: "Pelanggan"
    }),
    columHelper.accessor(row => row.createdAt, {
        cell: info => format(info.getValue(), 'dd/MM/yyyy HH:mm'),
        header: "Jam Transaksi"
    }),
    columHelper.accessor(row => row.subTotal, {
        cell: info => info.getValue(),
        header: "Sub Total"
    }),

    columHelper.accessor(row => row.pajak, {
        cell: info => info.getValue(),
        header: "Pajak"
    }),
    columHelper.accessor(row => row.diskonInvoice, {
        cell: info => info.getValue(),
        header: "Diskon"
    }),
    columHelper.accessor(row => row.total, {
        cell: info => info.getValue(),
        header: "Total"
    }),
    columHelper.accessor(row => row.id, {
        cell: info => <div className="flex gap-1 justify-center">
            <div className="tooltip tooltip-left" data-tip="Lihat Detail">
                <Link className="btn btn-outline btn-success btn-circle btn-xs" href={`/klinik/kasir/historypos/detail/${info.getValue()}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                        <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                    </svg>
                </Link>
            </div>
        </div>
        ,
        header: "Aksi"
    }),
]

export default HistoryPostColumn