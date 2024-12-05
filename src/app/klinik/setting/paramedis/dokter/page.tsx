import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "../components/AlertHeaderComponent";
import DokterTableColumn from "./DokterTableColumn";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";

const getDataDokter = async (idFasyankes: string) => {
  try {
    const getData = await prisma.doctors.findMany({
      where: {
        idFasyankes,
      },
      include: {
        profile: true,
      },
    });
    return getData;
  } catch (error) {
    return [];
  }
};

const PageDokter = async () => {
  const session = await getServerSession(authOption);
  const data = await getDataDokter(session?.user.idFasyankes);

  return (
    <>
      <AlertHeaderComponent message="List dokter" />
      <TableFilterComponent rowsData={data} columnsData={DokterTableColumn} />
    </>
  );
};

export default PageDokter;
