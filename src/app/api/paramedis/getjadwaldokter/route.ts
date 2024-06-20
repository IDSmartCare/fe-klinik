import prisma from '@/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const hari = searchParams.get('hari') as string
    const data = await prisma.jadwalDokter.findMany({
        where: {
            kodeHari: Number(hari),
            isAktif: true
        },
        include: {
            dokter: {
                select: {
                    namaDokter: true,
                    poliKlinik: {
                        select: {
                            namaPoli: true,
                            kodePoli: true
                        }
                    }
                }
            }
        }
    })

    return NextResponse.json(data)
}