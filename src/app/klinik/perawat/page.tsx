"use client";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent";
import PerawatTableColumn from "./PerawatTableColumn";
import FilterPasienComponent from "@/app/components/FilterPasienComponent";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}`);

const PagePerawat = () => {
  const [lastAntrian, setLastAntrian] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storedDate = localStorage.getItem("lastDate");
    const storedAntrian = localStorage.getItem("dataAntrianPasien");

    if (storedDate !== today) {
      localStorage.setItem("lastDate", today);
      localStorage.setItem("dataAntrianPasien", JSON.stringify([]));
      setLastAntrian([]);
    } else if (storedAntrian) {
      setLastAntrian(JSON.parse(storedAntrian));
    } else {
      console.log("No data found in localStorage");
    }

    socket.on("dataAntrianPasien", (data) => {
      console.log("Socket data received asd:", data.antrian);
      if (data) {
        setLastAntrian(data.antrian);
        localStorage.setItem("dataAntrianPasien", JSON.stringify(data.antrian));
      } else {
        console.error("Received invalid data:", data);
      }
    });

    return () => {
      socket.off("dataAntrianPasien");
    };
  }, []);

  return (
    <>
      <FilterPasienComponent />
      <AlertHeaderComponent message="Pasien terdaftar hari ini" />
      <TableFilterComponent
        rowsData={lastAntrian}
        columnsData={PerawatTableColumn}
      />
    </>
  );
};

export default PagePerawat;
