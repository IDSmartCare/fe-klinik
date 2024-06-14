
export type typeFormJadwal = {
    id?: number
    hari: string
    kodeHari: any
    jamDari: string
    jamSampai: string
    jamPraktek: string
    dokterId?: any
    isAktif?: boolean
    dokter?: {
        namaDokter: string,
        poliKlinik: {
            namaPoli: string
        }
    }
}