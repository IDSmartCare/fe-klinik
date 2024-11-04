import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "../paramedis/components/AlertHeaderComponent";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import { getApiBisnisOwner } from "@/app/lib/apiBisnisOwner";
import prisma from "@/db";
import UserTableColumn from "./UserTableColumn";
import ModalAddUser from "./pageclient/ModalAddUser";

const getDb = async (idFasyankes: string) => {
  try {
    const getApi = await getApiBisnisOwner({
      url: `list-username?fasyankes_id=${idFasyankes}`,
    });
    const listUser = getApi?.data;
    const ids = listUser.map((item: any) => Number(item.id_profile));
    const getDb = await prisma.profile.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        poliklinik: {
          select: {
            namaPoli: true,
          },
        },
      },
    });
    const listRes = listUser.map((item: any) => {
      return {
        ...item,
        detail: getDb.find((i) => i.id === Number(item.id_profile)),
      };
    });
    return listRes;
  } catch (error) {
    return [];
  }
};

const UserLoginPage = async () => {
  const session = await getServerSession(authOption);
  const data = await getDb(session?.user.idFasyankes);

  // const isFreePackageAdmin =
  //   session?.user.role === "admin" &&
  //   session?.user.package === "FREE" &&
  //   session?.user.type === "Klinik";

  return (
    <div className="flex flex-col gap-2">
      <AlertHeaderComponent message="List User Login" />
      {/* {!isFreePackageAdmin && <ModalAddUser session={session} />} */}
      <ModalAddUser session={session} />
      <TableFilterComponent rowsData={data} columnsData={UserTableColumn} />
    </div>
  );
};

export default UserLoginPage;
