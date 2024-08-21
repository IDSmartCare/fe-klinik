import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import prisma from "@/db";
import { TransaksiPOSDetail } from "../../../interface/listHistoryPos";

const getData = async (id: string) => {
    try {
        const getDb = await prisma.transaksiPOS.findFirst({
            where: {
                id: Number(id),
            },
            include: {
                transaksiPosDetail: true
            },
        })
        return getDb
    } catch (error) {
        console.log(error);
        return []
    }
}
const DetailPos = async ({ params }: { params: { id: any } }) => {
    const id = params.id[0]
    const data: any = await getData(id)
    return (
        <div className="flex flex-col gap-2">
            <AlertHeaderComponent message="Detail Transaksi POS" />
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Detail</th>
                            <th>Pelanggan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>No Ref</td>
                            <td>{data?.groupTransaksiId}</td>
                        </tr>
                        <tr>
                            <td>Nama Pelanggan</td>
                            <td>{data?.namaPelanggan}</td>
                        </tr>
                        <tr>
                            <td>HP Pelanggan</td>
                            <td>{data?.hpPelanggan}</td>
                        </tr>
                        <tr>
                            <td>Email Pelanggan</td>
                            <td>{data?.emailPelanggan}</td>
                        </tr>
                        <tr className="bg-base-300">
                            <td colSpan={6}></td>
                        </tr>

                    </tbody>
                    <thead>
                        <tr>
                            <th>Barang</th>
                            <th>Harga Jual</th>
                            <th>Diskon</th>
                            <th>Setelah Diskon</th>
                            <th>Jumlah</th>
                            <th>Sub Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.transaksiPosDetail.map((item: TransaksiPOSDetail) => (
                            <tr key={item.id}>
                                <td>{item.namaBarang}</td>
                                <td>{item.hargaJual}</td>
                                <td>{item.diskonFromBo}</td>
                                <td>{item.hargaSetelahDiskon}</td>
                                <td>{item.qty}</td>
                                <td>{Number(item.qty) * Number(item.hargaSetelahDiskon)}</td>
                            </tr>
                        ))}
                        <tr className="bg-base-300">
                            <td colSpan={6}></td>
                        </tr>
                        <tr>
                            <td colSpan={4}></td>
                            <td>Sub Total</td>
                            <td>{data?.subTotal}</td>
                        </tr>
                        <tr>
                            <td colSpan={4}></td>
                            <td>Pajak</td>
                            <td>{data?.pajak}</td>
                        </tr>
                        <tr>
                            <td colSpan={4}></td>
                            <td>Diskon</td>
                            <td>{data?.diskonInvoice}</td>
                        </tr>
                        <tr>
                            <td colSpan={4}></td>
                            <td>Biaya Lainnya</td>
                            <td>{data?.biayaLainnya}</td>
                        </tr>
                        <tr>
                            <td colSpan={4}></td>
                            <td>Grand Total</td>
                            <td>{data?.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DetailPos