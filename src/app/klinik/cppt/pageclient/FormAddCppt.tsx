'use client'

import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent"
import { SubmitHandler, useForm } from "react-hook-form"
import { typeFormCppt } from "../interface/typeFormCppt"
import { createCppt } from "../[...id]/actionAddCppt"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { Session } from "next-auth"
import { useId, useState } from "react"
import ErrorHeaderComponent from "@/app/components/ErrorHeaderComponent"
import AsyncSelect from 'react-select/async';
import { getApiBisnisOwner } from "@/app/lib/apiBisnisOwner"
import { DiagnosaInterface, ObatInterface } from "../interface/typeFormResep"

const FormAddCppt = ({ idregis, idpasien, session }: { idregis: string, idpasien: string, session: Session | null }) => {
    const uuid = useId()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<typeFormCppt>()
    const [listObat, setListObat] = useState<any[]>([])
    const [obat, setObat] = useState<ObatInterface>({})
    const [diagnosa, setDiagnosa] = useState<DiagnosaInterface>({})
    const [jumlah, setJumlah] = useState("")
    const [signa1, setSigna1] = useState("")
    const [signa2, setSigna2] = useState("")
    const [aturanPakai, setAturanPakai] = useState("")
    const [waktu, setWaktu] = useState("")
    const [catatan, setCatatan] = useState("")

    const onSubmit: SubmitHandler<typeFormCppt> = async (form) => {
        const namaDiagnosa = diagnosa.namaDiagnosa?.split("-")
        const body = {
            ...form,
            pendaftaranId: Number(idregis),
            profesi: session?.user.role,
            profileId: Number(session?.user.idProfile),
            isDokter: session?.user.role === "dokter" || false,
            isVerifDokter: session?.user.role === "dokter" || false,
            jamVerifDokter: session?.user.role === "dokter" ? new Date() : null,
            resep: listObat,
            kodeDiagnosa: diagnosa.kodeDiagnosa,
            namaDiagnosa: namaDiagnosa?.[1]
        }
        const post = await createCppt(body, idpasien, session?.user.idFasyankes)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
            reset()
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
        setListObat([])
    }
    const onClickResep = () => {
        const objtObat = {
            namaObat: obat.namaObat,
            obatId: obat.obatId,
            jumlah,
            signa1,
            signa2,
            aturanPakai,
            waktu,
            catatan,
            satuan: obat.satuan,
            harga_jual: obat.harga_jual,
            stok: obat.stok
        }
        setListObat([objtObat, ...listObat])
    }
    const removeResep = (i: number) => {
        const newList = listObat.filter((item, index) => index != i)
        setListObat([...newList])
    }

    const optionCariObat = (inputValue: string) =>
        new Promise<[]>((resolve) => {
            setTimeout(() => {
                resolve(findObat(inputValue));
            }, 1000);
        });

    const optionCariDiagnosa = (inputValue: string) =>
        new Promise<[]>((resolve) => {
            setTimeout(() => {
                resolve(findDiagnosa(inputValue));
            }, 1000);
        });


    const findDiagnosa = async (inputValue: string) => {
        try {
            if (inputValue.length >= 3) {
                const apiRes = await getApiBisnisOwner({ url: `icdx&search=${inputValue}` })
                const list = apiRes.data.data.map((item: any) => {
                    return {
                        value: item.code,
                        label: `${item.code}-${item.en_name}`,
                    }
                })
                return list
            } else {
                const apiRes = await getApiBisnisOwner({ url: `icdx` })
                const list = apiRes.data.data.map((item: any) => {
                    return {
                        value: item.code,
                        label: `${item.code}-${item.en_name}`,
                    }
                })
                return list
            }
        } catch (error: any) {
            ToastAlert({ icon: 'error', title: `Gagal ambil data ke server BO!` })
        }
    };
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
        } else {
            const apiRes = await getApiBisnisOwner({ url: `master-barang?wfid=${session?.user.wfid}` })
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

    const onChangeDiagnosa = (e: any) => {
        if (e) {
            setDiagnosa({ kodeDiagnosa: e.value, namaDiagnosa: e.label })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center flex-col gap-2">
            <div className="join gap-2">
                <div className="form-control">
                    <div className="label">
                        <span className="label-text">Subjective</span>
                    </div>
                    <textarea rows={5} {...register("subjective", { required: "* Tidak boleh kosong" })} className="textarea textarea-primary"></textarea>
                    {errors.subjective &&
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.subjective.message}</span>
                        </label>
                    }
                </div>
                <div className="form-control">
                    <div className="label">
                        <span className="label-text">Objective</span>
                    </div>
                    <textarea rows={5} {...register("objective", { required: "* Tidak boleh kosong" })} className="textarea textarea-primary"></textarea>
                    {errors.objective &&
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.objective.message}</span>
                        </label>
                    }
                </div>
                <div className="form-control">
                    <div className="label">
                        <span className="label-text">Assesment</span>
                    </div>
                    <textarea rows={5} {...register("assesment", { required: "* Tidak boleh kosong" })} className="textarea textarea-primary"></textarea>
                    {errors.assesment &&
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.assesment.message}</span>
                        </label>
                    }
                </div>
                <div className="form-control">
                    <div className="label">
                        <span className="label-text">Plan</span>
                    </div>
                    <textarea rows={5} {...register("plan", { required: "* Tidak boleh kosong" })} className="textarea textarea-primary"></textarea>
                    {errors.plan &&
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.plan.message}</span>
                        </label>
                    }

                </div>
                <div className="form-control">
                    <div className="label">
                        <span className="label-text">Instruksi</span>
                    </div>
                    <textarea rows={5} {...register("instruksi", { required: "* Tidak boleh kosong" })} className="textarea textarea-primary"></textarea>
                    {errors.instruksi &&
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.instruksi.message}</span>
                        </label>
                    }
                </div>


            </div>
            {session?.user.role === "dokter" &&
                <div className="flex flex-col w-full items-center gap-2 p-3">
                    <div className="form-control w-full px-6 mb-6">
                        <div className="label">
                            <span className="label-text">Kode Diagnosa</span>
                        </div>
                        <AsyncSelect className="select-info w-full" isClearable
                            name="icdx" loadOptions={optionCariDiagnosa} defaultOptions
                            onChange={(e) => onChangeDiagnosa(e)}
                            placeholder="Cari Diagnosa"
                            instanceId={uuid}
                        />
                    </div>
                    <div className="flex w-full p-3 gap-2">
                        <div className="form-control w-1/2 border-2 p-2">
                            <div className="label">
                                <span className="label-text text-lg font-bold ">Resep</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <AsyncSelect className="select-info w-full" isClearable
                                    name="obat" loadOptions={optionCariObat} defaultOptions
                                    onChange={(e) => onChangeObat(e)}
                                    placeholder="Cari obat"
                                    instanceId={uuid}
                                />
                                <div className="flex gap-2 items-center">
                                    <input type="number" onChange={(e) => setJumlah(e.target.value)} value={jumlah} placeholder="Jumlah" className="input input-sm input-primary w-1/3" />
                                    <input type="text" onChange={(e) => setSigna1(e.target.value)} value={signa1} placeholder="Signa 1" className="input input-sm input-primary w-1/3" />
                                    {'X'}
                                    <input type="text" onChange={(e) => setSigna2(e.target.value)} value={signa2} placeholder="Signa 2" className="input input-sm input-primary w-1/3" />
                                </div>
                                <select className="select select-primary w-full select-sm" onChange={(e) => setAturanPakai(e.target.value)} value={aturanPakai} >
                                    <option>Silahkan Pilih</option>
                                    <option value={"Sebelum Makan"}>Sebelum Makan</option>
                                    <option value={"Sesudah Makan"}>Sesudah Makan</option>
                                </select>
                                <select className="select select-primary w-full select-sm" onChange={(e) => setWaktu(e.target.value)} value={waktu}>
                                    <option>Silahkan Pilih</option>
                                    <option value={"Pagi"}>Pagi</option>
                                    <option value={"Siang"}>Siang</option>
                                    <option value={"Malam"}>Malam</option>
                                </select>
                                <textarea onChange={(e) => setCatatan(e.target.value)} placeholder="Catatan" className="textarea textarea-primary" value={catatan}></textarea>
                                <button onClick={() => onClickResep()} className="btn btn-sm btn-warning" type="button">Tambah</button>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2 border-2 p-2">
                            <div className="label">
                                <span className="label-text font-bold text-lg">List Resep</span>
                            </div>
                            {listObat.map((item, index) => {
                                return (
                                    <div className="bg-base-300 p-2 rounded flex justify-between items-center" key={item.obatId}>
                                        <div className="italic flex flex-col">
                                            <p className="font-medium">R/</p>
                                            <p className="font-medium">{item.namaObat} ({item.signa1}X{item.signa2})</p>
                                            <p>{item.aturanPakai}</p>
                                            <p>{item.waktu}</p>
                                            <p>{item.catatan}</p>
                                        </div>
                                        <button type="button" onClick={() => removeResep(index)} className="btn btn-error btn-circle btn-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                                <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            }
            {session?.user.role === "dokter" || session?.user.role === "perawat" ?
                <SubmitButtonServer />
                :
                <ErrorHeaderComponent message="Anda bukan perawat / dokter!" />
            }
        </form>
    )
}

export default FormAddCppt