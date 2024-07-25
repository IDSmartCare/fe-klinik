import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import prisma from "@/db"
import KasirTableCoulumn from "./KasirTableColumn"


const getData = async (idFasyankes: string) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const getDb = await prisma.episodePendaftaran.findMany({
            where: {
                AND: [
                    { createdAt: { gte: today } },
                    { createdAt: { lt: tomorrow } },
                ],
                idFasyankes
            },
            include: {
                pasien: true
            },
            orderBy: {
                id: 'desc',
            },
        })
        return getDb
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