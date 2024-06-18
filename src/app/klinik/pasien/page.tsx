import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
// import FilterPasienComponent from "@/app/components/FilterPasienComponent"
import ModalAddPasien from "./pageclient/ModalAddPasien"
import PasienTableColumn from "./PasienTableColumn"
import prisma from "@/db"

const getData = async () => {
    try {
        const getDb = await prisma.pasien.findMany({
            orderBy: {
                id: 'desc'
            },
            take: 150
        })
        return getDb
    } catch (error) {
        console.log(error);
        return []
    }
}
const PagePasien = async () => {
    const data = await getData()
    return (
        <>
            {/* <FilterPasienComponent /> */}
            <AlertHeaderComponent message="List 150 pasien terakhir" />
            <ModalAddPasien />
            <TableFilterComponent rowsData={data} columnsData={PasienTableColumn} />
        </>
    )
}

export default PagePasien