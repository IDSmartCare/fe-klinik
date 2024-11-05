import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "../components/AlertHeaderComponent";
import ModalAddPoli from "./pageclient/ModalAddPoli";
import PoliTableColumn from "./PoliTableColumn";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import PoliTableColumnTester from "./PoliTableColumnTester";

const getDataPoli = async (idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/setting/listpoli/${idFasyankes}`,
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
  } catch (error) {
    console.log(error);
    return [];
  }
};

const PagePoli = async () => {
  const session = await getServerSession(authOption);
  const data = await getDataPoli(session?.user.idFasyankes);

  return (
    <>
      <AlertHeaderComponent message="List poliklinik" />
      <ModalAddPoli session={session} />
      <div></div>
      {session?.user.role === "tester" ? (
        <TableFilterComponent
          rowsData={data}
          columnsData={PoliTableColumnTester}
        />
      ) : (
        <TableFilterComponent rowsData={data} columnsData={PoliTableColumn} />
      )}
    </>
  );
};

export default PagePoli;
