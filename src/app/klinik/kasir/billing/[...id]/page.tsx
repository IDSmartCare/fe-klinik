import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent"
import { authOption } from "@/auth";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import ListBillingPasien from "../../components/ListBillingPasien";

const getData = async (id: string, idFasyankes: string) => {
    try {
        const getDb = await prisma.pasien.findFirst({
            where: {
                id: Number(id),
                idFasyankes
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return null
    }
}
const getRegis = async (id: string, idFasyankes: string) => {
    try {
        const registrasi = await prisma.pendaftaran.findMany({
            where: {
                episodePendaftaranId: Number(id),
                idFasyankes
            },
            include: {
                jadwal: {
                    include: {
                        dokter: {
                            include: {
                                poliklinik: true
                            }
                        }
                    }
                }
            }
        })
        return registrasi
    } catch (error) {
        console.log(error);
        return null
    }
}
const BillingPasien = async ({ params }: { params: { id: any } }) => {
    const idPasien = params.id[0]
    const idEpisode = params.id[1]
    const session = await getServerSession(authOption)
    const resApi = await getData(idPasien, session?.user.idFasyankes)
    const getRegisData = await getRegis(idEpisode, session?.user.idFasyankes)

    return (
        <div className="flex flex-col gap-2">
            <PasienIdentitasComponent pasien={resApi} />
            <ListBillingPasien dataRegis={getRegisData} />
        </div>
    )
}

export default BillingPasien