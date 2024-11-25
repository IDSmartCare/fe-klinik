"use client";
import React, { useState } from "react";
import CardComponent from "../components/CardComponent";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const Antrian = () => {
  const { data: session } = useSession();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [ticketVisible, setTicketVisible] = useState(false);

  const handleCardClick = (cardType: any) => {
    setSelectedCard(cardType);
    if (cardType === "new-registration") {
      setTicketVisible(true);
    }
  };

  const handleBackClick = () => {
    setSelectedCard(null); // Temporary only
    setTicketVisible(false);
  };

  const handleSearchClick = () => {
    console.log("Test Click");
  };

  const handleBatalClick = () => {
    setTicketVisible(false);
  };

  const animation = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 },
  };

  const ToastAlert2 = ({
    icon,
    title,
    text,
  }: {
    icon: "success" | "error" | "warning" | "info" | "question";
    title: string;
    text: string;
  }) => {
    Swal.fire({
      position: "center",
      icon,
      title,
      text,
    });
  };

  return (
    <div
      className="h-screen flex flex-col gap-14 2xl:gap-28 justify-center items-center relative overflow-hidden"
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

          <motion.div
            className="p-3 rounded-full bg-white cursor-pointer"
            onClick={handleSearchClick}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/search-icon.png"
              alt="Search button"
              width={50}
              height={50}
            />
          </motion.div>
        </div>
      )}
      <div className="flex text-center text-white">
        <div>
          <h1 className="font-bold text-4xl">
            {`Selamat Datang di Fasyankes ${session?.user.nameFasyankes}`}
          </h1>
          <h3 className="font-bold text-3xl mt-3">Anjungan Pasien Mandiri</h3>
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
                onClick={() =>
                  ToastAlert2({
                    icon: "error",
                    title: "Asuransi",
                    text: "Fitur Belum Tersedia",
                  })
                }
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
              <CardComponent src="/old-patient.png" title="Pasien Terdaftar" />
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
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 w-full flex justify-center"
          >
            <TicketComponent onBatalClick={handleBatalClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TicketComponent = ({ onBatalClick }: { onBatalClick: () => void }) => {
  return (
    <div className="relative flex flex-col items-center justify-center bottom-[-80px]">
      <Image src="/ticket.png" alt="ticket" height={400} width={400} />
      <div className="absolute top-24 flex flex-col gap-5 text-center">
        <span className="text-2xl font-bold">Antrian Registrasi</span>
        <span className="text-7xl font-bold">A-0001</span>
      </div>
      <div className="absolute top-96 flex flex-col gap-5">
        <span className="text-lg font-bold">Silahkan Menuju Administrasi</span>
        <button className="btn btn-sm btn-primary">Print Tiket</button>
        <button
          className="btn btn-sm btn-error text-white"
          onClick={onBatalClick}
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Antrian;
