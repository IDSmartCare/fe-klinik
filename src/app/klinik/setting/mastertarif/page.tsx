import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../paramedis/components/AlertHeaderComponent"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"

const getTarif = async (idFasyankes: string) => {
    try {
        const getDb = await prisma.masterTarif.findMany(
            {
                where: {
                    idFasyankes,
                },
            }
        )
        return getDb
    } catch (error) {
        return []
    }
}
const MasterTarif = async () => {
    const session = await getServerSession(authOption)
    const tarif = await getTarif(session?.user.idFasyankes)
    console.log(tarif);

    return (
        <>
            <AlertHeaderComponent message="List Tarif" />
            <TableFilterComponent rowsData={[]} columnsData={[]} />
        </>
    )
}

export default MasterTarif