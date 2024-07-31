export interface ListAfterSubmit {
    id: number;
    barangId: string;
    namaBarang: string;
    groupTransaksiId: string;
    hargaJual?: string;
    qty?: number;
    subTotal?: string;
    emailPelanggan?: string;
    namaPelanggan?: string;
    hpPelanggan?: string;
    createdAt: Date;
    updatedAt: Date;
}