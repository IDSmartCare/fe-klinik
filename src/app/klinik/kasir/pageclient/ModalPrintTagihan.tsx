"use client";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
const ModalPrintTagihan = ({ tagihan }: { tagihan: any }) => {
  let totalBill = tagihan?.billPasienDetail.reduce(
    (prev: any, next: any) => Number(prev) + Number(next.subTotal),
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
      marginTop: 20,
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
    asuransi: {
      fontSize: 13,
      marginTop: 20,
      fontStyle: "italic",
      alignSelf: "flex-end",
    },
  });
  return (
    <dialog id="modal-print-bill-kasir" className="modal">
      <div className="modal-box w-8/12 max-w-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <PDFViewer className="w-full h-80">
          <Document>
            <Page style={styles.page}>
              <Text>
                No Rekam Medis :{" "}
                {tagihan?.Pendaftaran?.episodePendaftaran?.pasien?.noRm}
              </Text>
              <Text>
                Nama :{" "}
                {tagihan?.Pendaftaran?.episodePendaftaran?.pasien?.namaPasien
                  .toLowerCase()
                  .split(" ")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ")}
              </Text>
              <Text>
                Registrasi :{" "}
                {tagihan?.Pendaftaran?.episodePendaftaran?.createdAt &&
                  format(
                    new Date(
                      tagihan?.Pendaftaran?.episodePendaftaran?.createdAt
                    ),
                    "dd/MM/yyyy - HH:mm"
                  )}
              </Text>
              <Text style={styles.title}>Invoice Pasien</Text>
              <View style={styles.item}>
                <Text style={styles.itemName}>Item</Text>
                <Text style={styles.itemPrice}>Sub Total</Text>
              </View>
              {tagihan?.billPasienDetail.map((item: any) => (
                <View key={item.id} style={styles.item}>
                  <Text style={styles.itemName}>
                    {item.deskripsi} {item.jumlah}@{item.harga}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(Number(item.subTotal))}
                  </Text>
                </View>
              ))}
              <Text style={styles.total}>
                Total:{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(Number(totalBill))}
              </Text>
              {tagihan?.Pendaftaran.penjamin.includes("ASURANSI") && (
                <Text style={styles.asuransi}>
                  *Biaya ini ditangguhkan oleh : {tagihan?.Pendaftaran.penjamin}
                </Text>
              )}

              {tagihan?.Pendaftaran.penjamin.includes("BPJS") && (
                <Text style={styles.asuransi}>
                  *Biaya ini ditangguhkan oleh : {tagihan?.Pendaftaran.penjamin}
                </Text>
              )}
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </dialog>
  );
};

export default ModalPrintTagihan;
