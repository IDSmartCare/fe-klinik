'use server'

import prisma from "@/db"

export async function getTransaksiFarmasi(pendaftaranId: number) {
    try {
        const getDb = await prisma.billPasien.findMany({
            where: {
                pendaftaranId: Number(pendaftaranId)
            }
        })
        return {
            status: true,
            message: "Berhasil",
            data: getDb
        }
    } catch (error) {
        return {
            status: false,
            message: error,
            data: "null"
        }
    }
}