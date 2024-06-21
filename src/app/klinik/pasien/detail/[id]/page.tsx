import { calculateAge } from "@/app/helper/CalculateAge"
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent"
import { authOption } from "@/auth"
import prisma from "@/db"
import { format } from "date-fns"
import { getServerSession } from "next-auth"
import Link from "next/link"

const getData = async (id: string) => {
    try {
        const getDb = await prisma.pasien.findFirst({
            where: {
                id: Number(id)
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return null
    }
}
const PageDetailPasien = async ({ params }: { params: { id: string } }) => {
    const resApi = await getData(params.id)
    const session = await getServerSession(authOption)
    const { years, months, days } = calculateAge(resApi?.tanggalLahir)
    return (
        <>
            {
                resApi ?
                    <div className="overflow-x-auto flex flex-col gap-2">
                        {session?.user.role === 'admin' || session?.user.role === 'admisi' ?
                            <ul className="menu menu-xs menu-horizontal space-x-2 bg-base-300 rounded self-end">
                                <li>
                                    <Link href={`/klinik/pasien/registrasi/${params.id}`} className="btn btn-xs">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                            <path fillRule="evenodd" d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z" clipRule="evenodd" />
                                        </svg>
                                        Pendaftaran
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/klinik/pendaftaran/riwayat/${params.id}`} className="btn btn-xs">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                            <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Z" />
                                            <path fillRule="evenodd" d="M13 6H3v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6ZM8.75 7.75a.75.75 0 0 0-1.5 0v2.69L6.03 9.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.22 1.22V7.75Z" clipRule="evenodd" />
                                        </svg>

                                        Riwayat Pendaftaran
                                    </Link>
                                </li>
                            </ul>
                            : <ul className="menu menu-xs menu-horizontal space-x-2 bg-base-300 rounded self-end">
                                <li>
                                    <Link href={`/klinik/pendaftaran/riwayat/${params.id}`} className="btn btn-xs">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                            <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Z" />
                                            <path fillRule="evenodd" d="M13 6H3v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6ZM8.75 7.75a.75.75 0 0 0-1.5 0v2.69L6.03 9.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.22 1.22V7.75Z" clipRule="evenodd" />
                                        </svg>

                                        Riwayat Pendaftaran
                                    </Link>
                                </li>
                            </ul>
                        }
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