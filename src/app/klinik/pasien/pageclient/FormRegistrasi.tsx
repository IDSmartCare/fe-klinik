'use client'
import Select from 'react-select'
import AlertHeaderComponent from '../../setting/paramedis/components/AlertHeaderComponent'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { typeFormRegis } from '../interface/typeFormRegistrasi'
import { useEffect, useId, useState } from 'react'
import { SubmitButtonServer } from '@/app/components/SubmitButtonServerComponent'
import { typeFormJadwal } from '../../setting/paramedis/jadwaldokter/interface/typeFormJadwal'
import { createRegistrasi } from '../registrasi/[id]/action'
import { ToastAlert } from '@/app/helper/ToastAlert'
const FormRegistrasi = ({ idpasien }: { idpasien: string }) => {
    const [ifAsuransi, setIfAsuransi] = useState(false)
    const [namaAsuransi, setNamaAsuransi] = useState("")

    const {
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm<typeFormRegis>()

    const uuid = useId()
    const [dokter, setDokter] = useState<{ label: string, value: string }[]>([])

    useEffect(() => {
        const getDokter = async () => {
            const hari = new Date().getDay()
            const resDokter = await fetch(`/api/paramedis/getjadwaldokter?hari=${hari}`)
            if (!resDokter.ok) {
                setDokter([])
                return
            }
            const dataDokter = await resDokter.json()
            const newArr = dataDokter.map((item: typeFormJadwal) => {
                return {
                    value: item.id,
                    label: `${item.dokter?.namaDokter}-${item.dokter?.poliKlinik.kodePoli} (${item.jamPraktek})`
                }
            })
            setDokter([...newArr])
        }
        getDokter()

    }, [])
    const onSubmit: SubmitHandler<typeFormRegis> = async (data) => {
        const bodyPost = {
            pasienId: Number(idpasien),
            jadwalDokterId: data.jadwalDokterId.value,
            penjamin: data.penjamin.value,
            namaAsuransi: namaAsuransi.length > 0 ? namaAsuransi : null
        }
        const post = await createRegistrasi(bodyPost)
        if (post.status) {
            ToastAlert({ icon: 'success', title: post.message as string })
            reset()
        } else {
            ToastAlert({ icon: 'error', title: post.message as string })
        }

    }

    const onChangePenjamin = (e: any) => {
        const targetValue = e.target.value
        if (targetValue) {
            if (e.target.value.value === 'ASURANSI') {
                setIfAsuransi(true)
            } else {
                setIfAsuransi(false)
                setNamaAsuransi("")
            }
        }

    }
    return (
        <div className="flex gap-2">
            <div className='w-1/2' >
                <AlertHeaderComponent message='Registrasi Baru' />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Dokter Yang Tersedia Hari Ini</span>
                        </div>
                        <Controller
                            name="jadwalDokterId"
                            control={control}
                            rules={{
                                required: "*Silahkan pilih",
                                onChange: (e) => onChangePenjamin(e)
                            }}
                            render={({ field }) => <Select
                                {...field}
                                isClearable
                                instanceId={uuid}
                                options={dokter}
                            />}
                        />
                        {errors.jadwalDokterId &&
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.jadwalDokterId.message?.toString()}</span>
                            </label>
                        }
                    </div>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Penjamin</span>
                        </div>
                        <Controller
                            name="penjamin"
                            control={control}
                            rules={{
                                required: "*Silahkan pilih",
                                onChange: (e) => onChangePenjamin(e)
                            }}
                            render={({ field }) => <Select
                                {...field}
                                isClearable
                                instanceId={uuid}
                                options={[
                                    { value: "BPJS", label: "BPJS" },
                                    { value: "PRIBADI", label: "PRIBADI" },
                                    { value: "ASURANSI", label: "ASURANSI" },
                                ]}
                            />}
                        />
                        {errors.penjamin &&
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.penjamin.message?.toString()}</span>
                            </label>
                        }
                        {ifAsuransi &&
                            <div className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Nama Asuransi</span>
                                </div>
                                <input type="text" value={namaAsuransi} onChange={(e) => setNamaAsuransi(e.target.value)} className="input input-primary w-full input-sm" />
                            </div>
                        }
                    </div>
                    <div className='mt-3'>
                        <SubmitButtonServer />
                    </div>
                </form>
            </div>
            <div className='w-1/2'>
                <AlertHeaderComponent message='Riwayat registrasi pasien' />
            </div>

        </div>
    )
}

export default FormRegistrasi