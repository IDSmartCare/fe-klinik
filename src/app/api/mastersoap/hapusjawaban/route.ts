export async function DELETE(req: Request) {
  const body = await req.json();
  const { endpoint, id } = body;

  const validEndpoints = [
    "subjective-answer",
    "objective-answer",
    "assessment-answer",
    "plan-answer",
    "instruction-answer",
  ];

  if (!validEndpoints.includes(endpoint)) {
    return new Response("Endpoint tidak valid", { status: 400 });
  }

  try {
    const deleteApi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/${endpoint}/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );

    if (!deleteApi.ok) {
      const errorResponse = await deleteApi.json();
      return new Response(errorResponse.message || "Kesalahan pada API", {
        status: deleteApi.status,
      });
    }

    const responseData = await deleteApi.json();
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(error.message || "Request gagal", { status: 400 });
  }
}
