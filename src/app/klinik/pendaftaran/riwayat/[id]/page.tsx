import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import prisma from "@/db";
import { format } from "date-fns";

const getData = async (id: string) => {
    try {
        const getDb = await prisma.pasien.findFirst({
            where: {
                id: Number(id)
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return null
    }
}

const getRegistrasi = async (id: string) => {
    try {
        const getDb = await prisma.episodePendaftaran.findMany({
            where: {
                pasienId: Number(id)
            },
            include: {
                pendaftaran: {
                    select: {
                        penjamin: true,
                        id: true,
                        namaAsuransi: true,
                        createdAt: true,
                        jadwal: {

                            include: {
                                dokter: {
                                    include: {
                                        poliKlinik: {
                                            select: {
                                                namaPoli: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        return getDb
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
                    {regisTrasi.map((item) => {
                        return (
                            <table key={item.id} className="table table-zebra table-sm">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className="text-xl">Episode {item.episode}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.pendaftaran.map((reg) => {
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
                                                            <p>: {reg.jadwal?.dokter.namaDokter}</p>
                                                            <p>: {reg.jadwal?.dokter.poliKlinik?.namaPoli}</p>
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