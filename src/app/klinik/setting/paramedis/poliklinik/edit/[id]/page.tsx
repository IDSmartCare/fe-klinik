import { authOption } from "@/auth";
import AlertHeaderComponent from "../../../components/AlertHeaderComponent";
import FormEditPoli from "../../pageclient/FormEditPoli";
import { getServerSession } from "next-auth";

const getDataPoli = async (id: string) => {
  console.log(id);
  try {
    const getDb = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE}/api/paramedis/getpoliklinikbyid?idpoli=${id}`
    );
    const res = await getDb.json();

    return res;
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
