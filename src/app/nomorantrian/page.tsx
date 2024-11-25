import { authOption } from "@/auth";
import { getServerSession } from "next-auth";
import React from "react";

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

const getData = async (idFasyankes: string) => {
  try {
    const getapi = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/antrian/admisi/${idFasyankes}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );
    if (!getapi.ok) {
      return [];
    }
    return getapi.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const NomorAntrian = async () => {
  const session = await getServerSession(authOption);

  return (
    <div
      className="h-screen flex flex-col gap-20 2xl:gap-28 items-center"
      style={{
        backgroundImage: "url('/background-APM.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="text-white mt-28">
        <h1 className="font-bold text-5xl">
          {`Klinik ${session?.user.nameFasyankes}`}
        </h1>
      </div>

      <div className="flex gap-8">
        <CardAntrian title="Pasien" nomor="A-0001" desc="Poli" />
        <CardAntrian title="Admisi" nomor="P-0001" desc="Administrasi" />
      </div>
    </div>
  );
};

export default NomorAntrian;
