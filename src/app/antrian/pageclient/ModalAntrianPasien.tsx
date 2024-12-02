"use client";
import { Document, Page, StyleSheet, Text } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import React from "react";
import { useSession } from "next-auth/react";

interface ModalPrintPasienProps {
  nomorAntrian: string;
  poli?: string;
  tanggalDaftar?: string;
  jamDaftar?: string;
}

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const styles = StyleSheet.create({
  page: {
    padding: 5,
    fontFamily: "Helvetica",
    fontSize: 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  separator: {
    width: "100%",
    textAlign: "center",
    marginVertical: 5,
  },
  ticketNumber: {
    fontSize: 35,
    fontWeight: "bold",
    marginVertical: 5,
  },
  instruction: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 9,
    marginRight: 27,
    marginLeft: 27,
    marginBottom: 10,
  },
  footer: {
    fontSize: 8,
    textAlign: "center",
  },
  Date: {
    fontSize: 8,
    textAlign: "center",
  },
});

const ModalPrintPasien: React.FC<ModalPrintPasienProps> = ({
  nomorAntrian,
  poli,
  tanggalDaftar,
  jamDaftar,
}) => {
  const { data: session } = useSession();
  return (
    <div>
      <dialog id="modal-antrian-pasien" className="modal">
        <div className="modal-box relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-lg font-bold">Tiket Antrian</h3>
          <div className="my-4">
            <PDFViewer style={{ width: "100%", height: "400px" }}>
              <Document>
                <Page size={[226.77, 170.08]} style={styles.page}>
                  <Text style={styles.header}>Nomor Antrian Pasien 
                    {session?.user.nameFasyankes}
                  </Text>
                  <Text style={styles.separator}>
                    ====================================
                  </Text>
                  <Text style={styles.ticketNumber}>{nomorAntrian}</Text>
                  <Text style={styles.separator}>
                    ====================================
                  </Text>
                  <Text style={styles.instruction}>Silahkan menuju {poli}</Text>
                  <Text style={styles.Date}>{tanggalDaftar}</Text>
                  <Text style={styles.footer}>{jamDaftar}</Text>
                </Page>
              </Document>
            </PDFViewer>
          </div>
          <div className="modal-action"></div>
        </div>
      </dialog>
    </div>
  );
};

export default ModalPrintPasien;
