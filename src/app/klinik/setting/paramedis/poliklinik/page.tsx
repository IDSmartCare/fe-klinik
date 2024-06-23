import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../components/AlertHeaderComponent"
import ModalAddPoli from "./pageclient/ModalAddPoli"
import PoliTableColumn from "./PoliTableColumn"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"

const getDataPoli = async (idFasyankes: string) => {
    try {
        const getDb = await prisma.poliKlinik.findMany({
            where: {
                idFasyankes
            }
        })
        return getDb
    } catch (error) {
        return []
    }
}

const PagePoli = async () => {
    const session = await getServerSession(authOption)
    const data = await getDataPoli(session?.user.idFasyankes)
    return (
        <>
            <AlertHeaderComponent message="List poliklinik" />
            <ModalAddPoli session={session} />
            <TableFilterComponent rowsData={data} columnsData={PoliTableColumn} />
        </>
    )
}

export default PagePoli