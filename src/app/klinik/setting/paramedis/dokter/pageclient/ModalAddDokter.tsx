'use client'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import ButtonModalComponent, { icon } from "../../../../../components/ButtonModalComponent"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent"
import { typeFormDokter } from "../interface/typeFormDokter"
import { createDokter } from "../action"
import Select from 'react-select'
import { useEffect, useId, useState } from "react"
import { typeFormPoliklinik } from "../../poliklinik/interface/typeFormPoliklinik"
import { Session } from "next-auth"

const ModalAddDokter = ({ session }: { session: Session | null }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm<typeFormDokter>()
    const uuid = useId()
    const [option, setOption] = useState<any[]>([])
    const [optionUser, setOptionUser] = useState<any[]>([])

    useEffect(() => {
        async function getListPoli() {
            const getRes = await fetch(`/api/paramedis/findallpoli?idFasyankes=${session?.user.idFasyankes}`)
            if (!getRes.ok) {
                setOption([])
                return
            }
            const data = await getRes.json()
            const newArr = data.map((item: typeFormPoliklinik) => {
                return {
                    label: item.namaPoli,
                    value: item.id
                }
            })
            setOption([...newArr])
        }
        getListPoli()
        async function getListUser() {
            const getRes = await fetch(`/api/user/findalluser?idFasyankes=${session?.user.idFasyankes}`)
            if (!getRes.ok) {
                setOptionUser([])
                return
            }
            const data = await getRes.json()
            const newArr = data.map((item: any) => {
                return {
                    label: item.username,
                    value: item.id
                }
            })
            setOptionUser([...newArr])
        }
        getListPoli()
        getListUser()
    }, [])

    const onSubmit: SubmitHandler<typeFormDokter> = async (data) => {
        const post = await createDokter(data, session?.user.idFasyankes)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
            reset()
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
    }
    return (
        <div className="self-end">
            <ButtonModalComponent icon={icon.add} modalname="add-dokter" title="Dokter Baru" />
            <dialog id="add-dokter" className="modal">
                <div className="modal-box w-4/12 max-w-lg">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Tambah Dokter Baru</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-5">
                        <input type="text" placeholder="Nama Dokter" {...register("namaLengkap", { required: "Tidak boleh kosong!" })} className="input input-sm nput-bordered input-primary w-full max-w-lg" />
                        <span className="label-text-alt text-error"> {errors.namaLengkap && <span>{errors.namaLengkap.message}</span>}</span>
                        <input type="text" placeholder="Kode Dokter" {...register("kodeDokter", { required: "Tidak boleh kosong!" })} className="input input-sm input-bordered input-primary w-full max-w-lg" />
                        <span className="label-text-alt text-error"> {errors.kodeDokter && <span>{errors.kodeDokter.message}</span>}</span>
                        <Controller
                            name="poliKlinikId"
                            control={control}
                            rules={{
                                required: "Tidak boleh kosong!"
                            }}
                            render={({ field }) => <Select
                                {...field}
                                isClearable
                                placeholder="Pilih poli dokter"
                                instanceId={uuid}
                                options={option}
                            />}
                        />
                        <span className="label-text-alt text-error"> {errors.poliKlinikId && <span>{errors.poliKlinikId.message}</span>}</span>
                        <Controller
                            name="userId"
                            control={control}
                            rules={{
                                required: "Tidak boleh kosong!"
                            }}
                            render={({ field }) => <Select
                                {...field}
                                isClearable
                                placeholder="Pilih username dokter"
                                instanceId={uuid}
                                options={optionUser}
                            />}
                        />
                        <span className="label-text-alt text-error"> {errors.userId && <span>{errors.userId.message}</span>}</span>
                        <SubmitButtonServer />
                    </form>
                </div>
            </dialog>
        </div>
    )
}

export default ModalAddDokter