"use client";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import AntrianAdmisiColumn from "./AntrianAdmisiColumn";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSession } from "next-auth/react";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { get } from "http";

const socket = io(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}`);

const AntrianAdmisi = () => {
  const [lastAntrian, setLastAntrian] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const getData = async () => {
      try {
        const getapi = await fetch(
          `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/antrian/all/admisi/${session?.user.idFasyankes}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
          }
        );

        if (!getapi.ok) {
          ToastAlert({ icon: "error", title: "Gagal Mendapatkan Data" });
          return [];
        }

        const data = await getapi.json();
        setLastAntrian(data.antrianToday);
      } catch (error) {
        console.log(error);
        ToastAlert({ icon: "error", title: "Tidak ada antrian Pasien" });
        setLastAntrian([]);
      }
    };

    if (session?.user.idFasyankes) {
      getData();
    }
  }, [session?.user.idFasyankes]);

  useEffect(() => {
    socket.on("dataAntrianAdmisi", (data) => {
      // console.log("Socket data received:", data.antrian);
      if (data && data.antrian) {
        setLastAntrian(data.antrian);
      } else {
        console.error("Received invalid data:", data);
      }
    });

    return () => {
      socket.off("dataAntrianAdmisi");
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
