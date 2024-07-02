import { calculateAge } from "@/app/helper/CalculateAge"
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent"
import { authOption } from "@/auth"
import prisma from "@/db"
import { format } from "date-fns"
import { getServerSession } from "next-auth"
import SubMenuPasien from "../../components/SubMenuPasien"

const getData = async (id: string, idFasyankes: string) => {
    try {
        const getDb = await prisma.pasien.findFirst({
            where: {
                id: Number(id),
                idFasyankes,
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return null
    }
}
const PageDetailPasien = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOption)
    const resApi = await getData(params.id, session?.user.idFasyankes)
    const { years, months, days } = calculateAge(resApi?.tanggalLahir)
    return (
        <>
            {
                resApi ?
                    <div className="overflow-x-auto flex flex-col gap-2">
                        <SubMenuPasien session={session} params={params} />
                        <AlertHeaderComponent message="Detail Biodata Pasien" />
                        <table className="table table-sm table-zebra">
                            <tbody>
                                <tr>
                                    <th colSpan={4} className="bg-info">IDENTITAS</th>
                                </tr>
                                <tr>
                                    <th>NO RM</th>
                                    <td>: {resApi.noRm}</td>
                                    <th>NAMA</th>
                                    <td>: {resApi.namaPasien}</td>
                                </tr>
                                <tr>
                                    <th>NIK</th>
                                    <td>: {resApi.nik}</td>
                                    <th>BPJS</th>
                                    <td>: {resApi.bpjs}</td>
                                </tr>
                                <tr>
                                    <th>WARGANEGARA</th>
                                    <td>: {resApi.wargaNegara}</td>
                                    <th>No ASURANSI</th>
                                    <td>: {resApi.noAsuransi}</td>
                                </tr>
                                <tr>
                                    <th>PASPOR</th>
                                    <td>: {resApi.paspor}</td>
                                    <th>BAHASA</th>
                                    <td>: {resApi.bahasa}</td>
                                </tr>
                                <tr>
                                    <th>TTL</th>
                                    <td>: {resApi.tempatLahir}, {format(resApi.tanggalLahir, 'dd/MM/yyyy')}</td>
                                    <th>UMUR</th>
                                    <td>: {`${years} Tahun ${months} Bulan ${days} Hari`}</td>
                                </tr>
                                <tr>
                                    <th>STATUS</th>
                                    <td>: {resApi.statusMenikah}</td>
                                    <th>AGAMA</th>
                                    <td>: {resApi.agama}</td>
                                </tr>
                                <tr>
                                    <th>PENDIDIKAN</th>
                                    <td>: {resApi.pendidikan}</td>
                                    <th>PEKERJAAN</th>
                                    <td>: {resApi.pekerjaan}</td>
                                </tr>
                                <tr>
                                    <th>IBU KANDUNG</th>
                                    <td>: {resApi.ibuKandung}</td>
                                    <th>JK</th>
                                    <td>: {resApi.jenisKelamin === "L" ? "LAKI-LAKI" : "PEREMPUAN"}</td>
                                </tr>
                                <tr>
                                    <th>NO HP</th>
                                    <td colSpan={3}>: {resApi.noHp}</td>
                                </tr>
                                <tr>
                                    <th colSpan={4} className="bg-info">ALAMAT KTP</th>
                                </tr>
                                <tr>
                                    <th>ALAMAT</th>
                                    <td colSpan={3}>: {resApi.alamat}</td>
                                </tr>
                                <tr>
                                    <th>KOTA / KAB</th>
                                    <td>: {resApi.kota}</td>
                                    <th>KECAMATAN</th>
                                    <td>: {resApi.kecamatan}</td>
                                </tr>
                                <tr>
                                    <th>KELURAHAN</th>
                                    <td>: {resApi.kelurahan}</td>
                                    <th>RT / RW</th>
                                    <td>: {resApi.rt}/{resApi.rw}</td>
                                </tr>
                                <tr>
                                    <th>KODE POS</th>
                                    <td colSpan={3}>: {resApi.kodePos}</td>
                                </tr>
                                <tr>
                                    <th colSpan={4} className="bg-info">ALAMAT DOMISILI</th>
                                </tr>
                                <tr>
                                    <th>ALAMAT</th>
                                    <td colSpan={3}>: {resApi.alamatDomisili}</td>
                                </tr>
                                <tr>
                                    <th>KOTA / KAB</th>
                                    <td>: {resApi.kotaDomisili}</td>
                                    <th>KECAMATAN</th>
                                    <td>: {resApi.kecamatan}</td>
                                </tr>
                                <tr>
                                    <th>KELURAHAN</th>
                                    <td>: {resApi.kelurahan}</td>
                                    <th>RT / RW</th>
                                    <td>: {resApi.rt}/{resApi.rw}</td>
                                </tr>
                                <tr>
                                    <th>KODE POS DOMISILI</th>
                                    <td colSpan={3}>: {resApi.kodePosDomisili}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    : <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Data tidak ditemukan!</span>
                    </div>
            }
        </>
    )
}

export default PageDetailPasien