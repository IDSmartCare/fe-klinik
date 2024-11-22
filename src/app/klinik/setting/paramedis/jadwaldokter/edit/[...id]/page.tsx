import prisma from "@/db";
import FormEditJadwal from "../../pageclient/FormEditJadwal";
import { authOption } from "@/auth";
import { getServerSession } from "next-auth";

const getJadwalDokter = async (id: string, idFasyankes: string) => {
  try {
    const getDb = await prisma.jadwalDokter.findFirst({
      where: {
        id: Number(id),
        idFasyankes: idFasyankes,
      },
    });
    console.log(getDb);
    return getDb;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const EditJadwal = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);
  const data = await getJadwalDokter(params.id, session?.user.idFasyankes);
  return <FormEditJadwal data={data} session={session} />;
};
export default EditJadwal;
