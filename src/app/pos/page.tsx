'use client'

import { useEffect, useState } from "react"
import { getApiBisnisOwner, postApiBisnisOwner } from "../lib/apiBisnisOwner"
import { useSession } from "next-auth/react"
import { PembelianInterface, StokBarangInterface } from "./interface/postInterface"
import { ToastAlert } from "../helper/ToastAlert"
import simpanPOS from "./actionSimpanPos"
import Link from "next/link"
import GetPosByGroupId from "./getPos"
import { TransaksiAfterSubmit } from "./interface/listAfterSubmit"
import ModalPrintBill from "./pageclient/ModalPrintBill"

const PagePos = () => {
    const { data } = useSession()
    const [barang, setBarang] = useState<StokBarangInterface[]>([])
    const [pembelian, setPembelian] = useState<PembelianInterface[]>([])
    const [subTotal, setSubTotal] = useState(0)
    const [total, setTotal] = useState(0)
    const [biayaLain, setBiayaLain] = useState("")
    const [pajak, setPajak] = useState("")
    const [diskon, setDiskon] = useState("")
    const [kembalian, setKembalian] = useState(0)
    const [hargaDiskon, setHargaDiskon] = useState(0)
    const [hargaPajak, setHargaPajak] = useState(0)
    const [bayar, setBayar] = useState("")
    const [email, setEmail] = useState("")
    const [hpPelanggan, setHpPelanggan] = useState("")
    const [namaPelanggan, setNamaPelanggan] = useState("")
    const [jenisDiskon, setJenisDiskon] = useState("")
    const [resAfterSubmit, setResAfterSubmit] = useState<TransaksiAfterSubmit | null | undefined>()


    useEffect(() => {
        const getApiBarang = async (wfid: string) => {
            const apiRes = await getApiBisnisOwner({ url: `master-barang?wfid=${wfid}` })
            setBarang(apiRes.data.data)
        }
        data?.user.wfid && getApiBarang(data.user.wfid)
    }, [data?.user])

    const onClickTambah = (barang: StokBarangInterface) => {
        const existingItem = pembelian.find(item => item.barang_id === barang.barang_id);
        if (existingItem) {
            const updatedItems = pembelian.map(item => {
                if (item.barang_id === barang.barang_id) {
                    let totalDiskon = 0
                    if (barang.diskon.percent_disc) {
                        const diskon = Number(barang.barang.harga_jual) * (Number(barang.diskon.percent_disc) / 100)
                        const subTotal = Number(barang.barang.harga_jual) - diskon
                        totalDiskon = subTotal
                    } else {
                        totalDiskon = Number(barang.barang.harga_jual) - Number(barang.diskon.amount_disc)
                    }
                    return {
                        ...item, qty: item.qty + 1,
                        totalHarga: Number(item.qty + 1) * totalDiskon
                    };
                }
                return item;
            });
            setPembelian(updatedItems);
            subTotalCalculate(updatedItems)
        } else {
            let totalDiskon = 0
            if (barang.diskon.percent_disc) {
                const diskon = Number(barang.barang.harga_jual) * (Number(barang.diskon.percent_disc) / 100)
                const subTotal = Number(barang.barang.harga_jual) - diskon
                totalDiskon = subTotal
            } else {
                totalDiskon = Number(barang.barang.harga_jual) - Number(barang.diskon.amount_disc)
            }
            const addBarang: any = {
                barang_id: barang.barang_id,
                nama_barang: barang.barang.nama_barang,
                harga_jual: barang.barang.harga_jual,
                qty: 1,
                totalHarga: totalDiskon,
                diskonFromBo: barang.diskon.amount_disc ? barang.diskon.amount_disc :
                    Number(barang.barang.harga_jual) * (Number(barang.diskon.percent_disc) / 100),
            }
            let allBarang = [...pembelian, addBarang]
            setPembelian([...pembelian, addBarang]);
            subTotalCalculate(allBarang)

        }
    }

    const subTotalCalculate = (pembelian: PembelianInterface[]) => {
        let subTotalNow = pembelian.reduce((prev, next) => prev + next.totalHarga, 0)
        setSubTotal(subTotalNow)
        setTotal(subTotalNow)
    }

    const onChangeBiayaLain = (e: string) => {
        setBiayaLain(e)
        calculatorTotal(Number(pajak), Number(e), Number(diskon))
    }

    const onChangePajak = (e: string) => {
        setPajak(e)
        calculatorTotal(Number(e), Number(biayaLain), Number(diskon))
    }

    const onChangeDiskon = (e: string) => {
        setDiskon(e)
        calculatorTotal(Number(pajak), Number(biayaLain), Number(e))
    }

    const calculatorTotal = (pajak: number, biayalain: number, diskon: number) => {
        let discountAmount = 0
        let total = subTotal
        let taxAmount = total * (pajak / 100);
        setHargaPajak(taxAmount)
        total = subTotal + taxAmount
        if (jenisDiskon === "percent") {
            discountAmount = total * (diskon / 100);
            setHargaDiskon(discountAmount)
        } else {
            discountAmount = diskon
            setHargaDiskon(diskon)
        }
        let newTotal = total - discountAmount + biayalain;
        setTotal(newTotal)
    }

    const onBayar = () => {
        if (!namaPelanggan) {
            ToastAlert({ icon: 'error', title: "Silahkan isi nama pelanggan!" })
            return
        }
        const modal: any = document?.getElementById('modal-pos')
        modal.showModal()
        setBayar("")
        setKembalian(0)
    }

    const onSubmitData = async (e: any) => {
        e.preventDefault()
        const bayar = e.target.bayar.value
        let groupId = new Date().valueOf().toString()
        const listToApi = pembelian?.map((item) => {
            return {
                "barang_id": item.barang_id,
                "qty": item.qty
            }
        })
        const bodyToPost = {
            "barang": listToApi,
            "wfid": data?.user.wfid
        }

        if (bayar < total) {
            ToastAlert({ icon: 'error', title: "Pembayaran tidak boleh kurang" })
            return
        }
        const post = await simpanPOS(pembelian, {
            namaPelanggan,
            emailPelanggan: email,
            groupTransaksiId: groupId,
            hpPelanggan,
            diskonInvoice: hargaDiskon.toString(),
            pajak: hargaPajak.toString(),
            biayaLainnya: biayaLain ?? "0",
            subTotal: subTotal.toString(),
            total: total.toString(),
            totalBayar: bayar
        }, data?.user.idFasyankes)
        if (post.status) {
            const postApi = await postApiBisnisOwner({ url: "decrease-stock", data: bodyToPost })
            if (!postApi.status) {
                ToastAlert({ icon: 'error', title: postApi.message })
                return
            }
            ToastAlert({ icon: 'success', title: post.message as string })
            const modal: any = document?.getElementById('modal-pos')
            modal.close()
            setPembelian([])
            subTotalCalculate([])
            setBiayaLain("")
            setEmail("")
            setHpPelanggan("")
            setNamaPelanggan("")
            const getDataAfterSubmit = await GetPosByGroupId(groupId)
            setResAfterSubmit(getDataAfterSubmit.data as any)
            setTimeout(() => {
                const modal: any = document?.getElementById('modal-pos-print')
                modal.show()
            }, 2000);
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
    }

    const onDeletePembelian = (idbarang: string) => {
        const list = pembelian.filter((item) => item.barang_id !== idbarang)
        subTotalCalculate(list)
        setPembelian(list)
    }

    const onChangePembayaran = (e: string) => {
        setBayar(e)
        setKembalian(Number(e) - total)
    }

    return (
        <div className="flex gap-2 flex-col p-2">
            <Link href={"/klinik"}><button className="btn btn-sm btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clipRule="evenodd" />
                </svg>
                Kembali</button></Link>
            <div role="alert" className="alert alert-info">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0 stroke-current">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>POS Penjualan Obat</span>
            </div>
            <div className="flex gap-2">
                <div className="w-2/3 h-full flex flex-col min-h-screen p-2">
                    {/* <input placeholder="Cari obat" className="input input-primary w-full join-item" /> */}
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>Harga</th>
                                    <td>Diskon</td>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {barang?.map((item) => {
                                    return (
                                        <tr key={item.barang_id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="font-bold">{item.barang.nama_barang}</div>
                                                        <div className="text-sm opacity-50">Stok : {item.stok}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {
                                                    new Intl.NumberFormat('id-ID', {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                    }).format(Number(item.barang.harga_jual))}
                                            </td>
                                            <td>
                                                {item.diskon.type === "Percentage" ? `${item.diskon.percent_disc}%` : `${new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(Number(item.diskon.amount_disc))}`}
                                            </td>
                                            <th>
                                                <button onClick={() => onClickTambah(item)} className="btn btn-primary">Tambah</button>
                                            </th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-1/3">
                    <div className="flex flex-col bg-base-200 min-h-screen p-2 gap-2">
                        <p className="text-xl font-medium">Biodata Pasien</p>
                        <div className="flex items-center justify-between">
                            <p className="font-medium label-text">Nama</p>
                            <input type="text" value={namaPelanggan} onChange={(e) => setNamaPelanggan(e.target.value)} className="input input-bordered w-full max-w-xs" />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium label-text">No HP</p>
                            <input type="number" value={hpPelanggan} onChange={(e) => setHpPelanggan(e.target.value)} className="input input-bordered w-full max-w-xs" />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium label-text">Email</p>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full max-w-xs" />
                        </div>
                        <div className="divider"></div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>QTY</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pembelian?.map((item) => {
                                    return (
                                        <tr key={item.barang_id}>
                                            <td>
                                                <div>
                                                    <div className="font-bold">{item.nama_barang}</div>
                                                </div>
                                            </td>
                                            <td>{item.qty}</td>
                                            <td>
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(item.totalHarga)}
                                            </td>
                                            <td>
                                                <button className="btn btn-circle btn-error" onClick={() => onDeletePembelian(item.barang_id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                                        <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <div className="divider"></div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-medium">Rincian Pembayaran</p>
                            <div className="flex items-center justify-between">
                                <p className="font-medium label-text">Sub Total</p>
                                <input type="text" value={subTotal} readOnly className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium label-text">Pajak %</p>
                                <input type="number" max={100} value={pajak} onChange={e => onChangePajak(e.target.value)} className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium label-text">Diskon</p>
                                <p>%</p>
                                <input type="radio" className="radio radio-primary" onChange={e => setJenisDiskon(e.target.value)} name="diskon" value={"percent"} />
                                <p>Rp.</p>
                                <input type="radio" className="radio radio-primary" onChange={e => setJenisDiskon(e.target.value)} name="diskon" value={"rp"} />
                                <input type="text" value={diskon} onChange={e => onChangeDiskon(e.target.value)} className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium label-text">Biaya Lainnya</p>
                                <input type="number" value={biayaLain} onChange={(e) => onChangeBiayaLain(e.target.value)} className="input input-bordered w-full max-w-xs" />
                            </div>

                            <div>
                                <button onClick={() => onBayar()} className="btn btn-info btn-block">BAYAR  {
                                    new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }).format(Number(total))}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <dialog id="modal-pos" className="modal">
                <div className="modal-box w-4/12 max-w-2xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <form className="flex flex-col gap-2" onSubmit={onSubmitData}>
                        <div className="flex items-center">
                            <p className="w-1/3">Total</p>
                            <input type="number" readOnly value={total.toString()} className="input input-primary" />
                        </div>
                        <div className="flex items-center">
                            <p className="w-1/3">Bayar</p>
                            <input type="number" required value={bayar} name="bayar" onChange={(e) => onChangePembayaran(e.target.value)} autoFocus className="input input-primary" />
                        </div>
                        <div className="flex items-center">
                            <p className="w-1/3">Kembali</p>
                            <input type="number" value={kembalian} readOnly className="input input-primary" />
                        </div>
                        {data?.user.role !== "admin" && data?.user.role !== "tester" &&
                            <button className="btn btn-info">SUBMIT</button>
                        }
                    </form>
                </div>
            </dialog>
            <ModalPrintBill data={resAfterSubmit} />
        </div>
    )
}

export default PagePos