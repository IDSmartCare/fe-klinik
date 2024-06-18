import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../components/AlertHeaderComponent"
import ModalAddDokter from "./pageclient/ModalAddDokter"
import DokterTableColumn from "./DokterTableColumn"
import prisma from "@/db"

const getDataDokter = async () => {
    try {
        const getDb = await prisma.dokter.findMany(
            {
                include: {
                    poliKlinik: {
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
    const data = await getDataDokter()
    return (
        <>
            <AlertHeaderComponent message="List dokter" />
            <ModalAddDokter />
            <TableFilterComponent rowsData={data} columnsData={DokterTableColumn} />
        </>
    )
}

export default PageDokter