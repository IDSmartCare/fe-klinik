export async function GET(req: Request) {
  const body = await req.json();

  const { hari, idFasyankes } = body;

  try {
    const getData = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/dokter/jadwaldokter/${hari}/${idFasyankes}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        body: JSON.stringify(body),
      }
    );
    return getData;
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
}
