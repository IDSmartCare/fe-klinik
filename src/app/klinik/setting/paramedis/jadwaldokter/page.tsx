import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent"
import TableFilterComponent from "@/app/components/TableFilterComponent"
import ModalAddJadwal from "./pageclient/ModalAddJadwal"
import JadwalTableColumn from "./JadwalTableColumn"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"

const getData = async (idFasyankes: string) => {
    try {
        const getDb = await prisma.jadwalDokter.findMany({
            where: {
                idFasyankes
            },
            include: {
                dokter: {
                    include: {
                        poliklinik: {
                            select: {
                                namaPoli: true,
                                kodePoli: true
                            }
                        }
                    }
                }
            }
        })
        return getDb
    } catch (error) {
        return []
    }
}

const PageMasterJadwalDokter = async () => {
    const session = await getServerSession(authOption)
    const data = await getData(session?.user.idFasyankes)
    return (
        <>
            <AlertHeaderComponent message="List jadwal dokter" />
            <ModalAddJadwal session={session} />
            <TableFilterComponent rowsData={data} columnsData={JadwalTableColumn} />
        </>
    )
}

export default PageMasterJadwalDokter