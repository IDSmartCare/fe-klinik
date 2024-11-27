"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface CardAntrianProps {
  title: string;
  nomor: string;
  desc: string;
}

const CardAntrian = (props: CardAntrianProps) => {
  return (
    <div className="px-20 py-16 rounded-xl justify-center items-center bg-white flex flex-col gap-16">
      <span className="font-bold text-4xl text-primary">
        Antrian {props.title}
      </span>
      <span className="font-bold text-8xl text-primary">{props.nomor}</span>
      <span className="text-primary text-2xl">
        Silahkan Menuju <span className="font-bold">{props.desc}</span>
      </span>
    </div>
  );
};

const socket = io(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}`);

const NomorAntrian = () => { 
  const { data: session } = useSession();
  const [lastAntrian, setLastAntrian] = useState<string>("A-0000");
  const [messageVoice, setMessageVoice] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("00:00:00");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours} : ${minutes} : ${seconds}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleDateString();

    const storedDate = localStorage.getItem("lastDate");
    const storedAntrian = localStorage.getItem("lastAntrian");

    if (storedDate !== today) {
      localStorage.setItem("lastDate", today); // Simpan tanggal hari ini
      localStorage.setItem("lastAntrian", "A-0000"); // Reset antrian ke A-0000
      setLastAntrian("A-0000"); // Setel state antrian ke A-0000
    } else if (storedAntrian) {
      setLastAntrian(storedAntrian); // Jika tanggal sama, gunakan nilai antrian yang ada
    }

    // Memperbarui data antrian setiap kali terjadi perubahan
    socket.on("lastAntrianUpdated", (data) => {
      setLastAntrian(data.antrian);
      setMessageVoice(data.message);
      localStorage.setItem("lastAntrian", data.antrian); // Simpan data antrian baru ke localStorage
    });

    return () => {
      socket.off("lastAntrianUpdated");
    };
  }, []);

  useEffect(() => {
    if (messageVoice) {
      const audioPath = `/audio/admisi/${messageVoice}.mp3`;
      const audio = new Audio(audioPath);
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
    }
  }, [messageVoice]);

  return (
    <div
      className="h-screen flex flex-col gap-12 2xl:gap-28 items-center justify-center"
      style={{
        backgroundImage: "url('/background-APM.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="text-white">
        <h1 className="font-bold text-5xl">
          {`Klinik ${session?.user.nameFasyankes}`}
        </h1>
      </div>

      <div className="flex gap-8">
        <CardAntrian title="Pasien" nomor="P-0001" desc="Poli" />
        <CardAntrian title="Admisi" nomor={lastAntrian} desc="Administrasi" />
      </div>

      <div>
        <span className="font-bold text-5xl text-white">{currentTime}</span>
      </div>
    </div>
  );
};

export default NomorAntrian;
