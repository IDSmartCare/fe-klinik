export type typeFormDokter = {
    id?: number
    namaLengkap: string
    kodeDokter: string
    isAktif: string
    poliKlinikId?: number
    poliklinik?: {
        namaPoli: string
    }
    userId?: number
}