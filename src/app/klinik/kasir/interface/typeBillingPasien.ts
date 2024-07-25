export interface BillPasienDetail {
    id: number;
    deskripsi: string;
    jenisBill: string;
    catatan: string | null;
    jumlah: number | null;
    harga: string | null;
    subTotal: string | null;
    createdAt: Date;
    updatedAt: Date;
    billPasienId: number | null;
}

interface Pendaftaran {
    id: number;
    jadwalDokterId: number;
    penjamin: string;
    namaAsuransi: string | null;
    isSoapPerawat: boolean | null;
    isSoapDokter: boolean | null;
    isClose: boolean | null;
    isAktif: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    jadwal: JadwalDokter | null
    episodePendaftaranId: number | null;
    idFasyankes: string | null;
}

interface Poliklinik {
    id: number;
    namaPoli: string;
    kodePoli: string | null;
    isAktif: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    idFasyankes: string | null;
}

interface Dokter {
    id: number;
    namaLengkap: string;
    profesi: string;
    unit: string | null;
    kodeDokter: string | null;
    idFasyankes: string | null;
    isAktif: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    poliKlinikId: number | null;
    poliklinik: Poliklinik | null;
}

interface JadwalDokter {
    id: number;
    hari: string;
    kodeHari: number;
    jamPraktek: string | null;
    isAktif: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    dokterId: number;
    idFasyankes: string | null;
    dokter: Dokter;
}

export interface BillingPasienInterface {
    id: number;
    totalBill: string | null;
    createdAt: Date;
    updatedAt: Date;
    pendaftaranId: number | null;
    billPasienDetail: BillPasienDetail[];
    Pendaftaran: Pendaftaran | null;
}