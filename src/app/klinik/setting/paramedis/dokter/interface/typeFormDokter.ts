export type typeFormDokter = {
    id?: number
    namaDokter: string
    kodeDokter: string
    isAktif: string
    poliKlinikId?: number
    poliKlinik?: {
        namaPoli: string
    }
}