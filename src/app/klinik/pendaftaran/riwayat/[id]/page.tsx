import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import { format } from "date-fns";

const getData = async (id: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/byid/${id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            }
        })
        if (!getapi.ok) {
            return []
        }
        return getapi.json()
    } catch (error) {
        console.log(error);
        return []
    }
}

const getRegistrasi = async (id: string) => {

    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/riwayatregistrasi/${id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            }
        })
        if (!getapi.ok) {
            return []
        }
        return getapi.json()
    } catch (error) {
        console.log(error);
        return []
    }

}
const PageRiwayatPendaftaran = async ({ params }: { params: { id: string } }) => {
    const resApi = await getData(params.id)
    const regisTrasi = await getRegistrasi(params.id)

    return (
        <div className="flex flex-col gap-2">
            <PasienIdentitasComponent pasien={resApi} />
            <div className="card text-info-content border">
                <div className="card-body">
                    {regisTrasi.map((item: any) => {
                        return (
                            <table key={item.id} className="table table-zebra table-sm">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className="text-xl">Episode {item.episode}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.pendaftaran.map((reg: any) => {
                                        return (
                                            <tr key={reg.id}>
                                                <td>
                                                    <div className="flex">
                                                        <div className="w-1/4 flex flex-col gap-2">
                                                            <p>NO REGIS</p>
                                                            <p>TGL KUNJUNGAN</p>
                                                            <p>HARI</p>
                                                            <p>DOKTER</p>
                                                            <p>POLIKLINIK</p>
                                                            <p>JAM PRAKTEK</p>
                                                            <p>PENJAMIN</p>
                                                            <p>NAMA ASURANSI</p>
                                                        </div>
                                                        <div className="w-full flex flex-col gap-2">
                                                            <p>: {reg.id}</p>
                                                            <p>: {format(reg.createdAt, 'dd/MM/yyyy HH:mm')}</p>
                                                            <p>: {reg.jadwal?.hari}</p>
                                                            <p>: {reg.jadwal?.dokter.namaLengkap}</p>
                                                            <p>: {reg.jadwal?.dokter.poliklinik?.namaPoli}</p>
                                                            <p>: {reg.jadwal?.jamPraktek}</p>
                                                            <p>: {reg.penjamin}</p>
                                                            <p>: {reg.namaAsuransi}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PageRiwayatPendaftaran