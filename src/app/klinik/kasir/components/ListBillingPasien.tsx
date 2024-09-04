'use client'

import { format } from "date-fns";
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent";
import Link from "next/link";
import ModalPrintTagihan from "../pageclient/ModalPrintTagihan";
import { useState } from "react";
import { getBillingPasien } from "./getBillingPasien";
import { Session } from "next-auth";

const ListBillingPasien = ({ dataRegis, session }: { dataRegis: any, session: Session | null }) => {
    const [tagihan, setTagihan] = useState<any>()
    const onClickPrint = async (id: string) => {
        const getData: any = await getBillingPasien(Number(id))
        setTagihan(getData.data)
        await new Promise(resolve => setTimeout(resolve, 2000));
        const modal: any = document?.getElementById('modal-print-bill-kasir')
        modal.showModal()
    }
    return (
        <div className="flex flex-col gap-2">
            <AlertHeaderComponent message="List Tagihan Yang Ada!" />
            <div className="flex flex-wrap gap-2 bg-base-200 p-2 h-full">
                {dataRegis?.map((item: any) => (
                    <div className="card bg-base-100 w-96 shadow-xl" key={item.id}>
                        <div className="card-body">
                            <h2 className="card-title">{format(item.createdAt, 'dd/MM/yyyy HH:mm')}</h2>
                            <p>ID : {item.billPasien[0].id}</p>
                            <p>PendaftaranID : {item?.id}</p>
                            <p>Penjamin : {item?.penjamin}</p>
                            <p>Poli : {item.jadwal?.dokter.poliklinik?.namaPoli}</p>
                            <p>Dokter : {item.jadwal?.dokter.namaLengkap}</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-sm btn-info" onClick={() => onClickPrint(item?.id)}>CETAK TAGIHAN</button>
                                {item?.penjamin === "PRIBADI" && session?.user.role !== "admin" &&
                                    <Link href={`/klinik/kasir/detail/${item.id}`} className="btn btn-sm btn-primary">BAYAR</Link>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ModalPrintTagihan tagihan={tagihan} />
        </div>
    )
}

export default ListBillingPasien