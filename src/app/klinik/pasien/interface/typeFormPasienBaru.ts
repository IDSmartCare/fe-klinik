
export type typeFormPasienBaru = {
    id?: number
    noRm?: string
    namaPasien: string
    wargaNegara?: any
    nik: string
    bpjs: string
    noAsuransi?: string
    paspor?: string
    bahasa?: string
    noHp: string
    noTelp?: string
    tempatLahir: string
    tanggalLahir: string
    jenisKelamin: string
    statusMenikah: any
    agama: any
    alamat: string
    ibuKandung: string
    provinsi: any
    idProv: number
    kota: any
    idKota: number
    kecamatan: any
    idKecamatan: number
    kelurahan: any
    idKelurahan: number
    pendidikan: any
    pekerjaan: any
    rt: number
    rw: number
    kodePos: string
    alamatDomisili: string
    provinsiDomisili: any
    kotaDomisili: any
    kecamatanDomisili: any
    kelurahanDomisili: any
    idProvinsiDomisili: string
    idKotaDomisili: string
    idKecamatanDomisili: string
    idKelurahanDomisili: string
    rtDomisili: number
    rwDomisili: number
    kodePosDomisili: string
}

export interface FieldDomisiliInterface {
    alamat_domisili: string
    provinsi_domisili: string
    kota_domisili: string
    kecamatan_domisili: string
    kelurahan_domisili: string
    id_provinsi_domisili: string
    id_kota_domisili: string
    id_kecamatan_domisili: string
    id_kelurahan_domisili: string
    rt_domisili: number
    rw_domisili: number
    kode_pos_domisili: string
}