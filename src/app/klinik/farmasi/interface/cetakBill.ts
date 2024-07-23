export interface CetakBill {
    status: boolean;
    message: string;
    data: {
        id: number;
        totalBill: number | null;
        createdAt: string;
        updatedAt: string;
        pendaftaranId: number;
        billPasienDetail: BillPasienDetail[];
    };
}

interface BillPasienDetail {
    id: number;
    deskripsi: string;
    jenisBill: string;
    catatan: string | null;
    jumlah: number;
    harga: string;
    subTotal: string;
    createdAt: string;
    updatedAt: string;
    billPasienId: number;
}