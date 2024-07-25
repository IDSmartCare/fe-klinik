import { format } from "date-fns";
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent";
import Link from "next/link";

const ListBillingPasien = ({ dataRegis }: { dataRegis: any }) => {

    return (
        <div className="flex flex-col gap-2">
            <AlertHeaderComponent message="List Tagihan Yang Ada!" />
            <div className="flex flex-wrap gap-2 bg-base-200 p-2 h-full">
                {dataRegis?.map((item: any) => (
                    <div className="card bg-base-100 w-96 shadow-xl" key={item.id}>
                        <div className="card-body">
                            <h2 className="card-title">{format(item.createdAt, 'dd/MM/yyyy HH:mm')}</h2>
                            <p>ID Registrasi : {item?.id}</p>
                            <p>Penjamin : {item?.penjamin}</p>
                            <p>Poli : {item.jadwal?.dokter.poliklinik?.namaPoli}</p>
                            <p>Dokter : {item.jadwal?.dokter.namaLengkap}</p>
                            <div className="card-actions justify-end">
                                <Link href={`/klinik/kasir/detail/${item.id}`} className="btn btn-primary">Bayar</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListBillingPasien