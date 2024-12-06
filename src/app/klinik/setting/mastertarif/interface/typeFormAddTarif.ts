export type AddMasterTarif = {
  namaTarif: any;
  kategoriTarif: { value: string };
  hargaTarif?: string;
  penjamin?: { value: string };
  idFasyankes: string;
  isAktif?: boolean;
  dokter: any;
  asuransi: any;
};
