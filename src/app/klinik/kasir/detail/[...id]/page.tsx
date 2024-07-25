import prisma from "@/db"
import DetailBillPasien from "../../pageclient/DetailBillPasiten";

const getData = async (pendaftaranId: string) => {
    try {
        const getDb = await prisma.billPasien.findMany({
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
        <div>
            {data.map((item) => (
                <DetailBillPasien key={item.id} detailBill={item.billPasienDetail} />
            ))}
        </div>
    )
}

export default DetailBilling