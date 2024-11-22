import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import FormRegistrasi from "../../pageclient/FormRegistrasi";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";

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
const getRegistrasi = async (id: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/riwayatregistrasi/${id}`,
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

const PageRegistrasi = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);
  const resApi = await getData(params.id);
  const regisTrasi = await getRegistrasi(params.id);

  // Log Object in Array
  // regisTrasi.forEach((item: any, index: any) => {
  //   console.log(`Item ${index + 1} - Pendaftaran:`, item.pendaftaran);

  //   item.pendaftaran.forEach((pendaftaran: any, idx: any) => {
  //     console.log(`Pendaftaran ${idx + 1}:`, pendaftaran.riwayat);
  //   });
  // });

  return (
    <div className="flex flex-col gap-2">
      <PasienIdentitasComponent pasien={resApi} />
      <div className="flex gap-2">
        <div className="w-1/2">
          <AlertHeaderComponent message="Registrasi Baru" />
          <FormRegistrasi idpasien={params.id} session={session} />
        </div>
        <div className="w-1/2 space-y-2">
          <AlertHeaderComponent message="Riwayat registrasi pasien" />
          <div className="overflow-y-auto h-80">
            <div className="flex flex-col gap-2">
              {regisTrasi.map((item: any) => {
                return (
                  <div
                    key={item.id}
                    className="collapse collapse-arrow bg-base-200"
                  >
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title text-lg font-medium">
                      Episode {item.episode}
                      <p className="text-xs">
                        Kunjungan : {format(item.createdAt, "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="collapse-content text-xs">
                      {item.pendaftaran.map((reg: any) => {
                        return (
                          <div key={reg.id}>
                            <div className="divider m-0" />
                            <p key={reg.id}>
                              ID Regis ({reg.id}) / Penjamin ({reg.penjamin})
                            </p>
                            <p>
                              Tgl Regis (
                              {format(reg.createdAt, "dd/MM/yyyy HH:mm")})
                            </p>
                            <p>Dokter ({reg.riwayat?.doctor?.name})</p>
                            <p>Poli ({reg.riwayat?.doctor?.unit})</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageRegistrasi;
