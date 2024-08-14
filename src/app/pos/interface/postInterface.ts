export interface StokBarangInterface {
    stok_barang_id: string;
    fasyankes_warehouse_id: string;
    barang_id: string;
    stok: number;
    barang: Barang;
    diskon: Diskon
}

interface Diskon {
    stok_barang_id: string
    type: string
    percent_disc: number
    amount_disc: string
    expired_disc: string
}
interface Barang {
    barang_id: string;
    kategori_id: string;
    nama_barang: string;
    supplier_id: string;
    kfa_poa_code?: number;
    satuan: string;
    harga_beli: string;
    harga_jual: string;
    expired_at: string;
    deskripsi: string;
    created_at: null;
    updated_at: null;
    kategori_barang: {
        kategori_id: string;
        nama: string;
    };
}

export interface PembelianInterface {
    barang_id: string
    nama_barang: string
    harga_jual: string
    qty: number
    totalHarga: number
    diskonFromBo: string
}

export interface DataInvoice {
    namaPelanggan?: string
    emailPelanggan?: string
    hpPelanggan?: string
    subTotal?: string
    total?: string
    totalBayar?: string
    pajak?: string
    diskonInvoice?: string
    biayaLainnya?: string
    groupTransaksiId: string
}