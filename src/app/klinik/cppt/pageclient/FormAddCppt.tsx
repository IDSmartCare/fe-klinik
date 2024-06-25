'use client'

import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent"
import { SubmitHandler, useForm } from "react-hook-form"
import { typeFormCppt } from "../interface/typeFormCppt"
import { createCppt } from "../[...id]/actionAddCppt"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { Session } from "next-auth"

const FormAddCppt = ({ idregis, idpasien, session }: { idregis: string, idpasien: string, session: Session | null }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<typeFormCppt>()

    const onSubmit: SubmitHandler<typeFormCppt> = async (form) => {
        const body = {
            ...form,
            pendaftaranId: Number(idregis),
            profesi: session?.user.profesi,
            profileId: session?.user.idProfile,
            isDokter: session?.user.role === "dokter" || false,
            isVerifDokter: session?.user.role === "dokter" || false,
            jamVerifDokter: session?.user.role === "dokter" ? new Date() : null
        }
        const post = await createCppt(body, idpasien, session?.user.idFasyankes)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
            reset()
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
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
            <SubmitButtonServer />
        </form>
    )
}

export default FormAddCppt