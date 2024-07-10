import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import TableFilterComponent from "@/app/components/TableFilterComponent"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import prisma from "@/db"
import FarmasiTableColumn from "./FarmasiTableColumn"
const getData = async (idFasyankes: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    try {
        const getDb = await prisma.sOAP.findMany({
            where: {
                idFasyankes,
                profesi: 'dokter',
                AND: [
                    { createdAt: { gte: today } },
                    { createdAt: { lt: tomorrow } },
                ],
            },
            orderBy: {
                id: 'desc',
            },
            include: {
                pendaftaran: {
                    include: {
                        episodePendaftaran: {
                            select: {
                                pasien: {
                                    select: {
                                        noRm: true,
                                        namaPasien: true,
                                        jenisKelamin: true,
                                        id: true
                                    }
                                }
                            }
                        },
                        jadwal: {
                            select: {
                                dokter: {
                                    select: {
                                        namaLengkap: true
                                    }
                                }
                            }
                        }
                    }
                }

            }
        })
        return getDb
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