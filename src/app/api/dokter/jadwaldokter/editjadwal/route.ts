export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const postApi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/dokter/updatejadwal/${body.availableDayId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        body: JSON.stringify(body.data),
      }
    );
    return postApi;
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
}
