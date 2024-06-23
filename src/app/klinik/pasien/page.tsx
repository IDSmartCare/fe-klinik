import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
// import FilterPasienComponent from "@/app/components/FilterPasienComponent"
import ModalAddPasien from "./pageclient/ModalAddPasien"
import PasienTableColumn from "./PasienTableColumn"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"

const getData = async (idFasyankes: string) => {
    try {
        const getDb = await prisma.pasien.findMany({
            where: {
                idFasyankes
            },
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
    const session = await getServerSession(authOption)
    const data = await getData(session?.user.idFasyankes)
    return (
        <>
            {/* <FilterPasienComponent /> */}
            <AlertHeaderComponent message="List 150 pasien terakhir" />
            <ModalAddPasien session={session} />
            <TableFilterComponent rowsData={data} columnsData={PasienTableColumn} />
        </>
    )
}

export default PagePasien