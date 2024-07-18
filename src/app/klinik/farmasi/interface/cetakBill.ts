export interface CetakBill {
    id: number
    deskripsi: string
    catatan: string | null
    createdAt: Date
    jenisBill: string
    pendaftaranId: number | null
    total: string
    updatedAt: Date
    jumlah: number
    harga: string
}