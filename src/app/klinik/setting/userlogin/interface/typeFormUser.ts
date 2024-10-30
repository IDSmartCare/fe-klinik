export type FormAddUser = {
  username: string;
  password: string;
  confirmPassword: string;
  role: any;
  createdBy: string;
  namaLengkap: string;
  kodedokter?: string;
  poliklinik?: { value: string };
  str?: string;
  sip?: string;
};
