import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import prisma from "@/db";

const getData = async (id: string) => {
    try {
        const getDb = await prisma.pasien.findFirst({
            where: {
                id: Number(id)
            }
        })
        return getDb
    } catch (error) {
        console.log(error);
        return null
    }
}

const PageRegistrasi = async ({ params }: { params: { id: string } }) => {
    const resApi = await getData(params.id)
    return (
        <div className="flex flex-col">
            <PasienIdentitasComponent pasien={resApi} />
        </div>
    )
}

export default PageRegistrasi