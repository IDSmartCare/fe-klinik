export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...updateData } = body; // Extract the `id` from the request body

  if (!id) {
    return new Response(JSON.stringify({ message: "ID is required" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/setting/editjadwal/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "Failed to update jadwal dokter";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({ message: "Jadwal dokter updated successfully", data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
}
