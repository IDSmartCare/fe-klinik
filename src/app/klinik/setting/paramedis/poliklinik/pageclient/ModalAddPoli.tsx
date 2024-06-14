'use client'

import ButtonModalComponent from "../../components/ButtonModalComponent"
import { useForm, SubmitHandler } from "react-hook-form"
import { typeFormPoliklinik } from "../interface/typeFormPoliklinik"
import { createPoli } from "../action"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent"

const ModalAddPoli = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<typeFormPoliklinik>()

    const onSubmit: SubmitHandler<typeFormPoliklinik> = async (data) => {
        const post = await createPoli(data)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
            reset()
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
    }
    return (
        <div className="self-end">
            <ButtonModalComponent modalname="add-poli" title="Poli Baru" />
            <dialog id="add-poli" className="modal">
                <div className="modal-box w-3/12 max-w-md">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Tambah Poliklinik Baru</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-5">
                        <input type="text" placeholder="Nama Poliklinik" {...register("namaPoli", { required: "Tidak boleh kosong!" })} className="input input-sm nput-bordered input-primary w-full max-w-xs" />
                        <span className="label-text-alt text-error"> {errors.namaPoli && <span>{errors.namaPoli.message}</span>}</span>
                        <input type="text" placeholder="Kode Poliklinik" {...register("kodePoli", { required: "Tidak boleh kosong!" })} className="input input-sm input-bordered input-primary w-full max-w-xs" />
                        <span className="label-text-alt text-error"> {errors.kodePoli && <span>{errors.kodePoli.message}</span>}</span>
                        <SubmitButtonServer />
                    </form>
                </div>

            </dialog>
        </div>
    )
}

export default ModalAddPoli