'use client'

import { SubmitHandler, useForm } from "react-hook-form";
import AlertHeaderComponent from "../../paramedis/components/AlertHeaderComponent";
import { ToastAlert } from "@/app/helper/ToastAlert";
import EditAction from "../edit/editAction";
import { useSession } from "next-auth/react";

const FormEditTarif = ({ dataForm }: { dataForm: any }) => {
    const { data } = useSession()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formEditTarif>()
    const onSubmit: SubmitHandler<formEditTarif> = async (form) => {
        const post = await EditAction(form)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
    }
    return (
        <div className="flex flex-col items-center gap-2">
            <AlertHeaderComponent message="Edit tarif" />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-1/2">
                <input {...register("id", { value: dataForm.id })} type="hidden" />
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Penjamin</span>
                    </div>
                    <input type="text" readOnly value={dataForm.penjamin} className="input input-sm input-bordered w-full " />
                </div>
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Kategori</span>
                    </div>
                    <input type="text" readOnly value={dataForm.kategoriTarif} className="input input-sm input-bordered w-full " />
                </div>
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Nama Tarif</span>
                    </div>
                    <input type="text" defaultValue={dataForm.namaTarif} {...register("namaTarif", { required: "Tidak boleh kosong!" })} className="input input-sm input-primary w-full " />
                </div>
                {errors.namaTarif &&
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.namaTarif.message}</span>
                    </label>
                }
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Harga Tarif</span>
                    </div>
                    <input type="number" defaultValue={dataForm.hargaTarif} {...register("hargaTarif", { required: "Tidak boleh kosong!" })} className="input input-sm input-primary w-full " />
                </div>
                {errors.hargaTarif &&
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.hargaTarif.message}</span>
                    </label>
                }
                {data?.user.role !== "tester" &&
                    <button className="btn btn-sm btn-primary btn-block">EDIT</button>
                }
            </form>
        </div>
    )
}

export default FormEditTarif