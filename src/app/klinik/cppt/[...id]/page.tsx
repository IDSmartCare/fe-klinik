import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent";
import FormAddCppt from "../pageclient/FormAddCppt";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { authOption } from "@/auth";
import QRCode from "react-qr-code";
import Link from "next/link";

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
const getCppt = async (id: string, idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/cppt/list/${id}/${idFasyankes}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        cache: "no-cache",
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
const PageCPPT = async ({ params }: { params: { id: any } }) => {
  const idRegis = params.id[0];
  const idPasien = params.id[1];
  const session = await getServerSession(authOption);

  const resApi = await getData(idPasien);
  const getcppt = await getCppt(idPasien, session?.user.idFasyankes);

  return (
    <div className="flex flex-col gap-2">
      <PasienIdentitasComponent pasien={resApi} />
      <AlertHeaderComponent message="10 Catatan terakhir" />
      <div className="overflow-x-auto">
        <div className="overflow-y-auto h-96">
          <table className="table table-sm table-zebra">
            <thead className="bg-base-200">
              <tr>
                <th>No</th>
                <th>Tanggal / Jam</th>
                <th>Profesi</th>
                <th>SOAP</th>
                <th>Diagnosa</th>
                <th>Resep</th>
                <th>Diisi oleh</th>
                <th className="text-center">Verifikasi DPJP</th>
              </tr>
            </thead>
            <tbody>
              {getcppt.map((item: any, index: number) => {
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      {format(item.createdAt, "dd/MM/yyyy-HH:mm")}
                      <br />
                      No Regis : {item.pendaftaranId}
                    </td>
                    <td>{item.profesi.toUpperCase()}</td>
                    <td>
                      <Link
                        className="btn btn-md btn-primary"
                        href={`/klinik/cppt/detail/${idPasien}/${item.detailSOAP.id}`}
                      >
                        Detail SOAP
                      </Link>
                    </td>
                    <td>
                      <p>
                        {item.kodeDiagnosa}-{item.namaDiagnosa}
                      </p>
                    </td>
                    <td>
                      {item.resep.map((i: any) => {
                        return (
                          <div key={i.id} className="italic mt-2">
                            <p className="font-medium">R/</p>
                            <p className="font-medium">
                              {i.namaObat} ({i.signa1}X{i.signa2})
                            </p>
                            <p>{i.aturanPakai}</p>
                            <p>{i.waktu}</p>
                          </div>
                        );
                      })}
                    </td>
                    <td>
                      {item.profesi !== "Dokter" && (
                        <p className="mt-5 font-bold">
                          {item.inputBy?.namaLengkap}
                        </p>
                      )}
                    </td>
                    <td>
                      {item.isVerifDokter && (
                        <div className="flex flex-col items-center">
                          <QRCode
                            size={60}
                            value={`${item.inputBy?.namaLengkap}
          ${item.inputBy?.doctors?.[0]?.unit} 
          ${item.inputBy?.kodeDokter}`}
                          />
                          <p>{item.inputBy?.namaLengkap}</p>
                          <p>
                            {item.jamVerifDokter &&
                              format(item.jamVerifDokter, "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <AlertHeaderComponent message="Tambah catatan baru" />
      <FormAddCppt idregis={idRegis} session={session} />
    </div>
  );
};

export default PageCPPT;
