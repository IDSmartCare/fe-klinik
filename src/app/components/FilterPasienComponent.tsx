'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastAlert } from "../helper/ToastAlert";
import { useSession } from "next-auth/react";
import AlertHeaderComponent from "../klinik/setting/paramedis/components/AlertHeaderComponent";
import { typeFormPasienBaru } from "../klinik/pasien/interface/typeFormPasienBaru";
import { calculateAge } from "../helper/CalculateAge";
import PasienIdentitasComponent from "./PasienIdentitasComponent";
import SubMenuPasien from "../klinik/pasien/components/SubMenuPasien";

export type typeCariPasien = {
    input: string
    type: string
}

const FilterPasienComponent = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<typeCariPasien>();
    const [load, setLoad] = useState(false)
    const { data } = useSession()
    const [resObject, setResObject] = useState<typeFormPasienBaru>()
    const [resArr, setResArr] = useState<typeFormPasienBaru[]>()

    const cariPasien = handleSubmit(async (body) => {
        setLoad(true)
        try {
            const getData = await fetch(`/api/pasien/findby`, {
                method: "POST",
                body: JSON.stringify({
                    findBy: body.type,
                    idFasyankes: data?.user.idFasyankes,
                    value: body.input
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const res = await getData.json()
            if (!res || res.length === 0) {
                ToastAlert({ icon: 'error', title: "Data tidak ditemukan!" })
            } else if (res.length > 0) {
                setResArr([...res])
                const openWindow: any = document.getElementById("modal-pasien-list")
                openWindow.showModal()
            } else {
                setResObject(res)
                const openWindow: any = document.getElementById("modal-pasien-satuan")
                openWindow.showModal()
            }

        } catch (error: any) {
            ToastAlert({ icon: 'error', title: error.message })
            console.log(error.message);
        }
        setLoad(false)
    })
    return (
        <div>
            <form onSubmit={cariPasien} className="flex justify-end">
                <div className="join">
                    <div>
                        <div>
                            <input {...register('input', { required: "* Masukan text!" })} className="input input-primary input-sm join-item" placeholder="Cari pasien lainnya" />
                            {errors.input &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.input.message}</span>
                                </label>
                            }
                        </div>
                    </div>
                    <div>
                        <select {...register('type', { required: "* Pilih dulu!" })} className="select select-sm select-primary join-item">
                            <option value={"norm"}>By RM</option>
                            <option value={"nik"}>By NIK</option>
                            <option value={"nobpjs"}>By BPJS</option>
                            <option value={"namapasien"}>By NAMA</option>
                            <option value={"nohp"}>By HP</option>
                        </select>
                        {errors.type &&
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.type.message}</span>
                            </label>
                        }
                    </div>
                    {load ?
                        <button className="btn btn-sm btn-primary join-item">
                            <span className="loading loading-spinner"></span>Loading
                        </button>
                        :
                        <button className={`btn btn-sm btn-primary join-item `}>Cari</button>
                    }
                </div>
            </form>
            {/* Modal list array */}
            <dialog id="modal-pasien-list" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="mt-3">
                        <AlertHeaderComponent message="List Pasien Ditemukan" />
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        {resArr?.map((item) => {
                            return (
                                <div key={item.id} className="collapse collapse-arrow bg-base-200">
                                    <input type="checkbox" />
                                    <div className="collapse-title text-xl font-medium">
                                        {item.namaPasien} ({item.jenisKelamin}) / {item.noRm} / {calculateAge(new Date(item?.tanggalLahir)).years} Tahun
                                    </div>
                                    <div className="collapse-content flex flex-col gap-2">
                                        <div className="self-end">
                                            <SubMenuPasien session={data} params={{ id: item.id?.toString() }} />
                                        </div>
                                        <PasienIdentitasComponent pasien={item} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </dialog>
            {/* Modal pasien obj */}
            <dialog id="modal-pasien-satuan" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="mt-3">
                        <AlertHeaderComponent message="List Pasien Ditemukan" />
                    </div>
                    <p className="bg-base-200 mt-2 rounded text-xl mb-2 font-medium p-3">
                        {resObject?.namaPasien} ({resObject?.jenisKelamin}) / {resObject?.noRm} / {resObject?.tanggalLahir && calculateAge(new Date(resObject.tanggalLahir)).years} Tahun
                    </p>
                    <div className="self-end mb-2 flex flex-col">
                        <SubMenuPasien session={data} params={{ id: resObject?.id?.toString() }} />
                    </div>
                    <PasienIdentitasComponent pasien={resObject} />
                </div>
            </dialog >
        </div >
    )
}

export default FilterPasienComponent