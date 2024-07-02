import prisma from "@/db";

export async function POST(req: Request) {
    const body = await req.json()

    if (body.findBy === "norm") {
        const data = await prisma.pasien.findFirst({
            where: {
                isAktif: true,
                idFasyankes: body.idFasyankes,
                noRm: body.value
            }
        })
        return Response.json(data)
    } else if (body.findBy === "nik") {
        const data = await prisma.pasien.findFirst({
            where: {
                isAktif: true,
                idFasyankes: body.idFasyankes,
                nik: body.value
            }
        })
        return Response.json(data)
    } else if (body.findBy === "nobpjs") {
        const data = await prisma.pasien.findFirst({
            where: {
                isAktif: true,
                idFasyankes: body.idFasyankes,
                bpjs: body.value
            }
        })
        return Response.json(data)
    } else if (body.findBy === "namapasien") {
        const data = await prisma.pasien.findMany({
            where: {
                isAktif: true,
                idFasyankes: body.idFasyankes,
                namaPasien: { startsWith: body.value.toUpperCase() }
            }
        })
        return Response.json(data)
    } else {
        const data = await prisma.pasien.findMany({
            where: {
                isAktif: true,
                idFasyankes: body.idFasyankes,
                noHp: { startsWith: body.value }
            }
        })
        return Response.json(data)
    }
}