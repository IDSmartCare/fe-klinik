export type typeFormCppt = {
    id?: number
    profesi: string
    subjective: string
    objective: string
    assesment: string
    plan: string
    instruksi: string
    profileId: number
    idFasyankes?: string
    resep: any[]
    pendaftaranId?: number
    isVerifDokter: boolean | null
    isDokter: boolean | null
    jamVerifDokter?: any
    isBillingFarmasi: boolean
    kodeDiagnosa?: string
    namaDiagnosa?: string
}