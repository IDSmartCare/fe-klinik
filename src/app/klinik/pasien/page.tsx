import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import FilterPasienComponent from "@/app/components/FilterPasienComponent"
import ModalAddPasien from "./pageclient/ModalAddPasien"
import PasienTableColumn from "./PasienTableColumn"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import PasienTableColumnTester from "./PasienTableColumnTester"

const getData = async (idFasyankes: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/${idFasyankes}`, {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            }
        })
        if (!getapi.ok) {
            return []
        }
        return getapi.json()
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
            <FilterPasienComponent />
            <AlertHeaderComponent message="List 150 pasien terakhir" />
            <ModalAddPasien session={session} />
            {session?.user.role === "tester" ?
                <TableFilterComponent rowsData={data} columnsData={PasienTableColumnTester} />
                :
                <TableFilterComponent rowsData={data} columnsData={PasienTableColumn} />
            }
        </>
    )
}

export default PagePasien