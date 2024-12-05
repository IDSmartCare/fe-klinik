import FormEditTarif from "../../pageclient/FormEditTarif";

const getData = async (id: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/master-tarif/detailmastertarif/${id}`,
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

const EditTarif = async ({ params }: { params: { id: string } }) => {
  const data = await getData(params.id);

  return <FormEditTarif dataForm={data.data} />;
};

export default EditTarif;
