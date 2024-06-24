import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent"
import prisma from "@/db"
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent"
import FormAddCppt from "../pageclient/FormAddCppt"
import { format } from "date-fns"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"

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
const getCppt = async (id: string, idFasyankes: string) => {
    const totalRows = await prisma.sOAP.count();
    const rowsToSkip = totalRows > 10 ? totalRows - 10 : 0;
    try {
        const getDb = await prisma.sOAP.findMany({
            take: 10,
            skip: rowsToSkip,
            orderBy: {
                id: 'asc'
            },
            include: {
                inputBy: {
                    select: {
                        namaLengkap: true
                    }
                }
            },
            where: {
                idFasyankes,
                pendaftaran: {
                    episodePendaftaran: {
                        pasienId: Number(id)
                    }
                }
            },
        })
        return getDb
    } catch (error) {
        console.log(error);
        return []
    }
}
const PageCPPT = async ({ params }: { params: { id: any } }) => {
    const idRegis = params.id[0]
    const idPasien = params.id[1]
    const session = await getServerSession(authOption)

    const resApi = await getData(idPasien, session?.user.idFasyankes)
    const getcppt = await getCppt(idPasien, session?.user.idFasyankes)

    return (
        <div className="flex flex-col gap-2">
            <PasienIdentitasComponent pasien={resApi} />
            <AlertHeaderComponent message="10 Catatan terakhir" />
            <div className="overflow-x-auto">
                <div className="overflow-y-auto h-96">
                    <table className="table table-sm table-zebra">
                        <thead className="bg-base-200">
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
                            {getcppt.map((item, index) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{format(item.createdAt, 'dd/MM/yyyy HH:mm')}</td>
                                        <td>{item.profesi}</td>
                                        <td>
                                            <p>Subjective : {item.subjective}</p>
                                            <p>Objective : {item.objective}</p>
                                            <p>Assesment : {item.assesment}</p>
                                            <p>Plan : {item.plan}</p>
                                            <p className="mt-5 font-bold">Input by : {item.inputBy?.namaLengkap}</p>
                                        </td>
                                        <td>{item.instruksi}</td>
                                        <td></td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
            <AlertHeaderComponent message="Tambah catatan baru" />
            <FormAddCppt idregis={idRegis} idpasien={idPasien} session={session} />
        </div>
    )
}

export default PageCPPT