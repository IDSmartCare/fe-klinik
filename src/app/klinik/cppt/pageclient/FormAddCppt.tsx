'use client'

import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent"
import { SubmitHandler, useForm } from "react-hook-form"
import { typeFormCppt } from "../interface/typeFormCppt"
import { createCppt } from "../[...id]/actionAddCppt"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { Session } from "next-auth"
import { useState } from "react"

const FormAddCppt = ({ idregis, idpasien, session }: { idregis: string, idpasien: string, session: Session | null }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<typeFormCppt>()
    const [resep, setResep] = useState("")
    const [listResep, setListResep] = useState<any[]>([])

    const onSubmit: SubmitHandler<typeFormCppt> = async (form) => {
        const body = {
            ...form,
            pendaftaranId: Number(idregis),
            profesi: session?.user.profesi,
            profileId: session?.user.idProfile,
            isDokter: session?.user.role === "dokter" || false,
            isVerifDokter: session?.user.role === "dokter" || false,
            jamVerifDokter: session?.user.role === "dokter" ? new Date() : null,
            resep: listResep
        }
        const post = await createCppt(body, idpasien, session?.user.idFasyankes)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
            reset()
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
        setListResep([])
    }
    const onClickResep = () => {
        setListResep([resep, ...listResep])
        setResep("")
    }
    const removeResep = (i: number) => {
        const newList = listResep.filter((item, index) => index != i)
        setListResep([...newList])
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
                <div className="flex w-full p-3 gap-2">
                    <div className="form-control w-1/2">
                        <div className="label">
                            <span className="label-text">Resep</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <textarea value={resep} onChange={(e) => setResep(e.target.value)} rows={2} className="textarea textarea-primary w-full"></textarea>
                            <button onClick={() => onClickResep()} className="btn h-full self-center btn-sm btn-warning" type="button">Tambah</button>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col gap-2">
                        <div className="label">
                            <span className="label-text">List Resep</span>
                        </div>
                        {listResep.map((item, index) => {
                            return (
                                <div className="bg-base-300 p-2 rounded flex justify-between items-center" key={index}>
                                    <div className="italic flex gap-2">
                                        <p className="font-bold"> R/ </p>
                                        <p>{item}</p>
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
            }
            <SubmitButtonServer />
        </form>
    )
}

export default FormAddCppt