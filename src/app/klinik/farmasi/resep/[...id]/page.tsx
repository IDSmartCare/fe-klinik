import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import { authOption } from "@/auth";
import prisma from "@/db";
import { getServerSession } from "next-auth";


const getData = async (id: string, idFasyankes: string) => {
    try {
        const getDb = await prisma.pasien.findFirst({
            where: {
                id: Number(id),
                idFasyankes
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return null
    }
}
const getDataResep = async (id: string, idFasyankes: string) => {
    try {
        const getDb = await prisma.sOAP.findFirst({
            where: {
                idFasyankes,
                pendaftaranId: Number(id)
            },
            include: {
                resep: true
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return null
    }
}

const PageInputResep = async ({ params }: { params: { id: any } }) => {
    const idRegis = params.id[0]
    const idPasien = params.id[1]
    const session = await getServerSession(authOption)
    const data = await getDataResep(idRegis, session?.user.idFasyankes)
    const resApi = await getData(idPasien, session?.user.idFasyankes)

    return (
        <div className="flex flex-col gap-2">
            <PasienIdentitasComponent pasien={resApi} />
            <AlertHeaderComponent message="Resep Dari Dokter" />
            <table className="table table-sm table-zebra">
                <thead className="bg-base-200">
                    <tr>
                        <th>No</th>
                        <th>Nama Obat</th>
                        <th>Jumlah</th>
                        <th>Signa 1</th>
                        <th></th>
                        <th>Signa 2</th>
                        <th>Aturan</th>
                        <th>Waktu</th>
                        <th>Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.resep.map((i, index) => {
                        return (
                            <tr key={i.id}>
                                <td>{index + 1}</td>
                                <td><input type="text" className="input input-sm input-primary" defaultValue={i.namaObat?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-14" defaultValue={i.jumlah?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-14" defaultValue={i.signa1?.toString()} /></td>
                                <td>X</td>
                                <td><input type="text" className="input input-sm input-primary w-14" defaultValue={i.signa2?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-40" defaultValue={i.aturanPakai?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-40" defaultValue={i.waktu?.toString()} /></td>
                                <td><input type="text" className="input input-sm input-primary w-40" defaultValue={i.catatan?.toString()} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default PageInputResep