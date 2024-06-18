import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent"
import prisma from "@/db"
import { format } from "date-fns"
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

    return (
        <div>
            {
                resApi ?
                    <div className="overflow-x-auto flex flex-col gap-2">
                        <ul className="menu menu-xs menu-horizontal space-x-2 bg-base-300 rounded self-end">
                            <li>
                                <Link href={`/klinik/pasien/registrasi/${params.id}`} className="btn btn-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                        <path fillRule="evenodd" d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z" clipRule="evenodd" />
                                    </svg>
                                    Registrasi
                                </Link>
                            </li>
                        </ul>
                        <AlertHeaderComponent message="Detail Biodata Pasien" />
                        <table className="table table-zebra">
                            <tbody>
                                <tr>
                                    <th colSpan={4} className="bg-info">Identitas</th>
                                </tr>
                                <tr>
                                    <th>No RM</th>
                                    <td>{resApi.noRm}</td>
                                    <th>Nama</th>
                                    <td>{resApi.namaPasien}</td>
                                </tr>
                                <tr>
                                    <th>NIK</th>
                                    <td>{resApi.nik}</td>
                                    <th>BPJS</th>
                                    <td>{resApi.bpjs}</td>
                                </tr>
                                <tr>
                                    <th>Warganegara</th>
                                    <td>{resApi.wargaNegara}</td>
                                    <th>No Asuransi</th>
                                    <td>{resApi.noAsuransi}</td>
                                </tr>
                                <tr>
                                    <th>Paspor</th>
                                    <td>{resApi.paspor}</td>
                                    <th>Bahasa</th>
                                    <td>{resApi.bahasa}</td>
                                </tr>
                                <tr>
                                    <th>TTL</th>
                                    <td>{resApi.tempatLahir}, {format(resApi.tanggalLahir, 'dd/MM/yyyy')}</td>
                                    <th>JK</th>
                                    <td>{resApi.jenisKelamin === "L" ? "LAKI-LAKI" : "PEREMPUAN"}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{resApi.statusMenikah}</td>
                                    <th>Agama</th>
                                    <td>{resApi.agama}</td>
                                </tr>
                                <tr>
                                    <th>Pendidikan</th>
                                    <td>{resApi.pendidikan}</td>
                                    <th>Pekerjaan</th>
                                    <td>{resApi.pekerjaan}</td>
                                </tr>
                                <tr>
                                    <th>Ibu Kandung</th>
                                    <td colSpan={3}>{resApi.ibuKandung}</td>
                                </tr>
                                <tr>
                                    <th colSpan={4} className="bg-info">Alamat KTP</th>
                                </tr>
                                <tr>
                                    <th>Alamat</th>
                                    <td colSpan={3}>{resApi.alamat}</td>
                                </tr>
                                <tr>
                                    <th>Kota / Kabupaten</th>
                                    <td>{resApi.kota}</td>
                                    <th>Kecamatan</th>
                                    <td>{resApi.kecamatan}</td>
                                </tr>
                                <tr>
                                    <th>Kelurahan</th>
                                    <td>{resApi.kelurahan}</td>
                                    <th>RT / RW</th>
                                    <td>{resApi.rt}/{resApi.rw}</td>
                                </tr>
                                <tr>
                                    <th>Kode Pos</th>
                                    <td colSpan={3}>{resApi.kodePos}</td>
                                </tr>
                                <tr>
                                    <th colSpan={4} className="bg-info">Alamat Domisili</th>
                                </tr>
                                <tr>
                                    <th>Alamat</th>
                                    <td colSpan={3}>{resApi.alamatDomisili}</td>
                                </tr>
                                <tr>
                                    <th>Kota / Kabupaten</th>
                                    <td>{resApi.kotaDomisili}</td>
                                    <th>Kecamatan</th>
                                    <td>{resApi.kecamatan}</td>
                                </tr>
                                <tr>
                                    <th>Kelurahan</th>
                                    <td>{resApi.kelurahan}</td>
                                    <th>RT / RW</th>
                                    <td>{resApi.rt}/{resApi.rw}</td>
                                </tr>
                                <tr>
                                    <th>Kode Pos</th>
                                    <td colSpan={3}>{resApi.kodePos}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    : <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Data tidak ditemukan!</span>
                    </div>
            }
        </div>
    )
}

export default PageDetailPasien