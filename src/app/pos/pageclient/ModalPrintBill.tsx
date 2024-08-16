'use client'
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { TransaksiAfterSubmit } from "../interface/listAfterSubmit";
import { format } from "date-fns";

const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => <p>Loading...</p>,
    },
);

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    companyInfo: {
        width: '40%',
    },
    customerInfo: {
        textAlign: 'right',
        width: '60%',
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 5,
        paddingBottom: 5,
    },
    itemName: {
        width: '70%',
    },
    diskonItem: {
        width: '40%',
        textAlign: 'center'
    },
    qty: {
        width: '30%',
        textAlign: 'center'
    },
    itemPrice: {
        textAlign: 'right',
        width: '60%',
    },
    total: {
        fontSize: 18,
        marginTop: 20,
        textAlign: 'right',
    },

});

const ModalPrintBill = ({ data }: { data: TransaksiAfterSubmit | undefined | null }) => {
    return (
        <div>
            <dialog id="modal-pos-print" className="modal">
                <div className="modal-box w-8/12 max-w-2xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <PDFViewer className="w-full h-80">
                        <Document>
                            <Page style={styles.page}>
                                <View style={styles.header}>
                                    {/* <View style={styles.companyInfo}>
                                    {company.logo && <Image style={styles.logo} src={company.logo} />}
            <Text>{company.address}</Text>
            <Text>{company.phone}</Text>
                                </View>
                                */}
                                    <View style={styles.companyInfo}>
                                        <Text>Billing No: {data?.groupTransaksiId}</Text>
                                        <Text>Date: {data?.groupTransaksiId && format(new Date(data?.createdAt), 'dd/MM/yyyy')}</Text>
                                        <Text>{data?.namaPelanggan}</Text>
                                        <Text>{data?.hpPelanggan}</Text>
                                    </View>
                                </View>
                                <Text style={styles.title}>Billing Obat</Text>
                                <View style={styles.item}>
                                    <Text style={styles.itemName}>Item</Text>
                                    <Text style={styles.diskonItem}>Diskon Item</Text>
                                    <Text style={styles.qty}>Qty</Text>
                                    <Text style={styles.itemPrice}>Sub Total</Text>
                                </View>
                                {data?.transaksiPosDetail.map((item) => (
                                    <View key={item.id} style={styles.item}>
                                        <Text style={styles.itemName}>{item.namaBarang} {item.hargaJual}</Text>
                                        <Text style={styles.diskonItem}>{item.diskonFromBo} </Text>
                                        <Text style={styles.qty}>@{item.qty} </Text>

                                        <Text style={styles.itemPrice}>{new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        }).format(Number(item.hargaSetelahDiskon) * (Number(item.qty)))}</Text>
                                    </View>
                                ))}

                                <Text style={styles.total}>Sub Total: {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(Number(data?.subTotal))}</Text>
                                <Text style={styles.total}>Pajak: {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(Number(data?.pajak))}</Text>
                                <Text style={styles.total}>Diskon: {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(Number(data?.diskonInvoice))}</Text>
                                <Text style={styles.total}>Biaya Lain: {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(Number(data?.biayaLainnya))}</Text>
                                <Text style={styles.total}>Total: {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(Number(data?.total))}</Text>
                            </Page>
                        </Document>
                    </PDFViewer>
                </div>
            </dialog>
        </div>
    )
}

export default ModalPrintBill