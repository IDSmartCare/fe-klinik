import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import prisma from "@/db";
import FormRegistrasi from "../../pageclient/FormRegistrasi";

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
        <div className="flex flex-col gap-2">
            <PasienIdentitasComponent pasien={resApi} />
            <FormRegistrasi idpasien={params.id} />
        </div>
    )
}

export default PageRegistrasi