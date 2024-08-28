import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import KasirTableCoulumn from "./KasirTableColumn"


const getData = async (idFasyankes: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/riwayatregistrasi/byfaskes/${idFasyankes}`, {
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

const PageKasir = async () => {
    const session = await getServerSession(authOption)
    const data = await getData(session?.user.idFasyankes)
    return (
        <>
            <AlertHeaderComponent message="Pasien terdaftar hari ini" />
            <TableFilterComponent rowsData={data} columnsData={KasirTableCoulumn} />
        </>
    )
}

export default PageKasir