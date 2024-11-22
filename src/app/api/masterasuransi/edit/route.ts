export async function PATCH(req: Request) {
  const body = await req.json();
  const { id } = body;

  try {
    const postApi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/masterasuransi/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        body: JSON.stringify({ ...body, id }),
      }
    );

    if (!postApi.ok) {
      const errorData = await postApi.json();
      return new Response(JSON.stringify({ message: errorData.message }), {
        status: postApi.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const responseData = await postApi.json();
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message || "Something went wrong" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
