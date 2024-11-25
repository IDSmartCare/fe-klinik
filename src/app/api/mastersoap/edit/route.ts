export async function PATCH(req: Request) {
  const body = await req.json();
  const { endpoint, id } = body;

  const validEndpoints = [
    "master-subjective",
    "master-objective",
    "master-assessment",
    "master-plan",
    "master-instruction",
  ];

  if (!validEndpoints.includes(endpoint)) {
    return new Response("Invalid endpoint", { status: 400 });
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

        body: JSON.stringify(body.data),
      }
    );

    if (!postApi.ok) {
      const errorResponse = await postApi.json();
      return new Response(errorResponse.message, { status: postApi.status });
    }

    const responseData = await postApi.json();
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(error.message || "Request failed", { status: 400 });
  }
}
