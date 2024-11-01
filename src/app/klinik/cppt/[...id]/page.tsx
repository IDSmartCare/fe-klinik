import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent"
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent"
import FormAddCppt from "../pageclient/FormAddCppt"
import { format } from "date-fns"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import QRCode from "react-qr-code";

const getData = async (id: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/byid/${id}`, {
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
const getCppt = async (id: string, idFasyankes: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/cppt/list/${id}/${idFasyankes}`, {
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
const PageCPPT = async ({ params }: { params: { id: any } }) => {
    const idRegis = params.id[0]
    const idPasien = params.id[1]
    const session = await getServerSession(authOption)

    const resApi = await getData(idPasien)
    const getcppt = await getCppt(idPasien, session?.user.idFasyankes)

    return (
        <div className="flex flex-col gap-2">
            <PasienIdentitasComponent pasien={resApi} />
            <AlertHeaderComponent message="10 Catatan terakhir" />
            <div className="overflow-x-auto">
                <div className="overflow-y-auto h-96">
                    <table className="table table-sm table-zebra">
                        <thead className="bg-base-200">
                            <tr>
                                <th>No</th>
                                <th>Tanggal / Jam</th>
                                <th>Profesi</th>
                                <th>Catatan Pasien Saat Ini</th>
                                <th>Instruksi</th>
                                <th className="text-center">Verifikasi DPJP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getcppt.map((item: any, index: number) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{format(item.createdAt, 'dd/MM/yyyy-HH:mm')}
                                            <br />
                                            No Regis : {item.pendaftaranId}

                                        </td>
                                        <td>{item.profesi.toUpperCase()}</td>
                                        <td>
                                            <p>Subjective : {item.subjective}</p>
                                            <p>Objective : {item.objective}</p>
                                            <p>Assesment : {item.assesment}</p>
                                            <p>Plan : {item.plan}</p>
                                            <p>Diagnosa : {item.kodeDiagnosa}-{item.namaDiagnosa}</p>
                                            {item.profesi !== "Dokter" && <p className="mt-5 font-bold">Input by : {item.inputBy?.namaLengkap}</p>}
                                            {item.resep.length > 0 && <p className="font-bold mt-5">RESEP DOKTER</p>}
                                            {item.resep.map((i: any) => {
                                                return (
                                                    <div key={i.id} className="italic mt-2" >
                                                        <p className="font-medium">R/</p>
                                                        <p className="font-medium">{i.namaObat} ({i.signa1}X{i.signa2})</p>
                                                        <p>{i.aturanPakai}</p>
                                                        <p>{i.waktu}</p>
                                                    </div>
                                                )
                                            })}
                                        </td>
                                        <td>{item.instruksi}</td>
                                        <td>
                                            {item.isVerifDokter &&
                                                <div className="flex flex-col items-center">
                                                    <QRCode
                                                        size={60}
                                                        value={`${item.inputBy?.id}`}
                                                    />
                                                    <p>{item.inputBy?.namaLengkap}</p>
                                                    <p>{item.jamVerifDokter && format(item.jamVerifDokter, 'dd/MM/yyyy HH:mm')}</p>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
            <AlertHeaderComponent message="Tambah catatan baru" />
            <FormAddCppt idregis={idRegis} session={session} />
        </div>
    )
}

export default PageCPPT