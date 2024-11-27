"use client";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import AntrianAdmisiColumn from "./AntrianAdmisiColumn";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}`);

const AntrianAdmisi = () => {
  const [lastAntrian, setLastAntrian] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storedDate = localStorage.getItem("lastDate");
    const storedAntrian = localStorage.getItem("lastAntrianAdmisi");

    if (storedDate !== today) {
      localStorage.setItem("lastDate", today);
      localStorage.setItem("lastAntrianAdmisi", JSON.stringify([])); 
      setLastAntrian([]); 
    } else if (storedAntrian) {
      setLastAntrian(JSON.parse(storedAntrian)); 
    } else {
      console.log("No data found in localStorage");
    }

    socket.on("lastAntrianAdmisiUpdated", (data) => {
      console.log("Socket data received:", data.antrian);
      if (data && data.antrian) {
        setLastAntrian(data.antrian);
        localStorage.setItem("lastAntrianAdmisi", JSON.stringify(data.antrian));
      } else {
        console.error("Received invalid data:", data);
      }
    });

    return () => {
      socket.off("lastAntrianAdmisiUpdated");
    };
  }, []);

  return (
    <>
      <AlertHeaderComponent message="Antrian terdaftar hari ini" />
      <TableFilterComponent
        rowsData={lastAntrian}
        columnsData={AntrianAdmisiColumn}
      />
    </>
  );
};

export default AntrianAdmisi;
