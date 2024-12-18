"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CetakBill } from "../interface/cetakBill";
import dynamic from "next/dynamic";
import { typeFormPasienBaru } from "../../pasien/interface/typeFormPasienBaru";
import { format } from "date-fns";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
const ModalPrintBillFarmasi = ({
  billFarmasi,
  pasien,
}: {
  billFarmasi: CetakBill | undefined;
  pasien: typeFormPasienBaru;
}) => {
  let totalBill = billFarmasi?.data.billPasienDetail.reduce(
    (prev, next) => Number(prev) + Number(next.subTotal),
    0
  );
  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    companyInfo: {
      width: "40%",
    },
    customerInfo: {
      textAlign: "right",
      width: "60%",
    },
    logo: {
      width: 100,
      height: 100,
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: "center",
    },
    item: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      marginBottom: 5,
      paddingBottom: 5,
    },
    itemName: {
      width: "70%",
    },
    itemPrice: {
      textAlign: "right",
      width: "30%",
    },
    total: {
      fontSize: 18,
      marginTop: 20,
    },
  });
  return (
    <dialog id="modal-print-bill-farmasi" className="modal">
      <div className="modal-box w-8/12 max-w-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <PDFViewer className="w-full h-80">
          <Document>
            <Page style={styles.page}>
              {/* <View style={styles.header}>
                                <View style={styles.companyInfo}>
                                    {company.logo && <Image style={styles.logo} src={company.logo} />}
            <Text>{company.address}</Text>
            <Text>{company.phone}</Text>
                                </View>
                                <View style={styles.customerInfo}>
                                    <Text>Invoice No: {billFarmasi?.data.id}</Text>
                                    <Text>Date: {billFarmasi?.data.id && format(new Date(billFarmasi?.data.createdAt), 'dd/MM/yyyy')}</Text>
                                    <Text>{pasien.namaPasien}</Text>
                                    <Text>{pasien.kelurahanDomisili}</Text>
                                </View>
                            </View> */}
              <Text style={styles.title}>Resep Obat</Text>
              <View style={styles.item}>
                <Text style={styles.itemName}>Item</Text>
              </View>
              {billFarmasi?.data.billPasienDetail.map((item) => (
                <View key={item.id} style={styles.item}>
                  <Text style={styles.itemName}>{item.deskripsi}</Text>
                </View>
              ))}
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </dialog>
  );
};

export default ModalPrintBillFarmasi;
