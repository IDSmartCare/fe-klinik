import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import TableFilterComponent from "@/app/components/TableFilterComponent"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import FarmasiTableColumn from "./FarmasiTableColumn"
const getData = async (idFasyankes: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/cppt/listfarmasi/${idFasyankes}`, {
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

const PageFarmasi = async () => {
    const session = await getServerSession(authOption)
    const data = await getData(session?.user.idFasyankes)
    return (
        <>
            <AlertHeaderComponent message="Pasien terdaftar hari ini" />
            <TableFilterComponent rowsData={data} columnsData={FarmasiTableColumn} />
        </>
    )
}

export default PageFarmasi