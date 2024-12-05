import BackButton from "@/app/components/BackButton";
import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import React from "react";

interface TableDetailSOAPProps {
  title: string;
  data: any[] | null;
}

const getData = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/byid/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return [];
  }
};

const getDetailSOAP = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/cppt/detailsoap/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        cache: "no-cache",
      }
    );
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching SOAP detail:", error);
    return [];
  }
};

const TableDetailSOAP = ({ title, data }: TableDetailSOAPProps) => {
  return (
    <>
      <div className="mt-3">
        <AlertHeaderComponent message={title} />
        <div className="overflow-x-auto">
          <table className="table table-zebra table-fixed w-full">
            <thead>
              <tr>
                <th className="w-2/12 text-center">No</th>
                <th className="w-11/12 text-left">Pertanyaan</th>
                <th className="w-4/12 text-left">Jawaban</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="text-center px-4 py-2">{index + 1}</td>
                    <td className="text-left px-4 py-2 whitespace-nowrap">
                      {item.question == null ? "-" : item.question}
                    </td>
                    <td className="text-left px-4 py-2 whitespace-nowrap">
                      {item.answer}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center px-4 py-2">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const PageDetailSOAP = async ({ params }: { params: { id: string[] } }) => {
  const idPasien = params.id[0];
  const idDetailSOAP = params.id[1];

  const pasienData = await getData(idPasien);
  const soapDetailData = await getDetailSOAP(idDetailSOAP);

  return (
    <>
      <BackButton />
      <PasienIdentitasComponent pasien={pasienData} />
      <TableDetailSOAP
        title="Subjective"
        data={soapDetailData.data.subjective}
      />
      <TableDetailSOAP title="Objective" data={soapDetailData.data.objective} />
      <TableDetailSOAP
        title="Assessment"
        data={soapDetailData.data.assessment}
      />
      <TableDetailSOAP title="Plan" data={soapDetailData.data.plan} />
      <TableDetailSOAP
        title="Instruction"
        data={soapDetailData.data.instruction}
      />
    </>
  );
};

export default PageDetailSOAP;
