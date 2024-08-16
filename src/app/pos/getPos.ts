'use server'

import prisma from "@/db"

export default async function GetPosByGroupId(groupId: string) {
    try {
        const getData = await prisma.transaksiPOS.findFirst({
            where: {
                groupTransaksiId: groupId
            },
            include: {
                transaksiPosDetail: true
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