export interface TransaksiAfterSubmit {
    id: number;
    groupTransaksiId: string;
    subTotal?: string | null;
    diskonInvoice?: string | null;
    pajak?: string | null;
    total?: string | null;
    totalBayar?: string | null;
    emailPelanggan?: string | null;
    namaPelanggan?: string | null;
    hpPelanggan?: string | null;
    biayaLainnya?: string | null;
    createdAt: Date;
    updatedAt: Date;
    transaksiPosDetail: TransaksiPosDetail[];
}

interface TransaksiPosDetail {
    id: number;
    barangId: string;
    namaBarang: string;
    hargaJual?: string | null;
    diskonFromBo?: string | null;
    hargaSetelahDiskon?: string | null;
    qty?: number | null;
    createdAt: string;
    updatedAt: string;
    transaksiPOSId?: string | null;
}