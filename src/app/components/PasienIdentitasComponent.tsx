import { format } from "date-fns"
import { calculateAge } from "../helper/CalculateAge"

const PasienIdentitasComponent = ({ pasien }: { pasien: any }) => {
    const { years, months, days } = calculateAge(pasien?.tanggalLahir)
    return (
        <div className="card text-info-content border">
            <div className="card-body">
                <table className="table table-zebra table-xs">
                    <thead>
                        <tr>
                            <th colSpan={2} className="text-2xl">{pasien?.namaPasien} ({pasien?.jenisKelamin}) / {pasien?.noRm} </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>TTL</th>
                            <td>: {pasien?.tempatLahir}, {format(pasien?.tanggalLahir as string, 'dd/MM/yyyy')} </td>
                            <th>UMUR</th>
                            <td>: {`${years} Tahun ${months} Bulan ${days} Hari`}</td>
                        </tr>
                        <tr>
                            <th>NIK</th>
                            <td>: {pasien?.nik}</td>
                            <th>BPJS</th>
                            <td>: {pasien?.bpjs}</td>
                        </tr>
                        <tr>
                            <th>STATUS</th>
                            <td>: {pasien?.statusMenikah}</td>
                            <th>AGAMA</th>
                            <td>: {pasien?.agama}</td>
                        </tr>
                        <tr>
                            <th>PEKERJAAN</th>
                            <td>: {pasien?.pekerjaan}</td>
                            <th>KOTA</th>
                            <td>: {pasien?.kota}</td>
                        </tr>
                        <tr>
                            <th>KELURAHAN</th>
                            <td>: {pasien?.kelurahan}</td>
                            <th>KECAMATAN</th>
                            <td>: {pasien?.kecamatan}</td>
                        </tr>
                        <tr>
                            <th>ALAMAT</th>
                            <td colSpan={3}>: {pasien?.alamat}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PasienIdentitasComponent