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

  return Response.json(data);
}
