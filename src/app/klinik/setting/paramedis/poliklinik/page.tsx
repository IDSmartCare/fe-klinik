import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../components/AlertHeaderComponent"
import ModalAddPoli from "./pageclient/ModalAddPoli"
import { PrismaClient } from "@prisma/client"
import PoliTableColumn from "./PoliTableColumn"

const prisma = new PrismaClient()
const getDataPoli = async () => {
    try {
        const getDb = await prisma.poliKlinik.findMany()
        return getDb
    } catch (error) {
        return []
    }
}

const PagePoli = async () => {
    const data = await getDataPoli()
    return (
        <>
            <AlertHeaderComponent message="List poliklinik" />
            <ModalAddPoli />
            <TableFilterComponent rowsData={data} columnsData={PoliTableColumn} />
        </>
    )
}

export default PagePoli