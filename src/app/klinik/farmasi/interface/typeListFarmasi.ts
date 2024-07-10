interface Pendaftaran {
    id: number;
    jadwalDokterId: number;
    penjamin: string;
    namaAsuransi: string | null;
    isSoapPerawat: boolean;
    isSoapDokter: boolean;
    isClose: boolean;
    isAktif: boolean;
    createdAt: string; // Using string to represent the ISO date format
    updatedAt: string; // Using string to represent the ISO date format
    episodePendaftaranId: number;
    idFasyankes: string;
    episodePendaftaran: {
        pasien: {
            noRm: string
            namaPasien: string
            jenisKelamin: string
            id: number
        },

    };
    jadwal: {
        dokter: {
            namaLengkap: string
        }
    }
}

export interface ListFarmasiInterface {
    id: number;
    profesi: string;
    isDokter: boolean;
    subjective: string;
    objective: string;
    assesment: string;
    plan: string;
    instruksi: string;
    isVerifDokter: boolean;
    jamVerifDokter: string; // Using string to represent the ISO date format
    isAktif: boolean;
    createdAt: string; // Using string to represent the ISO date format
    updatedAt: string; // Using string to represent the ISO date format
    pendaftaranId: number;
    idFasyankes: string;
    profileId: number;
    pendaftaran: Pendaftaran;
}