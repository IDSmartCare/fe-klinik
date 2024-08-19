import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../paramedis/components/AlertHeaderComponent"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import { getApiBisnisOwner } from "@/app/lib/apiBisnisOwner"
import prisma from "@/db"

const getDb = async (idFasyankes: string) => {
    try {
        const getApi = await getApiBisnisOwner({ url: `list-username?fasyankes_id=${idFasyankes}` })
        const listUser = getApi?.data
        const ids = listUser.map((item: any) => Number(item.id_profile))
        const getDb = await prisma.profile.findMany({
            where: {
                id: {
                    in: ids

                }
            }
        })
        const listRes = listUser.map((item: any) => {
            return {
                ...item,
                detail: getDb.find((i) => i.id === Number(item.id_profile))
            }
        })
        return listRes
    } catch (error) {
        return []
    }
}

const UserLoginPage = async () => {
    const session = await getServerSession(authOption)
    const data = await getDb(session?.user.idFasyankes)
    console.log(data);

    return (
        <div className="flex flex-col">
            <AlertHeaderComponent message="List userlogin" />
            <TableFilterComponent rowsData={[]} columnsData={[]} />

        </div>
    )
}

export default UserLoginPage