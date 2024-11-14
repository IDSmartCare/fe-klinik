export type typeFormDokter = {
  id?: number;
  name: string;
  kodeDokter: string;
  isAktif: string;
  poliKlinikId?: number;
  poliklinik?: {
    namaPoli: string;
  };
};
