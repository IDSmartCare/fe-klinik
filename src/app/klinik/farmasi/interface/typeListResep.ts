export interface ListResepInterface {
    id?: number
    namaObat?: string | null
    obatId?: string | null
    jumlah?: number | null
    satuan?: string | null
    signa1?: string | null
    signa2?: string | null
    aturanPakai?: string | null
    waktu?: string | null
    catatan?: string | null
    hargaJual?: string | null
    createdAt?: Date | null
    updatedAt?: Date | null
    sOAPId?: number | null,
    stok?: number | null,
    total?: number | null
}