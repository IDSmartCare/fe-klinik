'use client'

import { useEffect, useState } from "react"
import { BillPasienDetail } from "../interface/typeBillingPasien"

const DetailBillPasien = ({ detailBill }: { detailBill: BillPasienDetail[] }) => {
    const [discount, setDiscount] = useState('');
    const [taxRate, setTaxRate] = useState('');
    const [total, setTotal] = useState(0);
    const [subTotal, setSubTotal] = useState(0);

    useEffect(() => {
        setSubTotal(detailBill.reduce((prev, next) => Number(prev) + Number(next.subTotal), 0))
        setTotal(detailBill.reduce((prev, next) => Number(prev) + Number(next.subTotal), 0))
    }, [detailBill])

    const onChangeDiskon = (e: string) => {
        setDiscount(e)
        calcuLatorInvoice(Number(e), Number(taxRate))
    }
    const onChangePajak = (e: string) => {
        setTaxRate(e)
        calcuLatorInvoice(Number(discount), Number(e))
    }
    const calcuLatorInvoice = (diskon: number, pajak: number) => {
        const discountAmount = subTotal * (diskon / 100);
        const discountedSubtotal = subTotal - discountAmount;
        const taxAmount = discountedSubtotal * (pajak / 100);
        const newTotal = discountedSubtotal + taxAmount;
        setTotal(newTotal)
    }
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table table-sm">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Deskripsi</th>
                            <th>Jumlah</th>
                            <th>Harga</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailBill.map((item, index) => (

                            <tr key={item.id}>
                                <th>{index + 1}</th>
                                <td>{item.deskripsi}</td>
                                <td>{item.jumlah}</td>
                                <td>{new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(Number(item.harga))}</td>
                                <td>{new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(Number(item.subTotal))}</td>
                            </tr>
                        ))}

                        <tr className="font-semibold">
                            <td colSpan={4} className="text-right">Sub Total</td>
                            <td>
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(subTotal)}</td>
                        </tr>


                        <tr className="font-semibold">
                            <td colSpan={4} className="text-right">Diskon %</td>
                            <td><input type="text" value={discount} onChange={(e) => onChangeDiskon(e.target.value)} className="input input-sm input-primary" /></td>
                        </tr>
                        <tr className="font-semibold">
                            <td colSpan={4} className="text-right">Pajak %</td>
                            <td><input type="text" onChange={(e) => onChangePajak(e.target.value)} value={taxRate} className="input input-sm input-primary" /></td>
                        </tr>
                        <tr className="font-semibold">
                            <td colSpan={4} className="text-right">Total</td>
                            <td>
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(total)}</td>
                        </tr>
                        <tr className="font-semibold">
                            <td colSpan={4} className="text-right">Bayar</td>
                            <td><input type="number" className="input input-sm input-primary" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DetailBillPasien