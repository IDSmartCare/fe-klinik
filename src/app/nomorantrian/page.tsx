"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { getFormattedDate } from "@/app/helper/ConvertDate";
import { TimeAPM } from "@/app/helper/TimeAPM";
import ModalOnboarding from "../antrian/pageclient/ModalOnboarding";

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

const NomorAntrianPage = () => {
  const { data: session } = useSession();
  const [lastAntrianAdmisi, setlastAntrianAdmisi] = useState<string>("A-0000");
  const [lastAntrianPasien, setlastAntrianPasien] = useState<string>("P-0000");
  const [messageVoiceAdmisi, setMessageVoiceAdmisi] = useState<string>("");
  const [messageVoicePasien, setMessageVoicePasien] = useState<string>("");
  const [poli, setPoli] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>(TimeAPM());
  const [modalShow, setModalShow] = useState(true);
  const todayForAdmisi = new Date().toLocaleDateString();
  const todayForPasien = new Date().toLocaleDateString();

  useEffect(() => {
    const modal: any = document.getElementById("modal-onboarding");
    modal?.showModal();
    return () => modal?.close();
  }, []);

  const handleCloseModal = () => {
    setModalShow(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(TimeAPM());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const storedAntrian = localStorage.getItem("panggilAntrianAdmisi");
    const storedDate = localStorage.getItem("lastDateAdmisi");

    if (storedDate !== todayForAdmisi) {
      localStorage.setItem("lastDateAdmisi", todayForAdmisi);
      localStorage.setItem("panggilAntrianAdmisi", "A-0000");
      setlastAntrianAdmisi("A-0000");
    } else if (storedAntrian) {
      setlastAntrianAdmisi(storedAntrian);
    }

    socket.on("panggilAntrianAdmisi", (data) => {
      setlastAntrianAdmisi(data.antrian);
      setMessageVoiceAdmisi(data.message);
      localStorage.setItem("panggilAntrianAdmisi", data.antrian);
    });

    return () => {
      socket.off("panggilAntrianAdmisi");
    };
  }, [todayForAdmisi]);

  useEffect(() => {
    const storedDate = localStorage.getItem("lastDatePasien");
    const storedAntrian = localStorage.getItem("panggilAntrianPasien");

    if (storedDate !== todayForPasien) {
      localStorage.setItem("lastDatePasien", todayForPasien);
      localStorage.setItem("panggilAntrianPasien", "P-0000");
      setlastAntrianPasien("P-0000");
    } else if (storedAntrian) {
      setlastAntrianPasien(storedAntrian);
    }

    socket.on("panggilAntrianPasien", (data) => {
      setlastAntrianPasien(data.antrian);
      setMessageVoicePasien(data.message);
      setPoli(data.poli);
      localStorage.setItem("panggilAntrianPasien", data.antrian);
    });

    return () => {
      socket.off("panggilAntrianPasien");
    };
  }, [todayForPasien]);

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
      // const audioPath = `/audio/pasien/${messageVoicePasien}.MP3`;  //FOR DEVELOPMENT
      const audioPath = `/audio/pasien/${messageVoicePasien}.mp3`; // FOR PRODUCTION
      const audio = new Audio(audioPath);
      const poliAudio = poli ? new Audio(poli) : null;
      if (poliAudio) {
        poliAudio.preload = "auto";
      }

      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });

      audio.onended = () => {
        if (poliAudio) {
          poliAudio.play().catch((err) => {
            console.error("Error playing audio poli:", err);
          });
        }
      };

      setMessageVoicePasien("");
      setPoli("");
    }
  }, [messageVoicePasien, poli]);

  return (
    <>
      {modalShow && <ModalOnboarding onClick={handleCloseModal} />}
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
    </>
  );
};

export default NomorAntrianPage;
