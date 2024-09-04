export type typeListTerdaftar = {
    id?: number
    penjamin: string
    createdAt: Date
    isSoapPerawat?: boolean
    isSoapDokter?: boolean
    jadwal: {
        dokter: {
            namaLengkap: string
        }
    },
    episodePendaftaran: {
        pasien: {
            namaPasien: string
            noRm: string
            jenisKelamin: string
            kelurahan: string
            id: number
            paspor: string
        }
    }
    namaAsuransi?: string
}