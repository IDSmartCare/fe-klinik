import prisma from "@/db"
import DetailBillPasien from "../../pageclient/DetailBillPasiten";

const getData = async (pendaftaranId: string) => {
    try {
        const getDb = await prisma.billPasien.findFirst({
            where: {
                pendaftaranId: Number(pendaftaranId)
            },
            include: {
                billPasienDetail: true
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return []
    }
}
const DetailBilling = async ({ params }: { params: { id: any } }) => {
    const idRegis = params.id[0]
    const data = await getData(idRegis)

    return (
        <DetailBillPasien detailBill={data} />
    )
}

export default DetailBilling