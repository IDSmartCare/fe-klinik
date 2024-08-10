import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import ListPasienDokter from "./ListPasienDokter"
import FilterPasienComponent from "@/app/components/FilterPasienComponent"

const getData = async (idFasyankes: string, idProfile: number, role: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    try {
        if (role === "admin") {
            const getDb = await prisma.pendaftaran.findMany({
                where: {
                    isClose: false,
                    idFasyankes,
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
        } else {
            const getDb = await prisma.pendaftaran.findMany({
                where: {
                    isClose: false,
                    idFasyankes,
                    AND: [
                        { createdAt: { gte: today } },
                        { createdAt: { lt: tomorrow } },
                    ],
                    jadwal: {
                        dokterId: Number(idProfile)
                    },
                    isSoapPerawat: true
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
        }

    } catch (error) {
        console.log(error);
        return []
    }
}

const PageDokter = async () => {
    const session = await getServerSession(authOption)
    const data = await getData(session?.user.idFasyankes, session?.user.idProfile, session?.user.role)
    return (
        <>
            <FilterPasienComponent />
            <AlertHeaderComponent message="Pasien terdaftar hari ini" />
            <TableFilterComponent rowsData={data} columnsData={ListPasienDokter} />
        </>
    )
}

export default PageDokter