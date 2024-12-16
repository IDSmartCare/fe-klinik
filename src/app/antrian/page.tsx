"use client";
import React, { useEffect, useState } from "react";
import CardComponent from "../components/CardComponent";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastAlert2 } from "../components/Toast2";
import { TicketComponent } from "./pageclient/TicketComponent";
import { getFormattedDate, getFormattedDateTime } from "../helper/ConvertDate";
import { TimeAPM } from "../helper/TimeAPM";
import dynamic from "next/dynamic";

const ModalSearch = dynamic(() => import("./pageclient/ModalSearch"), {
  ssr: false,
});

const ModalPrintAdmisi = dynamic(
  () => import("./pageclient/ModalAntrianAdmisi"),
  { ssr: false }
);

const AntrianPage = () => {
  const { data: session } = useSession();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [ticketVisible, setTicketVisible] = useState<boolean>(false);
  const [dataTicket, setDataTicket] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<string>(TimeAPM());
  const [asuransiPage, setAsuransiPage] = useState<string>("");
  const [jam, setJam] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>("");

  const handleCardClick = (cardType: any) => {
    setSelectedCard(cardType);
    if (cardType === "new-registration") {
      handlePostTicket(session?.user.idFasyankes);
      setTicketVisible(true);
    } else if (cardType === "insurance") {
      setSelectedCard(null);
      setAsuransiPage("insurance");
      showModal("search-patient");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(TimeAPM());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handlePostTicket = async (idFasyankes: string) => {
    const bodyToPost = {
      idFasyankes: idFasyankes,
    };
    try {
      const postApi = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/antrian/store-admisi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
          body: JSON.stringify(bodyToPost),
        }
      );
      if (!postApi.ok) {
        return;
      }
      const data = await postApi.json();
      setDataTicket(data.data.nomor);
      return data;
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleBackClick = () => {
    setSelectedCard(null); // Temporary only
    setTicketVisible(false);
  };

  const handleBatalClick = () => {
    setTicketVisible(false);
    setTimeout(() => {
      setSelectedCard(null);
    }, 1500);
  };

  const showModal = (idModal: string) => {
    const modal: any = document.getElementById(idModal);
    modal.showModal();
  };

  const showModalAntrianAdmisi = (idModal: string) => {
    const modal: any = document.getElementById(idModal);
    modal.showModal();
    setJam(getFormattedDateTime().jam);
    setTanggal(getFormattedDateTime().tanggal);
  };

  const animation = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      <ModalPrintAdmisi
        nomorAntrian={dataTicket}
        tanggalDaftar={tanggal}
        jamDaftar={jam}
      />
      <ModalSearch asuransi={asuransiPage} />
      <div
        className="h-screen flex flex-col gap-9 2xl:gap-24 justify-center items-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/background-APM.png')",
          backgroundSize: "cover",
        }}
      >
        {selectedCard !== null && (
          <div className="w-full flex justify-between px-20 absolute top-14">
            <motion.div
              className="p-3 rounded-full bg-white cursor-pointer"
              onClick={handleBackClick}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/back-icon.png"
                alt="Back button"
                width={50}
                height={50}
              />
            </motion.div>
          </div>
        )}
        <div className="flex text-center text-white">
          <div className="flex flex-col">
            <h1 className="font-bold text-5xl">{`Selamat Datang di Fasyankes ${session?.user.nameFasyankes}`}</h1>
            <h3 className="font-bold text-4xl mt-3">Anjungan Pasien Mandiri</h3>
            <div className="flex flex-col mt-10">
              <span className="font-bold text-4xl text-white">
                {getFormattedDate()}
              </span>
              <span className="font-bold text-3xl text-white opacity-80 mt-2">
                {currentTime}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-20">
          <AnimatePresence mode="wait">
            {/* Use mode="wait" to handle overlapping animations */}
            {selectedCard === null && (
              <motion.div
                key="initial-cards"
                {...animation}
                className="flex gap-20"
              >
                <CardComponent
                  src="/new-patient.png"
                  title="Registrasi Pasien"
                  onClick={() => handleCardClick("new-patient")}
                />
                <CardComponent
                  src="/bpjs.png"
                  title="BPJS"
                  onClick={() =>
                    ToastAlert2({
                      icon: "error",
                      title: "BPJS",
                      text: "Fitur Belum Tersedia",
                    })
                  }
                />
                <CardComponent
                  src="/asuransi.png"
                  title="Asuransi"
                  onClick={() => handleCardClick("insurance")}
                />
              </motion.div>
            )}
            {selectedCard === "new-patient" ||
            selectedCard === "new-registration" ? (
              <motion.div
                key="new-patient"
                {...animation}
                className="flex gap-20"
              >
                <CardComponent
                  src="/old-patient.png"
                  title="Pasien Terdaftar"
                  onClick={() => showModal("search-patient")}
                />
                <CardComponent
                  src="/new-patient.png"
                  title="Daftar Baru"
                  onClick={() => handleCardClick("new-registration")}
                />
              </motion.div>
            ) : null}
            {selectedCard === "bpjs" && (
              <motion.div key="bpjs" {...animation}></motion.div>
            )}
            {selectedCard === "asuransi" && (
              <motion.div key="asuransi" {...animation}></motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex text-center text-white">
          <div className="flex flex-col gap-3">
            <h1 className="text-lg">Didukung oleh</h1>
            <Image
              src="/idSmartCloud-logo.png"
              alt="logo"
              width={200}
              height={200}
            />
          </div>
        </div>
        <AnimatePresence>
          {ticketVisible && (
            <motion.div
              key="ticket-component"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute bottom-0 w-full flex justify-center"
            >
              <TicketComponent
                onBatalClick={handleBatalClick}
                nomor={dataTicket}
                title="Administrasi"
                administrasi="Administrasi"
                onPrintTicket={() => {
                  showModalAntrianAdmisi("modal-antrian-admisi");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AntrianPage;
