import DetailBillPasien from "../../pageclient/DetailBillPasiten";

const getData = async (pendaftaranId: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/kasir/getbyidpendaftaran/${pendaftaranId}`,
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
const DetailBilling = async ({ params }: { params: { id: any } }) => {
  const idRegis = params.id[0];
  const data = await getData(idRegis);
  console.log("Detail bill", JSON.stringify(data, null, 2));

  return <DetailBillPasien detailBill={data} />;
};

export default DetailBilling;
