export type typeFormJadwal = {
  id?: number;
  hari: any;
  jamDari: string;
  jamSampai: string;
  jamPraktek: string;
  dokterId?: any;
  isAktif?: boolean;
  dokter?: {
    namaLengkap: string;
    poliklinik: {
      namaPoli: string;
      kodePoli?: string;
    };
  };
  timeList?: {
    [key: string]: {
      jamDari: string;
      jamSampai: string;
    };
  };
  slot?: {
    value: number;
    label: string;
  };
};
