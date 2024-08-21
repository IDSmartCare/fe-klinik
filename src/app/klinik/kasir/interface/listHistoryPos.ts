export interface TransaksiPosInterface {
    id: number;
    groupTransaksiId: string;
    subTotal?: string;
    diskonInvoice?: string;
    pajak?: string;
    total?: string;
    totalBayar?: string;
    emailPelanggan?: string;
    namaPelanggan?: string;
    hpPelanggan?: string;
    biayaLainnya?: string;
    idFasyankes?: string;
    createdAt: Date;
    updatedAt: Date;
    transaksiPosDetail: TransaksiPOSDetail[]
}

export interface TransaksiPOSDetail {
    id: number
    barangId: string
    namaBarang: string
    hargaJual?: string
    diskonFromBo?: string
    hargaSetelahDiskon?: string
    qty?: number
    createdAt: Date
    updatedAt: Date
    transaksiPOSId?: string
}
