import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import prisma from "@/db"
import PendaftaranTableCoulumn from "./PendaftaranTableColumn"

const getData = async () => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const getDb = await prisma.pendaftaran.findMany({
            where: {
                isClose: false,
                AND: [
                    { createdAt: { gte: today } },
                    { createdAt: { lt: tomorrow } },
                ],
            },
            orderBy: {
                id: 'desc',
            },
            include: {
                jadwal: {
                    select: {
                        dokter: true,
                    },
                },
                episodePendaftaran: {
                    select: {
                        pasien: {
                            select: {
                                noRm: true,
                                namaPasien: true,
                                jenisKelamin: true,
                                kelurahan: true,
                                id: true
                            }
                        }
                    }
                },
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return []
    }
}

const PagePendaftaran = async () => {
    const data = await getData()
    return (
        <>
            <AlertHeaderComponent message="Pasien terdaftar hari ini" />
            <TableFilterComponent rowsData={data} columnsData={PendaftaranTableCoulumn} />
        </>
    )
}

export default PagePendaftaran