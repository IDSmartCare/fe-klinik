export const postApiMasterTarif = async ({
  url,
  data,
}: {
  url: string;
  data: any;
}) => {
  try {
    const getApi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/${url}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const resApi = await getApi.json();
    return resApi;
  } catch (error) {
    console.log(error);

    return null;
  }
};
