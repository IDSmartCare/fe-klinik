import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import ListPasienDokter from "./ListPasienDokter";
import FilterPasienComponent from "@/app/components/FilterPasienComponent";

const getData = async (
  idFasyankes: string,
  idProfile: number,
  role: string
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  try {
    if (role === "admin" || role === "tester" || role === "dokter") {
      const getapi = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/listregistrasi/${idFasyankes}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      if (!getapi.ok) {
        return [];
      }
      return getapi.json();
    } else {
      const getapi = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/listdokter/${idProfile}/${idFasyankes}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      if (!getapi.ok) {
        return [];
      }
      return getapi.json();
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

const PageDokter = async () => {
  const session = await getServerSession(authOption);
  const data = await getData(
    session?.user.idFasyankes,
    session?.user.idProfile,
    session?.user.role
  );
  return (
    <>
      <FilterPasienComponent />
      <AlertHeaderComponent message={`Pasien terdaftar hari ini`} />
      <TableFilterComponent rowsData={data} columnsData={ListPasienDokter} />
    </>
  );
};

export default PageDokter;
