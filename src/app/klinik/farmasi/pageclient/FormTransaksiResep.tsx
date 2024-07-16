'use client'

import { useEffect, useId, useState } from "react";
import { ListResepInterface } from "../interface/typeListResep";
import AsyncSelect from 'react-select/async';
import { getApiBisnisOwner } from "@/app/lib/apiBisnisOwner";
import { ObatInterface } from "../../cppt/interface/typeFormResep";
import { Session } from "next-auth";

const FormTransaksiResep = ({ data, session, soapId }: { data: ListResepInterface[] | null, session: Session | null, soapId: number }) => {
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
                }
            })
            return list
        }
    };

    const onChangeObat = (e: any) => {
        if (e) {
            setObat({ namaObat: e.label, obatId: e.value, satuan: e.satuan, harga_jual: e.harga_jual })
        }
    }

    const onAddResep = () => {
        const resepBaru: ListResepInterface = {
            id: Math.floor((Math.random() * 100) + 1),
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
            updatedAt: new Date()
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
    const onClickSimpan = () => {
        console.log(listResep);

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
                            <tr key={i.id}>
                                <td>{index + 1}</td>
                                <td><input type="text" className="input input-sm input-primary" defaultValue={i.namaObat?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-14" defaultValue={i.jumlah?.toString()} /></td>
                                <td>{i.satuan}</td>
                                <td><input type="text" className="input input-sm input-primary w-14" defaultValue={i.signa1?.toString()} /></td>
                                <td>X</td>
                                <td><input type="text" className="input input-sm input-primary w-14" defaultValue={i.signa2?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-40" defaultValue={i.aturanPakai?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-32" defaultValue={i.waktu?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-32" defaultValue={i.catatan?.toString()} /></td>
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