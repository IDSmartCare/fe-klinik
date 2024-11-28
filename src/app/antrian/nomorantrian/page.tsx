"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { getFormattedDate } from "@/app/helper/ConvertDate";
import { set } from "date-fns";

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
  const [lastAntrianAdmisi, setlastAntrianAdmisi] = useState<string>("A-0000");
  const [lastAntrianPasien, setlastAntrianPasien] = useState<string>("P-0000");
  const [messageVoiceAdmisi, setMessageVoiceAdmisi] = useState<string>("");
  const [messageVoicePasien, setMessageVoicePasien] = useState<string>("");
  const [poli, setPoli] = useState<string>("");
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
    const storedAntrian = localStorage.getItem("panggilAntrianAdmisi");

    if (storedDate !== today) {
      localStorage.setItem("lastDate", today); // Simpan tanggal hari ini
      localStorage.setItem("panggilAntrianAdmisi", "A-0000"); // Reset antrian ke A-0000
      setlastAntrianAdmisi("A-0000"); // Setel state antrian ke A-0000
    } else if (storedAntrian) {
      setlastAntrianAdmisi(storedAntrian); // Jika tanggal sama, gunakan nilai antrian yang ada
    }

    // Memperbarui data antrian setiap kali terjadi perubahan
    socket.on("panggilAntrianAdmisi", (data) => {
      setlastAntrianAdmisi(data.antrian);
      setMessageVoiceAdmisi(data.message);
      localStorage.setItem("panggilAntrianAdmisi", data.antrian); // Simpan data antrian baru ke localStorage
    });

    return () => {
      socket.off("panggilAntrianAdmisi");
    };
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storedDate = localStorage.getItem("lastDate");
    const storedAntrian = localStorage.getItem("panggilAntrianPasien");

    if (storedDate !== today) {
      localStorage.setItem("lastDate", today); // Simpan tanggal hari ini
      localStorage.setItem("panggilAntrianPasien", "A-0000"); // Reset antrian ke A-0000
      setlastAntrianPasien("P-0000"); // Setel state antrian ke A-0000
    } else if (storedAntrian) {
      setlastAntrianPasien(storedAntrian); // Jika tanggal sama, gunakan nilai antrian yang ada
    }

    // Memperbarui data antrian setiap kali terjadi perubahan
    socket.on("panggilAntrianPasien", (data) => {
      console.log(data);
      setlastAntrianPasien(data.antrian);
      setMessageVoicePasien(data.message);
      setPoli(data.poli);
      localStorage.setItem("panggilAntrianPasien", data.antrian); // Simpan data antrian baru ke localStorage
    });

    return () => {
      socket.off("panggilAntrianPasien");
    };
  }, []);

  useEffect(() => {
    if (messageVoiceAdmisi) {
      const audioPath = `/audio/admisi/${messageVoiceAdmisi}.mp3`;
      const audio = new Audio(audioPath);
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
      setMessageVoiceAdmisi("");
    }
  }, [messageVoiceAdmisi]);

  useEffect(() => {
    if (messageVoicePasien) {
      const audioPath = `/audio/pasien/${messageVoicePasien}.mp3`;
      const audio = new Audio(audioPath);

      audio.play().catch((err) => {
        // console.error("Error playing audio:", err);
      });

      const poliAudioPath = `/audio/poli/${poli}.mp3`;
      const fallbackAudioPath = "/audio/poli/poliyangterterapadakarcis.mp3";

      // Fungsi untuk mengecek keberadaan file
      const checkAudioExists = async (path: string): Promise<boolean> => {
        try {
          const response = await fetch(path, { method: "HEAD" }); // Menggunakan HEAD request untuk cek keberadaan file
          return response.ok; // Jika status 200-299, berarti file ada
        } catch (error) {
          // console.error("Error checking audio file:", error);
          return false;
        }
      };

      // Mengecek apakah audio poli ada
      checkAudioExists(poliAudioPath).then((exists) => {
        const audioToPlay = new Audio(
          exists ? poliAudioPath : fallbackAudioPath
        );

        setTimeout(() => {
          audioToPlay.play().catch((err) => {
            // console.error("Error playing poli audio:", err);
          });
        }, 2630);
      });

      setMessageVoicePasien("");
      setPoli("");
    }
  }, [messageVoicePasien, poli]);

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
        <CardAntrian title="Pasien" nomor={lastAntrianPasien} desc="Poli" />
        <CardAntrian
          title="Admisi"
          nomor={lastAntrianAdmisi}
          desc="Administrasi"
        />
      </div>

      <div className="flex flex-col text-center gap-2">
        <span className="font-bold text-5xl text-white">
          {getFormattedDate()}
        </span>
        <span className="font-bold text-4xl text-white opacity-80">
          {currentTime}
        </span>
      </div>
    </div>
  );
};

export default NomorAntrian;
