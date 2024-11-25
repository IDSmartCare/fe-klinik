export async function PATCH(req: Request) {
  const body = await req.json();
  const { endpoint, data: requestBody, id } = body;

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
    const postApi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/${endpoint}/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!postApi.ok) {
      const errorResponse = await postApi.json();
      return new Response(errorResponse.message || "Kesalahan pada API", {
        status: postApi.status,
      });
    }

    const responseData = await postApi.json();
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(error.message || "Request gagal", { status: 400 });
  }
}
