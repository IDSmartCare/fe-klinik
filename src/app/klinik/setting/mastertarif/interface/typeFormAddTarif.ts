export type AddMasterTarif = {
  namaTarif: string;
  kategoriTarif: { value: string };
  hargaTarif?: string;
  penjamin?: { value: string };
  idFasyankes: string;
  isAktif?: boolean;
  dokter: any;
};
