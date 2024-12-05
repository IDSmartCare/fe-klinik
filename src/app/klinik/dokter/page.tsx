import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import ListPasienDokter from "./ListPasienDokter";
import FilterPasienComponent from "@/app/components/FilterPasienComponent";
import ListPasienDokterAdmin from "./ListPasienDokterAdmin";

const getData = async (
  idFasyankes: string,
  idProfile: string,
  role: string
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  try {
    if (role === "admin" || role === "tester") {
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
    } else if (role === "dokter") {
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
      {session?.user.role === "admin" || session?.user.role === "tester" ? (
        <TableFilterComponent
          rowsData={data}
          columnsData={ListPasienDokterAdmin}
        />
      ) : session?.user.role === "dokter" ? (
        <TableFilterComponent rowsData={data} columnsData={ListPasienDokter} />
      ) : null}
    </>
  );
};

export default PageDokter;
