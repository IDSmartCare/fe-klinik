import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent"
import TableFilterComponent from "@/app/components/TableFilterComponent"
import ModalAddJadwal from "./pageclient/ModalAddJadwal"
import { PrismaClient } from "@prisma/client"
import JadwalTableColumn from "./JadwalTableColumn"

const prisma = new PrismaClient()
const getData = async () => {
    try {
        const getDb = await prisma.jadwalDokter.findMany({
            include: {
                dokter: {
                    select: {
                        namaDokter: true,
                        poliKlinik: {
                            select: {
                                namaPoli: true
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
    const data = await getData()
    return (
        <>
            <AlertHeaderComponent message="List jadwal dokter" />
            <ModalAddJadwal />
            <TableFilterComponent rowsData={data} columnsData={JadwalTableColumn} />
        </>
    )
}

export default PageMasterJadwalDokter