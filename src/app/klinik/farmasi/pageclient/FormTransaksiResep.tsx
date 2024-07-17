'use client'

import { useEffect, useId, useState } from "react";
import { ListResepInterface } from "../interface/typeListResep";
import AsyncSelect from 'react-select/async';
import { getApiBisnisOwner, postApiBisnisOwner } from "@/app/lib/apiBisnisOwner";
import { ObatInterface } from "../../cppt/interface/typeFormResep";
import { Session } from "next-auth";
import { addTransaksiObat } from "../addTransaksi";
import { ToastAlert } from "@/app/helper/ToastAlert";

const FormTransaksiResep = ({ data, session, soapId, pendaftaranId }: { data: ListResepInterface[] | null, session: Session | null, soapId: number, pendaftaranId: number }) => {
    const [listResep, setListResep] = useState<ListResepInterface[] | null>(null)
    const [jumlah, setJumlah] = useState(0)
    const [signa1, setSigna1] = useState("")
    const [signa2, setSigna2] = useState("")
    const [aturanPakai, setAturanPakai] = useState("")
    const [waktu, setWaktu] = useState("")
    const [catatan, setCatatan] = useState("")
    const [obat, setObat] = useState<ObatInterface>({})
    const uuid = useId()
    useEffect(() => {
        if (data) {
            setListResep([...data])
        }
    }, [data])

    const optionCariObat = (inputValue: string) =>
        new Promise<[]>((resolve) => {
            setTimeout(() => {
                resolve(findObat(inputValue));
            }, 1000);
        });

    const findObat = async (inputValue: string) => {
        if (inputValue.length >= 2) {
            const apiRes = await getApiBisnisOwner({ url: `master-barang?wfid=${session?.user.wfid}&search=${inputValue}` })
            const list = apiRes.data.data.map((item: any) => {
                return {
                    value: item.barang_id,
                    label: `${item.barang.nama_barang} (${item.barang.satuan})`,
                    satuan: item.barang.satuan,
                    harga_jual: item.barang.harga_jual,
                    stok: item.stok
                }
            })
            return list
        }
    };

    const onChangeObat = (e: any) => {
        if (e) {
            setObat({ namaObat: e.label, obatId: e.value, satuan: e.satuan, harga_jual: e.harga_jual, stok: e.stok })
        }
    }

    const onAddResep = () => {
        const resepBaru: ListResepInterface = {
            namaObat: obat.namaObat,
            obatId: obat.obatId,
            satuan: obat.satuan,
            jumlah,
            signa1,
            signa2,
            aturanPakai,
            waktu,
            catatan,
            hargaJual: obat.harga_jual,
            sOAPId: Number(soapId),
            createdAt: new Date(),
            updatedAt: new Date(),
            stok: obat.stok
        }
        if (listResep) {
            setListResep([...listResep, resepBaru])
        } else {
            setListResep([resepBaru])
        }
    }

    const onDeleteResep = (id: number) => {
        if (listResep) {
            const filter = listResep.filter((i) => i.id !== id)
            setListResep([...filter])
        }
    }
    const onClickSimpan = async () => {
        const list = listResep?.map((item) => {
            return {
                ...item,
                total: Number(item.hargaJual) * Number(item.jumlah)
            }
        })
        const listToApi = listResep?.map((item) => {
            return {
                "barang_id": item.obatId,
                "qty": item.jumlah
            }
        })
        const bodyToPost = {
            "barang": listToApi,
            "wfid": session?.user.wfid
        }
        const postApi = await postApiBisnisOwner({ url: "decrease-stock", data: bodyToPost })
        if (!postApi.status) {
            ToastAlert({ icon: 'error', title: postApi.message })
            return
        }
        const post: any = await addTransaksiObat(list, pendaftaranId)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
    }

    const onChangeText = (e: any, jenisInput: string, id?: number) => {
        if (e) {
            if (listResep) {
                const findIndex = listResep?.findIndex((item) => item.id === id)
                if (jenisInput === 'jumlah') {
                    listResep[findIndex].jumlah = e
                } else if (jenisInput === 'signa1') {
                    listResep[findIndex].signa1 = e
                } else if (jenisInput === 'signa2') {
                    listResep[findIndex].signa2 = e
                } else if (jenisInput === 'aturanPakai') {
                    listResep[findIndex].aturanPakai = e
                } else if (jenisInput === 'waktu') {
                    listResep[findIndex].waktu = e
                } else {
                    listResep[findIndex].catatan = e
                }
            }
        }
    }

    return (
        <div className="flex flex-col">
            <table className="table table-sm table-zebra">
                <thead className="bg-base-200">
                    <tr>
                        <th>No</th>
                        <th>Nama Obat</th>
                        <th>Jumlah</th>
                        <th>Satuan</th>
                        <th>Signa 1</th>
                        <th></th>
                        <th>Signa 2</th>
                        <th>Aturan</th>
                        <th>Waktu</th>
                        <th>Catatan</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-info">
                        <td></td>
                        <td>
                            <AsyncSelect className="select-info w-full" required isClearable
                                name="obat" loadOptions={optionCariObat} defaultOptions
                                onChange={(e) => onChangeObat(e)}
                                placeholder="Cari obat"
                                instanceId={uuid}
                            />
                        </td>
                        <td><input type="text" onChange={(e) => setJumlah(Number(e.target.value))} className="input input-sm input-primary w-14" /></td>
                        <td>{obat.satuan}</td>
                        <td><input type="text" onChange={(e) => setSigna1(e.target.value)} className="input input-sm input-primary w-14" /></td>
                        <td>X</td>
                        <td><input type="text" onChange={(e) => setSigna2(e.target.value)} className="input input-sm input-primary w-14" /></td>
                        <td><input type="text" onChange={(e) => setAturanPakai(e.target.value)} className="input input-sm input-primary w-40" /></td>
                        <td><input type="text" onChange={(e) => setWaktu(e.target.value)} className="input input-sm input-primary w-32" /></td>
                        <td><input type="text" onChange={(e) => setCatatan(e.target.value)} className="input input-sm input-primary w-32" /></td>
                        <td>
                            <div className="tooltip tooltip-left" data-tip="Tambah Resep">

                                <button className="btn btn-xs btn-circle btn-primary" onClick={() => onAddResep()} >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                    {listResep?.map((i, index) => {
                        return (
                            <tr key={i.obatId}>
                                <td>{index + 1}</td>
                                <td>{i.namaObat?.toString()}</td>
                                <td><input type="text" onChange={(e) => onChangeText(e.target.value, 'jumlah', i.id)} className="input input-sm input-primary w-14" defaultValue={i.jumlah?.toString()} /></td>
                                <td>{i.satuan}</td>
                                <td><input type="text" onChange={(e) => onChangeText(e.target.value, 'signa1', i.id)} className="input input-sm input-primary w-14" defaultValue={i.signa1?.toString()} /></td>
                                <td>X</td>
                                <td><input type="text" onChange={(e) => onChangeText(e.target.value, 'signa2', i.id)} className="input input-sm input-primary w-14" defaultValue={i.signa2?.toString()} /></td>
                                <td><input type="text" onChange={(e) => onChangeText(e.target.value, 'aturanPakai', i.id)} className="input input-sm input-primary w-40" defaultValue={i.aturanPakai?.toString()} /></td>
                                <td><input type="text" onChange={(e) => onChangeText(e.target.value, 'waktu', i.id)} className="input input-sm input-primary w-32" defaultValue={i.waktu?.toString()} /></td>
                                <td><input type="text" onChange={(e) => onChangeText(e.target.value, 'catatan', i.id)} className="input input-sm input-primary w-32" defaultValue={i.catatan?.toString()} /></td>
                                <td className="tooltip tooltip-left" data-tip="Hapus Resep"><button onClick={() => onDeleteResep(Number(i.id))} className="btn btn-xs btn-error btn-circle "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                                </svg>
                                </button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <button onClick={() => onClickSimpan()} className="btn btn-primary btn-sm mt-10">SIMPAN TRANSAKSI</button>
        </div>
    )
}

export default FormTransaksiResep