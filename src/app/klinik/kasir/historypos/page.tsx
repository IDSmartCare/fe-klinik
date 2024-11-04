import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import HistoryPostColumn from "./HistoryTableColumn";

const getData = async (idFasyankes: string) => {
  try {
    const getDb = await prisma.transaksiPOS.findMany({
      where: {
        idFasyankes,
      },
      include: {
        transaksiPosDetail: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    return getDb;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const HistoryPOS = async () => {
  const session = await getServerSession(authOption);
  const data = await getData(session?.user.idFasyankes);

  return (
    <div className="flex flex-col gap-2">
      <AlertHeaderComponent message="History POS" />
      <TableFilterComponent rowsData={data} columnsData={HistoryPostColumn} />
    </div>
  );
};

export default HistoryPOS;
