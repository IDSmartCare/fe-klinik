import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent"
import prisma from "@/db"
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent"


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
const PageCPPT = async ({ params }: { params: { id: any } }) => {
    const idRegis = params.id[0]
    const idPasien = params.id[1]


    const resApi = await getData(idPasien)
    return (

        <>
            <PasienIdentitasComponent pasien={resApi} />
            <AlertHeaderComponent message="10 Catatan Terakhir" />
            <div className="overflow-x-auto">
                <div className="overflow-y-auto h-80">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tgl/Jam</th>
                                <th>Profesi</th>
                                <th>Catatan Pasien Saat Ini</th>
                                <th>Instruksi</th>
                                <th>Verifikasi DPJP</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default PageCPPT