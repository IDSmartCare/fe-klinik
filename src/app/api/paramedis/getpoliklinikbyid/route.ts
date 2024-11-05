import prisma from "@/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idData = searchParams.get("idpoli") as string;

  // Fetch data from the database
  const data = await prisma.poliKlinik.findFirst({
    where: {
      id: Number(idData),
    },
  });

  // Create a response with CORS headers
  const response = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Change * to your allowed origin if needed
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Adjust methods based on your needs
      "Access-Control-Allow-Headers": "Content-Type", // Specify allowed headers
    },
  });

  return response;
}

export const dynamic = "force-dynamic";
