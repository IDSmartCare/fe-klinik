export interface BillData {
    id: number;
    totalBill: number;
    createdAt: Date;
    updatedAt: Date;
    pendaftaranId: number;
    status: string;
    pembayaranBill: {
        id: number;
        totalBayar: number;
        tglBayar: Date;
        createdAt: Date;
        updatedAt: Date;
        billPasienId: number;
        totalDiskon: number;
        totalPajak: number;
        kembalian: number;
    }[];
}