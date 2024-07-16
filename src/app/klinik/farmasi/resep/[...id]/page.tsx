import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import { authOption } from "@/auth";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import FormTransaksiResep from "../../pageclient/FormTransaksiResep";


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
const getDataResep = async (id: string) => {
    try {
        const getDb = await prisma.resepDokter.findMany({
            where: {
                sOAPId: Number(id)
            },
            include: {
                SOAP: {
                    include: {
                        pendaftaran: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }

        })
        return getDb
    } catch (error) {
        console.log(error);
        return null
    }
}

const PageInputResep = async ({ params }: { params: { id: any } }) => {
    const idSoap = params.id[0]
    const idPasien = params.id[1]
    const session = await getServerSession(authOption)
    const data = await getDataResep(idSoap)
    const resApi = await getData(idPasien, session?.user.idFasyankes)

    return (
        <div className="flex flex-col gap-2">
            <PasienIdentitasComponent pasien={resApi} />
            <AlertHeaderComponent message="Transaksi Resep!" />
            <FormTransaksiResep soapId={idSoap} data={data} session={session} />

        </div>
    )
}

export default PageInputResep