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

const ModalPrintKwintansi = ({ tagihan }: { tagihan: any }) => {
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
      textAlign: "right",
      fontSize: 18,
      marginTop: 20,
    },
    metodeBayar: {
      marginTop: 10,
    },
  });
  return (
    <dialog id="modal-print-bill-pasien" className="modal">
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
              <Text style={styles.metodeBayar}>
                Metode Pembayaran : {tagihan?.pembayaranBill[0].kategoriBayar}
              </Text>

              <Text style={styles.total}>
                Total:{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(Number(totalBill))}
              </Text>
              {tagihan?.pembayaranBill.map((item: any) => {
                return (
                  <View key={item.id}>
                    <Text style={styles.total}>
                      Diskon:{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(item.totalDiskon))}
                    </Text>
                    <Text style={styles.total}>
                      Pajak:{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(item.totalPajak))}
                    </Text>
                    <Text style={styles.total}>
                      Total Bayar:{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(item.totalBayar))}
                    </Text>
                    <Text style={styles.total}>
                      Kembalian :{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(item.kembalian))}
                    </Text>
                  </View>
                );
              })}
              <Text style={styles.total}>Status: {tagihan?.status}</Text>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </dialog>
  );
};

export default ModalPrintKwintansi;
