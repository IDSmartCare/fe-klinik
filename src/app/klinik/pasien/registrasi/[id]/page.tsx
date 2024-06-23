import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import prisma from "@/db";
import FormRegistrasi from "../../pageclient/FormRegistrasi";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";

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
const getRegistrasi = async (id: string, idFasyankes: string) => {
    try {
        const getDb = await prisma.episodePendaftaran.findMany({
            where: {
                pasienId: Number(id),
                idFasyankes
            },
            include: {
                pendaftaran: {
                    select: {
                        penjamin: true,
                        id: true,
                        createdAt: true,
                        jadwal: {
                            include: {
                                dokter: {
                                    include: {
                                        poliklinik: {
                                            select: {
                                                namaPoli: true
                                            }
                                        }
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

const PageRegistrasi = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOption)
    const resApi = await getData(params.id, session?.user.idFasyankes)
    const regisTrasi = await getRegistrasi(params.id, session?.user.idFasyankes)
    return (
        <div className="flex flex-col gap-2">
            <PasienIdentitasComponent pasien={resApi} />
            <div className="flex gap-2">
                <div className='w-1/2' >
                    <AlertHeaderComponent message='Registrasi Baru' />
                    <FormRegistrasi idpasien={params.id} session={session} />
                </div>
                <div className='w-1/2 space-y-2'>
                    <AlertHeaderComponent message='Riwayat registrasi pasien' />
                    <div className="overflow-y-auto h-80">
                        <div className="flex flex-col gap-2">
                            {
                                regisTrasi.map((item) => {
                                    return (
                                        <div key={item.id} className="collapse collapse-arrow bg-base-200">
                                            <input type="radio" name="my-accordion-2" />
                                            <div className="collapse-title text-xl font-medium">
                                                Episode {item.episode}
                                                <p className="text-xs">Kunjungan : {format(item.createdAt, 'dd/MM/yyyy HH:mm')}</p>
                                            </div>
                                            <div className="collapse-content text-xs">
                                                {item.pendaftaran.map((reg) => {
                                                    return (
                                                        <div key={reg.id}>
                                                            <div className="divider m-0" />
                                                            <p key={reg.id}>ID Regis ({reg.id}) / Penjamin ({reg.penjamin})</p>
                                                            <p>Tgl Regis ({format(reg.createdAt, 'dd/MM/yyyy HH:mm')})</p>
                                                            <p>Dokter ({reg.jadwal?.dokter.namaLengkap})</p>
                                                            <p>Poli ({reg.jadwal?.dokter.poliklinik?.namaPoli})</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageRegistrasi