import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import { authOption } from "@/auth";
import { getServerSession } from "next-auth";
import ListBillingPasien from "../../components/ListBillingPasien";

const getData = async (id: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/byid/${id}`,
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
const getRegis = async (id: string, idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/riwayatregistrasi/byepisode/${id}/${idFasyankes}`,
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
const BillingPasien = async ({ params }: { params: { id: any } }) => {
  const idPasien = params.id[0];
  const idEpisode = params.id[1];
  const session = await getServerSession(authOption);
  const resApi = await getData(idPasien);
  const getRegisData = await getRegis(idEpisode, session?.user.idFasyankes);
  // console.log(JSON.stringify(getRegisData, null, 2));

  return (
    <div className="flex flex-col gap-2">
      <PasienIdentitasComponent pasien={resApi} />
      <ListBillingPasien dataRegis={getRegisData} session={session} />
    </div>
  );
};

export default BillingPasien;
