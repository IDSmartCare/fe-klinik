'use client'

import ButtonModalComponent, { icon } from "@/app/components/ButtonModalComponent"
import { useEffect, useId, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import Select from 'react-select'
import { typeFormPoliklinik } from "../../paramedis/poliklinik/interface/typeFormPoliklinik"
import { Session } from "next-auth"
import { FormAddUser } from "../interface/typeFormUser"
import { createUser } from "./simpanUser"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { postApiBisnisOwner } from "@/app/lib/apiBisnisOwner"
import { useRouter } from "next/navigation"

const ModalAddUser = ({ session }: { session: Session | null }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm<FormAddUser>()
    const uuid = useId()
    const route = useRouter()
    const [showFieldDokter, setShowFieldDokter] = useState(false)
    const [option, setOption] = useState<any[]>([])

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
    }, [session?.user.idFasyankes])
    const onSubmit: SubmitHandler<FormAddUser> = async (data) => {
        const post = await createUser(data, session?.user.idFasyankes)
        if (post.status) {
            const body = {
                username: data.username,
                password: data.password,
                password_confirmation: data.confirmPassword,
                created_by: data.createdBy,
                role: data.role.value,
                fasyankes_id: session?.user.idFasyankes,
                id_profile: post.data?.id
            }
            const posttoApi = await postApiBisnisOwner({
                url: "access-fasyankes/store", data: body
            })
            ToastAlert({ icon: 'success', title: posttoApi.message })
            reset()
            setTimeout(() => {
                route.refresh()
            }, 1000);
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
    }
    const onChangeRole = (e: any) => {
        if (e.target.value) {
            const val = e.target.value;
            if (val.value === "dokter") {
                setShowFieldDokter(true)
            } else {
                setShowFieldDokter(false)
            }
        }

    }
    return (
        <div className="self-end">
            <ButtonModalComponent icon={icon.add} modalname="add-user" title="User Baru" />
            <dialog id="add-user" className="modal">
                <div className="modal-box w-8/12 max-w-3xl h-screen">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Tambah User Baru</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-5">
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Username</span>
                            </div>
                            <input type="text" {...register("username", {
                                required: "*Tidak boleh kosong", pattern: {
                                    value: /^[a-zA-Z\s]+$/,
                                    message: 'Nama tidak valid'
                                }
                            })} className="input input-primary w-full input-sm" />
                            {errors.username &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.username.message}</span>
                                </label>
                            }
                        </div>
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Password</span>
                            </div>
                            <input type="password" {...register('password', { required: "*Tidak boleh kosong" })} className="input input-sm input-primary w-full " />
                            {errors.password &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password.message}</span>
                                </label>
                            }
                        </div>
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Password Confirm</span>
                            </div>
                            <input type="password" {...register('confirmPassword', { required: "*Tidak boleh kosong" })} className="input input-sm input-primary w-full " />

                            {errors.confirmPassword &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.confirmPassword.message}</span>
                                </label>
                            }
                        </div>
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Role</span>
                            </div>
                            <Controller
                                name="role"
                                control={control}
                                rules={{
                                    required: "*Tidak boleh kosong",
                                    onChange: (e) => onChangeRole(e)
                                }}
                                render={({ field }) => <Select
                                    {...field}
                                    instanceId={uuid}
                                    className="w-full"
                                    isClearable
                                    options={[
                                        { value: "admin", label: "Admin" },
                                        { value: "admisi", label: "Pendaftaran" },
                                        { value: "dokter", label: "Dokter" },
                                        { value: "perawat", label: "Perawat" },
                                        { value: "farmasi", label: "Farmasi" },
                                        { value: "kasir", label: "Kasir" },
                                    ]}
                                />}
                            />
                            {errors.role &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.role.message?.toString()}</span>
                                </label>
                            }
                        </div>
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Created By</span>
                            </div>
                            <input type="text" {...register('createdBy', { required: "*Tidak boleh kosong" })} className="input input-sm input-primary w-full " />
                            {errors.createdBy &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.createdBy.message}</span>
                                </label>
                            }
                        </div>
                        <div className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Nama Lengkap</span>
                            </div>
                            <input type="text" {...register('namaLengkap', { required: "*Tidak boleh kosong" })} className="input input-sm input-primary w-full " />
                            {errors.namaLengkap &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.namaLengkap.message}</span>
                                </label>
                            }
                        </div>
                        {showFieldDokter &&
                            <>
                                <div className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text">Pilih Poli Dokter</span>
                                    </div>
                                    <Controller
                                        name="poliklinik"
                                        control={control}
                                        render={({ field }) => <Select
                                            {...field}
                                            isClearable
                                            placeholder="Pilih poli dokter"
                                            instanceId={uuid}
                                            options={option}
                                        />}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text">Kode Dokter</span>
                                    </div>
                                    <input type="text" {...register('kodedokter')} className="input input-sm input-primary w-full " />
                                </div>
                            </>
                        }
                        <button className="btn btn-primary btn-block btn-sm">Simpan</button>
                    </form>
                </div>
            </dialog>
        </div>
    )
}

export default ModalAddUser