import FormEditJadwal from "../../pageclient/FormEditJadwal";
import { authOption } from "@/auth";
import { getServerSession } from "next-auth";

const getJadwalDokter = async (idFasyankes: string, idDokter: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/dokter/detailschedule/${idFasyankes}/${idDokter}`,
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

const EditJadwal = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);
  const data = await getJadwalDokter(session?.user.idFasyankes, params.id);
  return <FormEditJadwal data={data} session={session} />;
};
export default EditJadwal;
