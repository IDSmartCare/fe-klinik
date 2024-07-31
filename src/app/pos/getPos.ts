'use server'

import prisma from "@/db"

export default async function GetPosByGroupId(groupId: string) {
    try {
        const getData = await prisma.transaksiPOS.findMany({
            where: {
                groupTransaksiId: groupId
            }
        })
        return {
            status: true,
            message: "Berhasil",
            data: getData,
        }
    } catch (error) {
        return {
            status: false,
            message: error,
            data: "null"
        }
    }
}