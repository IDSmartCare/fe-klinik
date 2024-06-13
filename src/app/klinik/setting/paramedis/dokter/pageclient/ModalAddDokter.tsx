'use client'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import ButtonModalComponent from "../../components/ButtonModalComponent"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent"
import { typeFormDokter } from "../interface/typeFormDokter"
import { createDokter } from "../action"
import Select from 'react-select'
import { useEffect, useId, useState } from "react"
import { typeFormPoliklinik } from "../../poliklinik/interface/typeFormPoliklinik"

const ModalAddDokter = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm<typeFormDokter>()
    const uuid = useId()
    const [option, setOption] = useState<any[]>([])

    useEffect(() => {
        async function getListPoli() {
            const getRes = await fetch(`/api/paramedis/findallpoli`, {
                cache: 'no-cache'
            })
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
    }, [])

    const onSubmit: SubmitHandler<typeFormDokter> = async (data) => {
        const post = await createDokter(data)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
            reset()
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
    }
    return (
        <div className="self-end">
            <ButtonModalComponent modalname="add-dokter" title="Dokter Baru" />
            <dialog id="add-dokter" className="modal">
                <div className="modal-box w-4/12 max-w-lg">
                    <h3 className="font-bold text-lg">Tambah Dokter Baru</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-5">
                        <input type="text" placeholder="Nama Dokter" {...register("namaDokter", { required: "Tidak boleh kosong!" })} className="input input-sm nput-bordered input-primary w-full max-w-lg" />
                        <span className="label-text-alt text-error"> {errors.namaDokter && <span>{errors.namaDokter.message}</span>}</span>
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
                                instanceId={uuid}
                                options={option}
                            />}
                        />
                        <span className="label-text-alt text-error"> {errors.poliKlinikId && <span>{errors.poliKlinikId.message}</span>}</span>
                        <SubmitButtonServer />
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}

export default ModalAddDokter