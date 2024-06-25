import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../components/AlertHeaderComponent"
import ModalAddDokter from "./pageclient/ModalAddDokter"
import DokterTableColumn from "./DokterTableColumn"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"

const getDataDokter = async (idFasyankes: string) => {
    try {
        const getDb = await prisma.profile.findMany(
            {
                where: {
                    idFasyankes,
                    profesi: 'Dokter'
                },
                include: {
                    poliklinik: {
                        select: {
                            namaPoli: true
                        }
                    }
                }
            }
        )
        return getDb
    } catch (error) {
        return []
    }
}
const PageDokter = async () => {
    const session = await getServerSession(authOption)
    const data = await getDataDokter(session?.user.idFasyankes)
    return (
        <>
            <AlertHeaderComponent message="List dokter" />
            <ModalAddDokter session={session} />
            <TableFilterComponent rowsData={data} columnsData={DokterTableColumn} />
        </>
    )
}

export default PageDokter