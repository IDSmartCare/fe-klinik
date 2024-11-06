import { authOption } from "@/auth";
import AlertHeaderComponent from "../../../components/AlertHeaderComponent";
import FormEditPoli from "../../pageclient/FormEditPoli";
import { getServerSession } from "next-auth";
import prisma from "@/db";

const getDataPoli = async (id: string) => {
  try {
    const getDb = await prisma.poliKlinik.findFirst({
      where: {
        id: Number(id),
      },
    });
    return getDb;
  } catch (error) {
    return null;
  }
};

const EditPoli = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);
  const dataPoli = await getDataPoli(params.id);

  return (
    <div className="flex flex-col gap-2 items-center">
      <AlertHeaderComponent message="Edit Poliklinik" />
      <FormEditPoli data={dataPoli} session={session} />
    </div>
  );
};

export default EditPoli;
