export async function POST(req: Request) {
  const body = await req.json(); // Parse the incoming JSON body

  try {
    // Forward the request to the Finpay API
    const postApi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_PAYMENT_FINPAY}/initiate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!postApi.ok) {
      return new Response("Error from external API", { status: 500 });
    }

    const result = await postApi.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
}
