import PasienIdentitasComponent from "@/app/components/PasienIdentitasComponent";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import { authOption } from "@/auth";
import { getServerSession } from "next-auth";
import FormTransaksiResep from "../../pageclient/FormTransaksiResep";
import Link from "next/link";


const getData = async (id: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/byid/${id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            }
        })
        if (!getapi.ok) {
            return []
        }
        return getapi.json()
    } catch (error) {
        console.log(error);
        return []
    }
}
const getSoap = async (id: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/cppt/${id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            }
        })
        if (!getapi.ok) {
            return []
        }
        return getapi.json()
    } catch (error) {
        console.log(error);
        return []
    }
}
const getDataResep = async (id: string) => {
    try {
        const getapi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/resep/bysoap/${id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            }
        })
        if (!getapi.ok) {
            return null
        }
        return getapi.json()
    } catch (error) {
        console.log(error);
        return null
    }
}

const PageInputResep = async ({ params }: { params: { id: any } }) => {
    const idSoap = params.id[0]
    const idPasien = params.id[1]
    const idRegis = params.id[2]
    const session = await getServerSession(authOption)
    const data = await getDataResep(idSoap)
    const soap = await getSoap(idSoap)
    const resApi = await getData(idPasien)
    return (
        <div className="flex flex-col gap-2">
            <Link href={"/klinik/farmasi"}><button className="btn btn-sm btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clipRule="evenodd" />
                </svg>
                Kembali</button></Link>
            <PasienIdentitasComponent pasien={resApi} />
            <AlertHeaderComponent message="Transaksi Resep!" />
            <FormTransaksiResep pasien={resApi} soap={soap} data={data} session={session} pendaftaranId={idRegis} />

        </div>
    )
}

export default PageInputResep