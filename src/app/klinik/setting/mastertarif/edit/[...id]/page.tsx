import prisma from "@/db";
import FormEditTarif from "../../pageclient/FormEditTarif";

const getData = async (id: string) => {
  try {
    const getDb = await prisma.masterTarif.findFirst({
      where: {
        id: Number(id),
      },
    });
    return getDb;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const EditTarif = async ({ params }: { params: { id: string } }) => {
  const data = await getData(params.id);

  return <FormEditTarif dataForm={data} />;
};

export default EditTarif;
