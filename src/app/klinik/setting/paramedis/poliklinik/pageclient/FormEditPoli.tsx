'use client'

import { ToastAlert } from "@/app/helper/ToastAlert"
import { useRouter } from "next/navigation"


const FormEditPoli = ({ data }: { data: any }) => {
    const route = useRouter()
    const onSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const fetchBody = await fetch('/api/paramedis/updatenamapoli', {
                method: "POST",
                body: JSON.stringify({ namaPoli: e.target.namaPoli.value, id: data.id }),
                headers: {
                    "content-type": "application/json"
                }
            })
            const res = await fetchBody.json()
            if (res.id) {
                ToastAlert({ icon: 'success', title: "Berhasil!" })
                route.refresh()
            } else {
                ToastAlert({ icon: 'error', title: "Error" })
            }

        } catch (error: any) {
            ToastAlert({ icon: 'error', title: error.message })
        }

    }
    return (
        <div className="flex w-1/2" onSubmit={onSubmit}>
            <form className="w-full">
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Kode Poli</span>
                    </div>
                    <input type="text" readOnly value={data.kodePoli} className="input input-bordered w-full input-sm" />
                </div>
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Nama Poli</span>
                    </div>
                    <input type="text" defaultValue={data.namaPoli} name="namaPoli" className="input input-primary w-full input-sm" />
                </div>
                <button className="btn btn-sm btn-primary btn-block mt-2">EDIT</button>
            </form>
        </div>
    )
}

export default FormEditPoli