"use client";
import TableFilterComponent from "@/app/components/TableFilterComponent";
import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import AntrianPasienColumn from "./AntrianPasienColumn";
import { useSession } from "next-auth/react";
import { ToastAlert } from "@/app/helper/ToastAlert";

const socket = io(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}`);

const AntrianPasien = () => {
  const [lastAntrian, setLastAntrian] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const getData = async () => {
      try {
        const getapi = await fetch(
          `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/listregistrasi/${session?.user.idFasyankes}`,
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
        setLastAntrian(data);
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
    socket.on("dataAntrianPasien", (data) => {
      // console.log("Socket data received:", data.antrian);
      if (data && data.antrian) {
        setLastAntrian(data.antrian);
      } else {
        console.error("Received invalid data:", data);
      }
    });

    return () => {
      socket.off("dataAntrianPasien");
    };
  }, []);

  // const handleClick = async () => {
  //   try {
  //     const getapi = await fetch(
  //       `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/listregistrasi/${session?.user.idFasyankes}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
  //         },
  //       }
  //     );
  //     if (!getapi.ok) {
  //       return [];
  //     }
  //     ToastAlert({ icon: "success", title: "Berhasil Mendapatkan Data Baru" });
  //     return getapi.json();
  //   } catch (error) {
  //     console.log(error);
  //     ToastAlert({ icon: "error", title: "Tidak ada antrian Pasien" });
  //     return [];
  //   }
  // };

  return (
    <>
      <AlertHeaderComponent message="Antrian pasien hari ini" />
      {/* <button className="mb-[-50px] z-[9999] w-max">
        <button className="btn btn-sm btn-primary" onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
              clip-rule="evenodd"
            />
          </svg>
          Klik untuk mendapatkan data baru
        </button>
      </button> */}
      <TableFilterComponent
        rowsData={lastAntrian}
        columnsData={AntrianPasienColumn}
      />
    </>
  );
};

export default AntrianPasien;
