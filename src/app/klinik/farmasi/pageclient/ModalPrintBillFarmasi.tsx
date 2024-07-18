'use client'

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CetakBill } from "../interface/cetakBill"
import dynamic from "next/dynamic";
import { typeFormPasienBaru } from "../../pasien/interface/typeFormPasienBaru";


const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => <p>Loading...</p>,
    },
);
const ModalPrintBillFarmasi = ({ billFarmasi, pasien }: { billFarmasi: CetakBill[], pasien: typeFormPasienBaru }) => {
    let totalBill = billFarmasi.reduce((prev, next) => Number(prev) + Number(next.total), 0)
    const styles = StyleSheet.create({
        page: {
            fontSize: 12,
            padding: 20,
            flexDirection: 'column',
        },
        header: {
            textAlign: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 24,
            marginBottom: 10,
        },
        companyInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        billingTable: {
            display: 'flex',
            width: 'auto',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        tableRow: {
            margin: 'auto',
            flexDirection: 'row',
        },
        tableColHeader: {
            width: '25%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            backgroundColor: '#f2f2f2',
            padding: 5,
            textAlign: 'left',
        },
        tableCol: {
            width: '25%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            padding: 5,
            textAlign: 'left',
        },
        totals: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginTop: 20,
        },
        totalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '50%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            padding: 5,
            backgroundColor: '#f2f2f2',
        },
        totalRowContent: {
            width: '50%',
            textAlign: 'right',
        },
    });
    return (
        <dialog id="modal-print-bill-farmasi" className="modal">
            <div className="modal-box w-8/12 max-w-2xl">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <PDFViewer className="w-full h-80">
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Invoice Obat</Text>
                                <Text>Company Name</Text>
                                <Text>Company Address</Text>
                                <Text>Company Contact Info</Text>
                            </View>
                            <View style={styles.companyInfo}>
                                <View>
                                    <Text>PASIEN : {pasien.namaPasien} / {pasien.noRm}</Text>
                                    <Text>ASAL : {pasien.kelurahanDomisili}</Text>
                                    <Text>HP : {pasien.noHp}</Text>
                                </View>
                            </View>
                            <View style={styles.billingTable}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableColHeader}>Deskripsi</Text>
                                    <Text style={styles.tableColHeader}>Jumlah</Text>
                                    <Text style={styles.tableColHeader}>Harga</Text>
                                    <Text style={styles.tableColHeader}>Total</Text>
                                </View>
                                {billFarmasi.map((item) => {
                                    return (
                                        <View style={styles.tableRow} key={item.id}>
                                            <Text style={styles.tableCol}>{item.deskripsi}</Text>
                                            <Text style={styles.tableCol}>{item.jumlah}</Text>
                                            <Text style={styles.tableCol}>{new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                            }).format(Number(item.harga))}</Text>
                                            <Text style={styles.tableCol}>{new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                            }).format(Number(item.total))}</Text>
                                        </View>

                                    )
                                })}

                            </View>
                            <View style={styles.totals}>
                                <View style={styles.totalRow}>
                                    <Text>Total</Text>
                                    <Text style={styles.totalRowContent}>{
                                        new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        }).format(Number(totalBill))}</Text>
                                </View>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            </div>
        </dialog>
    )
}

export default ModalPrintBillFarmasi