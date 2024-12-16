"use client";
import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useId, useState } from "react";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { typeFormRegis } from "@/app/klinik/pasien/interface/typeFormRegistrasi";
import { TicketComponent } from "./TicketComponent";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { getFormattedDateTime } from "@/app/helper/ConvertDate";

const ModalPrintPasien = dynamic(() => import("./ModalAntrianPasien"), {
  ssr: false,
});
const FormRegistrasiAPM = ({
  idpasien,
  session,
  asuransi,
}: {
  idpasien: string;
  session: Session | null;
  asuransi?: string;
}) => {
  const [ticketVisible, setTicketVisible] = useState(false);
  const [dataTicket, setDataTicket] = useState<any>(null);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    register,
  } = useForm<any>();

  const uuid = useId();
  const [dokter, setDokter] = useState<{ label: string; value: string }[]>([]);
  const [listAsuransi, setListAsuransi] = useState([]);
  const route = useRouter();
  const hari = new Date().getDay();
  const [jam, setJam] = useState<string>("");
  const [tanggal, setTanggal] = useState<string>("");
  const [poli, setPoli] = useState<string>("");
  const [nomorAsuransi, setNomorAsuransi] = useState("");

  useEffect(() => {
    const getAsuransi = async () => {
      const resAsuransi = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/masterasuransi/${session?.user.idFasyankes}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );

      if (!resAsuransi.ok) {
        setListAsuransi([]);
        return;
      }

      const dataAsuransi = await resAsuransi.json();
      if (!dataAsuransi.success || !dataAsuransi.data) {
        setListAsuransi([]);
        return;
      }

      const formattedAsuransi = dataAsuransi.data.map((item: any) => ({
        value: item.kodeAsuransi,
        label: item.namaAsuransi,
      }));

      setListAsuransi(formattedAsuransi);
    };
    getAsuransi();
  }, [session?.user.idFasyankes]);

  useEffect(() => {
    const getDokter = async () => {
      const hari = new Date().getDay();
      const resDokter = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/dokter/jadwaldokter/${hari}/${session?.user.idFasyankes}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );

      if (!resDokter.ok) {
        setDokter([]);
        return;
      }

      const dataDokter = await resDokter.json();
      if (!dataDokter.success || !dataDokter.data) {
        setDokter([]);
        return;
      }

      // Sesuaikan format data dokter
      const newArr = dataDokter.data?.flatMap((item: any) => {
        return item.jam_praktek.map((jam: any) => ({
          value: item.id,
          label: `${item.name} -  ${item.unit} (${jam.from} - ${jam.to})`,
          idHari: item.hari.id,
          idJamPraktek: jam.id,
        }));
      });

      setDokter([...newArr]);
    };

    getDokter();
  }, [session?.user.idFasyankes]);

  const onSubmit: SubmitHandler<typeFormRegis> = async (data) => {
    const bodyPost = {
      pasienData: {
        pasienId: Number(idpasien),
        doctorId: Number(data.dokterId.value),
        penjamin: asuransi ? "ASURANSI" : "PRIBADI",
        namaAsuransi: data.namaAsuransi?.label,
        nomorAsuransi: data.nomorAsuransi,
        idFasyankes: session?.user.idFasyankes,
        availableDayId: data.dokterId.idHari,
        availableTimeId: data.dokterId.idJamPraktek,
        hari: hari,
      },
      userRole: session?.user.role,
      userPackage: session?.user.package,
    };

    try {
      const postApi = await fetch(`/api/pasien/addregistrasi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPost),
      });

      // Handle server-side validation error
      if (!postApi.ok) {
        const errorResponse = await postApi.json();
        if (errorResponse.message) {
          ToastAlert({ icon: "error", title: errorResponse.message });
        } else {
          ToastAlert({ icon: "error", title: "Gagal simpan data!" });
        }
        return;
      }

      const data = await postApi.json();
      setDataTicket(data.nomorAntrian);
      setTanggal(getFormattedDateTime().tanggal);
      setJam(getFormattedDateTime().jam);
      setPoli(data.registrasi.doctor.unit);
      ToastAlert({ icon: "success", title: "Berhasil!" });
      reset();
      setTicketVisible(true);
    } catch (error) {
      console.log(error);
      ToastAlert({ icon: "error", title: "Gagal!" });
    }
  };

  const handleBatalClick = () => {
    setTicketVisible(false);
    setTimeout(() => {
      route.push("/antrian");
    }, 2000);
  };

  return (
    <>
      <ModalPrintPasien
        nomorAntrian={dataTicket}
        tanggalDaftar={tanggal}
        jamDaftar={jam}
        poli={poli}
      />
      <div className="overflow-hidden">
        <AnimatePresence>
          {ticketVisible && (
            <motion.div
              key="ticket-component"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute bottom-0 w-full flex justify-center z-[999]"
            >
              <TicketComponent
                onBatalClick={handleBatalClick}
                nomor={dataTicket}
                poli={poli}
                title="Pasien"
                onPrintTicket={() => {
                  const modal: any = document?.getElementById(
                    "modal-antrian-pasien"
                  );
                  modal?.showModal();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Dokter Yang Tersedia Hari Ini</span>
          </div>
          <Controller
            name="dokterId"
            control={control}
            rules={{
              required: "*Silahkan pilih",
            }}
            render={({ field }) => (
              <Select
                {...field}
                isClearable
                instanceId={uuid}
                options={dokter}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption);
                }}
              />
            )}
          />
          {errors.dokterId && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.dokterId.message?.toString()}
              </span>
            </label>
          )}
        </div>
        {asuransi && (
          <div className="mt-1">
            <div className="label">
              <span className="label-text">Asuransi</span>
            </div>
            <Controller
              name="namaAsuransi"
              control={control}
              rules={{
                required: "*Silahkan pilih",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  instanceId={uuid}
                  options={listAsuransi}
                />
              )}
            />
            {errors.namaAsuransi && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.namaAsuransi.message?.toString()}
                </span>
              </label>
            )}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Nomor Asuransi</span>
              </div>
              <input
                {...register("nomorAsuransi", {
                  required: "*Tidak boleh kosong",
                })}
                type="number"
                value={nomorAsuransi}
                onChange={(e) => setNomorAsuransi(e.target.value)}
                className="input input-primary w-full input-sm"
              />
            </div>
            {errors.nomorAsuransi && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.nomorAsuransi.message?.toString()}
                </span>
              </label>
            )}
          </div>
        )}

        {session?.user.role !== "tester" && (
          <div className="mt-3">
            <SubmitButtonServer />
          </div>
        )}
      </form>
    </>
  );
};

export default FormRegistrasiAPM;
