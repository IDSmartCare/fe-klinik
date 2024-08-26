import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import PerawatTableColumn from "./PerawatTableColumn"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import FilterPasienComponent from "@/app/components/FilterPasienComponent"

const getData = async (idFasyankes: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/listregistrasi/${idFasyankes}`, {
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
const PagePerawat = async () => {
    const session = await getServerSession(authOption)
    const data = await getData(session?.user.idFasyankes)
    return (
        <>
            <FilterPasienComponent />
            <AlertHeaderComponent message="Pasien terdaftar hari ini" />
            <TableFilterComponent rowsData={data} columnsData={PerawatTableColumn} />
        </>
    )
}

export default PagePerawat