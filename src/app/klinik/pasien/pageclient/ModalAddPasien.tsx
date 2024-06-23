'use client'

import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { ToastAlert } from "@/app/helper/ToastAlert"
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent"
import { typeFormPasienBaru } from "../interface/typeFormPasienBaru"
import ButtonModalComponent, { icon } from "../../../components/ButtonModalComponent"
import Select from 'react-select'
import { useEffect, useId, useState } from "react"
import { createPasien } from "../action"
import { Session } from "next-auth"

const ModalAddPasien = ({ session }: { session: Session | null }) => {
    const uuid = useId()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm<typeFormPasienBaru>()
    const [domisili, setDomisili] = useState(true)
    const [agamaLainnya, setAgamaLainnya] = useState(false)
    const [textAgamaLain, setTextAgamaLain] = useState('')
    const [pekerjaanLainnya, setPekerjaanLainnya] = useState(false)
    const [textPekerjaanLain, setTextPekerjaanLain] = useState('')
    const [listKota, setListKota] = useState<{ label: string, value: string }[]>([])
    const [listKecamatan, setListKecamatan] = useState<{ label: string, value: string }[]>([])
    const [listKelurahan, setListKelurahan] = useState<{ label: string, value: string }[]>([])
    const [listKotaDomisili, setListKotaDomisili] = useState<{ label: string, value: string }[]>([])
    const [listKecamatanDomisili, setListKecamatanDomisili] = useState<{ label: string, value: string }[]>([])
    const [listKelurahanDomisili, setListKelurahanDomisili] = useState<{ label: string, value: string }[]>([])
    const [listProvinsi, setListProvinsi] = useState<{ label: string, value: string }[]>([])

    useEffect(() => {
        const getProv = async () => {
            try {
                const getProv = await fetch(`/api/wilayah/provinsi`)
                const resProv = await getProv.json()
                const newArr = resProv?.prov.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                })
                setListProvinsi([...newArr])
            } catch (error) {
                console.log(error);
                setListProvinsi([])
            }
        }
        getProv()
    }, [])
    const onSubmit: SubmitHandler<typeFormPasienBaru> = async (data) => {

        const alamat = {
            provinsi: data.provinsi.label,
            idProv: data.provinsi.value,
            kota: data.kota.label,
            idKota: data.kota.value,
            kecamatan: data.kecamatan.label,
            idKecamatan: data.kecamatan.value,
            kelurahan: data.kelurahan.label,
            idKelurahan: data.kelurahan.value,
            rt: Number(data.rt),
            rw: Number(data.rw),
        }
        const domisiliBody = {
            alamatDomisili: data.alamat,
            provinsiDomisili: alamat.provinsi,
            kotaDomisili: alamat.kota,
            kecamatanDomisili: alamat.kecamatan,
            kelurahanDomisili: alamat.kelurahan,
            idProvDomisili: alamat.idProv,
            idKotaDomisili: alamat.idKota,
            idKecamatanDomisili: alamat.idKecamatan,
            idKelurahanDomisili: alamat.idKelurahan,
            rtDomisili: alamat.rt,
            rwDomisili: alamat.rw,
            kodePosDomisili: data.kodePos
        }
        const convertObtDomisili = {
            provinsiDomisili: data.provinsiDomisili?.label,
            idProvDomisili: data.provinsiDomisili?.value,
            kotaDomisili: data.kotaDomisili?.label,
            idKotaDomisili: data.kotaDomisili?.value,
            kecamatanDomisili: data.kecamatanDomisili?.label,
            idKecamatanDomisili: data.kecamatanDomisili?.value,
            kelurahanDomisili: data.kelurahanDomisili?.label,
            idKelurahanDomisili: data.kelurahanDomisili?.value,
            rtDomisili: Number(data.rtDomisili),
            rwDomisili: Number(data.rwDomisili)
        }
        const bodyToPost = {
            ...data,
            agama: textAgamaLain || data.agama.value,
            pendidikan: data.pendidikan.value,
            pekerjaan: textPekerjaanLain || data.pekerjaan.value,
            statusMenikah: data.statusMenikah.value,
            ...alamat,
            ...(domisili && domisiliBody),
            ...(!domisili && convertObtDomisili)

        }
        const post = await createPasien(bodyToPost, session?.user.idFasyankes)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
            reset()
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }
    }


    const onChangeAgama = (e: any) => {
        const targetValue = e.target.value
        if (targetValue) {
            if (e.target.value.value === 'LAINNYA') {
                setAgamaLainnya(true)
            } else {
                setAgamaLainnya(false)
                setTextAgamaLain('')
            }
        }
    }
    const onChangePekerjaan = (e: any) => {
        const targetValue = e.target.value
        if (targetValue) {
            if (e.target.value.value === 'LAINNYA') {
                setPekerjaanLainnya(true)
            } else {
                setPekerjaanLainnya(false)
                setTextPekerjaanLain('')
            }
        }
    }
    const onChangeProvinsi = async (e: any) => {
        if (e) {
            const getKota = await fetch(`/api/wilayah/kota?id=${e.value}`)
            const resKota = await getKota.json()
            const newArr = resKota?.kota.map((item: any) => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListKota([...newArr])
        } else {
            setListKota([])
            setListKecamatan([])
            setListKelurahan([])
        }
    }

    const onChangeKota = async (e: any) => {
        if (e) {
            const getData = await fetch(`/api/wilayah/kecamatan?id=${e.value}`)
            const resData = await getData.json()
            const newArr = resData?.kota.map((item: any) => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListKecamatan([...newArr])
        } else {
            setListKecamatan([])
            setListKelurahan([])
        }
    }

    const onChangeKecamatan = async (e: any) => {
        if (e) {
            const getData = await fetch(`/api/wilayah/kelurahan?id=${e.value}`)
            const resData = await getData.json()
            const newArr = resData?.kota.map((item: any) => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListKelurahan([...newArr])
        } else {
            setListKelurahan([])
        }
    }

    const onChangeProvinsiDomisili = async (e: any) => {
        if (e) {
            const getKota = await fetch(`/api/wilayah/kota?id=${e.value}`)
            const resKota = await getKota.json()
            const newArr = resKota?.kota.map((item: any) => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListKotaDomisili([...newArr])
        } else {
            setListKotaDomisili([])
            setListKecamatanDomisili([])
            setListKelurahanDomisili([])
        }
    }

    const onChangeKotaDomisili = async (e: any) => {
        if (e) {
            const getData = await fetch(`/api/wilayah/kecamatan?id=${e.value}`)
            const resData = await getData.json()
            const newArr = resData?.kota.map((item: any) => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListKecamatanDomisili([...newArr])
        } else {
            setListKecamatanDomisili([])
            setListKelurahanDomisili([])
        }
    }

    const onChangeKecamatanDomisili = async (e: any) => {
        if (e) {
            const getData = await fetch(`/api/wilayah/kelurahan?id=${e.value}`)
            const resData = await getData.json()
            const newArr = resData?.kota.map((item: any) => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setListKelurahanDomisili([...newArr])
        } else {
            setListKelurahanDomisili([])
        }
    }
    return (
        <div className="self-end">
            <ButtonModalComponent icon={icon.add} modalname="add-pasien" title="Pasien Baru" />
            <dialog id="add-pasien" className="modal">
                <div className="modal-box w-11/12 max-w-6xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Tambah Pasien Baru</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                        <div className="flex-1">
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Nama Pasien</span>
                                </div>
                                <input type="text" {...register("namaPasien", { required: "*Tidak boleh kosong" })} className="input input-primary w-full input-sm max-w-xs" />
                                {errors.namaPasien &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.namaPasien.message}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">NIK</span>
                                </div>
                                <input type="number" {...register("nik")} className="input input-primary w-full input-sm max-w-xs" />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">No. BPJS</span>
                                </div>
                                <input type="number" {...register("bpjs")} className="input input-primary w-full input-sm max-w-xs" />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">No. Asuransi Lain</span>
                                </div>
                                <input type="text" {...register("noAsuransi")} className="input input-primary w-full input-sm max-w-xs" />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">No. Paspor</span>
                                </div>
                                <input type="text" {...register("paspor")} className="input input-primary w-full input-sm max-w-xs" />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">HP</span>
                                </div>
                                <input type="number" {...register("noHp", { required: "*Tidak boleh kosong" })} className="input input-primary w-full input-sm max-w-xs" />
                                {errors.noHp &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.noHp.message}</span>
                                    </label>
                                }
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Tempat Lahir</span>
                                </div>
                                <input type="text" {...register("tempatLahir", { required: "*Tidak boleh kosong" })} className="input input-primary w-full input-sm max-w-xs" />
                                {errors.tempatLahir &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tempatLahir.message}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Tgl. Lahir</span>
                                </div>
                                <input type="date" {...register("tanggalLahir", { required: "*Tidak boleh kosong" })} className="input input-primary w-full input-sm max-w-xs" />
                                {errors.tanggalLahir &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tanggalLahir.message}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Jenis Kelamin</span>
                                </div>
                                <div className="flex gap-2 ml-2">
                                    <span className="label-text">Laki-Laki</span>
                                    <input type="radio" {...register("jenisKelamin", { required: "*Tidak boleh kosong" })} value={"L"} className="radio radio-primary" />
                                    <span className="label-text">Perempuan</span>
                                    <input type="radio" {...register("jenisKelamin", { required: "*Tidak boleh kosong" })} value={"P"} className="radio radio-primary" />
                                </div>
                                {errors.jenisKelamin &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.jenisKelamin.message}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Status Menikah</span>
                                </div>
                                <Controller
                                    name="statusMenikah"
                                    control={control}
                                    rules={{
                                        required: "*Tidak boleh kosong"
                                    }}
                                    render={({ field }) => <Select
                                        {...field}
                                        isClearable
                                        instanceId={uuid}
                                        options={[
                                            { value: "BELUM_KAWIN", label: "BELUM KAWIN" },
                                            { value: "KAWIN", label: "KAWIN" },
                                            { value: "CERAI_HIDUP", label: "CERAI HIDUP" },
                                            { value: "CERAI_MATI", label: "CERAI MATI" },
                                        ]}
                                    />}
                                />
                                {errors.statusMenikah &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.statusMenikah.message?.toString()}</span>
                                    </label>
                                }
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Nama Ibu</span>
                                </div>
                                <input type="text" {...register("ibuKandung", { required: "*Tidak boleh kosong" })} className="input input-primary w-full input-sm max-w-xs" />
                                {errors.ibuKandung &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.ibuKandung.message}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Bahasa</span>
                                </div>
                                <input type="text" {...register("bahasa")} className="input input-primary w-full input-sm max-w-xs" />
                            </div>

                        </div>
                        <div className="flex-1">

                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Warganegara</span>
                                </div>
                                <input type="text" {...register("wargaNegara")} className="input input-primary w-full input-sm max-w-xs" />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Pendidikan</span>
                                </div>
                                <Controller
                                    name="pendidikan"
                                    control={control}
                                    rules={{
                                        required: "*Tidak boleh kosong"
                                    }}
                                    render={({ field }) => <Select
                                        {...field}
                                        isClearable
                                        instanceId={uuid}
                                        options={[
                                            { value: "TS", label: "TIDAK SEKOLAH" },
                                            { value: "SD", label: "SD" },
                                            { value: "SMP", label: "SMP SEDERAJAT" },
                                            { value: "SMA", label: "SMA SEDERAJAT" },
                                            { value: "D1", label: "D1-D3 SEDERAJAT" },
                                            { value: "D4", label: "D4" },
                                            { value: "S1", label: "S1" },
                                            { value: "S2", label: "S2" },
                                            { value: "S3", label: "S3" },
                                        ]}
                                    />}
                                />
                                {errors.pendidikan &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.pendidikan.message?.toString()}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Agama</span>
                                </div>
                                <Controller
                                    name="agama"
                                    control={control}
                                    rules={{
                                        required: "*Tidak boleh kosong",
                                        onChange: (e) => onChangeAgama(e)
                                    }}
                                    render={({ field }) => <Select
                                        {...field}
                                        instanceId={uuid}
                                        options={[
                                            { value: "ISLAM", label: "ISLAM" },
                                            { value: "KRISTEN", label: "KRISTEN (PROTESTAN)" },
                                            { value: "KATOLIK", label: "KATOLIK" },
                                            { value: "HINDU", label: "HINDU" },
                                            { value: "BUDHA", label: "BUDHA" },
                                            { value: "KONGHUCU", label: "KONGHUCU" },
                                            { value: "PENGHAYAT", label: "PENGHAYAT" },
                                            { value: "LAINNYA", label: "LAIN-LAIN" },
                                        ]}
                                    />}
                                />
                                {errors.agama &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.agama.message?.toString()}</span>
                                    </label>
                                }
                            </div>
                            {agamaLainnya &&
                                <div className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Lainnya</span>
                                    </div>
                                    <input type="text" value={textAgamaLain} onChange={(e) => setTextAgamaLain(e.target.value)} className="input input-primary w-full input-sm max-w-xs" />
                                </div>
                            }
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Pekerjaan</span>
                                </div>
                                <Controller
                                    name="pekerjaan"
                                    control={control}
                                    rules={{
                                        required: "*Tidak boleh kosong",
                                        onChange: (e) => onChangePekerjaan(e)
                                    }}
                                    render={({ field }) => <Select
                                        {...field}
                                        instanceId={uuid}
                                        options={[
                                            { value: "TIDAK_BEKERJA", label: "TIDAK BEKERJA" },
                                            { value: "PNS", label: "PNS" },
                                            { value: "TNI/POLRI", label: "TNI/POLRI" },
                                            { value: "BUMN", label: "BUMN" },
                                            { value: "SWASTA", label: "PEGAWAI SWASTA / WIRAUSAHA" },
                                            { value: "LAINNYA", label: "LAIN-LAIN" },
                                        ]}
                                    />}
                                />
                                {errors.pekerjaan &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.pekerjaan.message?.toString()}</span>
                                    </label>
                                }
                            </div>
                            {pekerjaanLainnya &&
                                <div className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Lainnya</span>
                                    </div>
                                    <input type="text" value={textPekerjaanLain} onChange={(e) => setTextPekerjaanLain(e.target.value)} className="input input-primary w-full input-sm max-w-xs" />
                                </div>
                            }

                        </div>
                        <div className="flex-1">
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Alamat KTP</span>
                                </div>
                                <input type="text" {...register("alamat", { required: "*Tidak boleh kosong" })} className="input input-primary w-full input-sm max-w-xs" />
                                {errors.alamat &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.alamat.message}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">RT / RW</span>
                                </div>
                                <div className="flex gap-2">
                                    <input type="number" {...register("rt", { required: "*RT Tidak boleh kosong" })} className="input input-primary w-full input-sm max-w-xs" />
                                    <input type="number" {...register("rw", { required: "*RW Tidak boleh kosong" })} className="input input-primary w-full input-sm max-w-xs" />
                                </div>
                                <div className="flex">

                                    {errors.rt &&
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.rt.message}</span>
                                        </label>
                                    }
                                    {errors.rw &&
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.rw.message}</span>
                                        </label>
                                    }
                                </div>
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Provinsi</span>
                                </div>
                                <Controller
                                    name="provinsi"
                                    control={control}
                                    rules={{
                                        required: "*Tidak boleh kosong",
                                        onChange: (e) => { onChangeProvinsi(e.target.value) }
                                    }}
                                    render={({ field }) => <Select
                                        {...field}
                                        isClearable
                                        instanceId={uuid}
                                        options={listProvinsi}
                                    />}
                                />
                                {errors.provinsi &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.provinsi.message?.toString()}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Kota / Kab</span>
                                </div>
                                <Controller
                                    name="kota"
                                    control={control}
                                    rules={{
                                        required: "*Tidak boleh kosong",
                                        onChange: (e) => { onChangeKota(e.target.value) }
                                    }}
                                    render={({ field }) => <Select
                                        {...field}
                                        isClearable
                                        instanceId={uuid}
                                        options={listKota}
                                    />}
                                />
                                {errors.kota &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.kota.message?.toString()}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Kecamatan</span>
                                </div>
                                <Controller
                                    name="kecamatan"
                                    control={control}
                                    rules={{
                                        required: "*Tidak boleh kosong",
                                        onChange: (e) => { onChangeKecamatan(e.target.value) }
                                    }}
                                    render={({ field }) => <Select
                                        {...field}
                                        isClearable
                                        instanceId={uuid}
                                        options={listKecamatan}
                                    />}
                                />
                                {errors.kecamatan &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.kecamatan.message?.toString()}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Kelurahan</span>
                                </div>
                                <Controller
                                    name="kelurahan"
                                    control={control}
                                    rules={{
                                        required: "*Tidak boleh kosong"
                                    }}
                                    render={({ field }) => <Select
                                        {...field}
                                        isClearable
                                        instanceId={uuid}
                                        options={listKelurahan}
                                    />}
                                />
                                {errors.kelurahan &&
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.kelurahan.message?.toString()}</span>
                                    </label>
                                }
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Kode Pos</span>
                                </div>
                                <input type="text" {...register("kodePos")} className="input input-primary w-full input-sm max-w-xs" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="label cursor-pointer">
                                <span className="label-text">Domisili Sesuai Dengan KTP</span>
                                <input type="checkbox" onChange={() => setDomisili(!domisili)} checked={domisili} className="checkbox checkbox-primary" />
                            </label>
                            {!domisili &&
                                <>
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Alamat Domisili</span>
                                        </div>

                                        <input type="text" {...register("alamatDomisili")} className="input input-primary w-full input-sm max-w-xs" />
                                    </div>
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">RT / RW Domisili</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="number" {...register("rtDomisili")} className="input input-primary w-full input-sm max-w-xs" />
                                            <input type="number" {...register("rwDomisili")} className="input input-primary w-full input-sm max-w-xs" />
                                        </div>
                                    </div>
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Provinsi Domisili</span>
                                        </div>
                                        <Controller
                                            name="provinsiDomisili"
                                            control={control}
                                            rules={
                                                { onChange: (e) => { onChangeProvinsiDomisili(e.target.value) } }
                                            }
                                            render={({ field }) => <Select
                                                {...field}
                                                isClearable
                                                instanceId={uuid}
                                                options={listProvinsi}
                                            />}
                                        />
                                    </div>
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Kota / Kab Domisili</span>
                                        </div>
                                        <Controller
                                            name="kotaDomisili"
                                            control={control}
                                            rules={
                                                { onChange: (e) => { onChangeKotaDomisili(e.target.value) } }
                                            }
                                            render={({ field }) => <Select
                                                {...field}
                                                isClearable
                                                instanceId={uuid}
                                                options={listKotaDomisili}
                                            />}
                                        />
                                    </div>
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Kecamatan Domisili</span>
                                        </div>
                                        <Controller
                                            name="kecamatanDomisili"
                                            control={control}
                                            rules={
                                                { onChange: (e) => { onChangeKecamatanDomisili(e.target.value) } }
                                            }
                                            render={({ field }) => <Select
                                                {...field}
                                                isClearable
                                                instanceId={uuid}
                                                options={listKecamatanDomisili}
                                            />}
                                        />
                                    </div>
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Kelurahan Domisili</span>
                                        </div>
                                        <Controller
                                            name="kelurahanDomisili"
                                            control={control}
                                            render={({ field }) => <Select
                                                {...field}
                                                isClearable
                                                instanceId={uuid}
                                                options={listKelurahanDomisili}
                                            />}
                                        />
                                    </div>
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Kode Pos Domisili</span>
                                        </div>
                                        <input type="text" {...register("kodePosDomisili")} className="input input-primary w-full input-sm max-w-xs" />
                                    </div>
                                </>
                            }
                            <div className="flex-1 mt-3">
                                <SubmitButtonServer />
                            </div>
                        </div>
                    </form>
                </div>

            </dialog>
        </div>
    )
}

export default ModalAddPasien