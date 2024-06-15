'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
// import { typeFormPasienBaru } from "../interface/typeFormPasienBaru";
// import { getData } from "@/app/service/endpoint";
// import SweetAlert from "@/helpers/AlertHelper";
import { Session } from "next-auth";
// import DetailPasienComponent from "../pasien/table/DetailPasienComponent";
// import AlertHeaderComponent from "@/components/AlertHeaderComponent";
// import { calculateAge } from "@/helpers/GetAgeHelper";
// import LinkDaftarPasienComponent from "./LinkDaftarPasienComponent";

export type typeCariPasien = {
    input: string
    type: string
}

const FilterPasienComponent = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<typeCariPasien>();
    const [load, setLoad] = useState(false)
    // const [resObject, setResObject] = useState<typeFormPasienBaru>()
    // const [resArr, setResArr] = useState<typeFormPasienBaru[]>()

    const cariPasien = handleSubmit(async (body) => {
        setLoad(true)
        try {
            switch (body.type) {
                case "namapasien": {
                    // const resList = await getData(`human/pasien/getmanyby/${body.type}/${body.input}`, session?.user.token)
                    // setResArr([...resList.data])
                    // const doc: any = document.getElementById("modal-pasien-name")
                    // doc?.showModal()
                    break;
                }
                case "nohp": {
                    // const resListHp = await getData(`human/pasien/getmanyby/${body.type}/${body.input}`, session?.user.token)
                    // setResArr([...resListHp.data])
                    // const docHp: any = document.getElementById("modal-pasien-name")
                    // docHp?.showModal()
                    break;
                }
                default: {
                    // const res = await getData(`human/pasien/getoneby/${body.type}/${body.input}`, session?.user.token)
                    // setResObject(res.data)
                    // const docObj: any = document.getElementById("modal-pasien-obj")
                    // docObj?.showModal()
                    break;
                }
            }
        } catch (error: any) {
            // SweetAlert(error.message, 'error')
            // console.log(error.message);
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
            <dialog id="modal-pasien-name" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    {/* <AlertHeaderComponent message="List Pasien Ditemukan" />
                    <div className="flex flex-col gap-2 mt-2">
                        {resArr?.map((item) => {
                            return (
                                <div key={item._id} className="collapse collapse-arrow bg-base-200">
                                    <input type="checkbox" />
                                    <div className="collapse-title text-xl font-medium">
                                        {item.nama_pasien} ({item.jenis_kelamin}) / {item.no_rm} / {calculateAge(new Date(item.tanggal_lahir)).years} Th, {calculateAge(new Date(item.tanggal_lahir)).months} Bln, {calculateAge(new Date(item.tanggal_lahir)).days} Hari
                                    </div>
                                    <div className="collapse-content">
                                        <div className="flex items-center justify-end gap-2">
                                            <LinkDaftarPasienComponent _id={item._id} />
                                            <div className="join">
                                                <button className="btn btn-xs join-item btn-success">EP</button>
                                                <button className="btn btn-xs join-item btn-info">Edit</button>
                                            </div>
                                        </div>
                                        <DetailPasienComponent item={item} />
                                    </div>
                                </div>
                            )
                        })}
                    </div> */}
                </div>
            </dialog>
            {/* Modal pasien obj */}
            <dialog id="modal-pasien-obj" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    {/* <AlertHeaderComponent message="List Pasien Ditemukan" />
                    <div className="bg-base-200 mt-2 justify-between flex items-center text-xl font-medium p-2">
                        <p>
                            {resObject?.nama_pasien} ({resObject?.jenis_kelamin}) / {resObject?.no_rm} / {resObject?.tanggal_lahir && calculateAge(new Date(resObject.tanggal_lahir)).years} Th, {resObject?.tanggal_lahir && calculateAge(new Date(resObject.tanggal_lahir)).months} Bln, {resObject?.tanggal_lahir && calculateAge(new Date(resObject.tanggal_lahir)).days} Hari
                        </p>
                        <div className="flex items-center gap-2">
                            <LinkDaftarPasienComponent _id={resObject?._id} />
                            <div className="join">
                                <button className="btn btn-xs join-item btn-success">EP</button>
                                <button className="btn btn-xs join-item btn-info">Edit</button>
                            </div>
                        </div>
                    </div>
                    <DetailPasienComponent item={resObject} /> */}
                </div>
            </dialog >
        </div >
    )
}

export default FilterPasienComponent