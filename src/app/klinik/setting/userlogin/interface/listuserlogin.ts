export interface ListUserLoginInterface {
    username: string
    id_profile: string
    role: string
    detail?: DetailLoginInterface
}

interface DetailLoginInterface {
    id: number
    namaLengkap?: string
    profesi?: string
    unit?: string
    kodeDokter?: string
    str?: string
    sip?: string
    idFasyankes?: string
    isAktif: boolean
    createdAt: Date
    updatedAt: Date
    poliklinik?: {
        namaPoli: string
    }

}