export type typeListTerdaftar = {
    id?: number
    penjamin: string
    createdAt: Date
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
        }
    }
    namaAsuransi?: string
}