export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/setting/createvoicepoli`,
      {
        method: "POST",
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
    return new Response(error.message, { status: 400 });
  }
}
