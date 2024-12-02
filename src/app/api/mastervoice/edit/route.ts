export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();

    // Ambil id dari parameter atau formData (sesuaikan sesuai kebutuhan)
    const id = formData.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/setting/updatevoicepoli/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify(error), { status: response.status });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    // Tangani error
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 400 }
    );
  }
}
