"use client";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { typeFormJadwal } from "../interface/typeFormJadwal";
import { typeFormDokter } from "../interface/typeFormDokter";
import { Session } from "next-auth";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";

const ButtonDetailJadwal = ({
  session,
  dataJadwal,
}: {
  dataJadwal: any;
  session: Session | null;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<typeFormJadwal>();

  const route = useRouter();
  const [timeList, setTimeList] = useState<
    { id: number; jamDari: string; jamSampai: string }[]
  >([{ id: 1, jamDari: "", jamSampai: "" }]);

  const [nextId, setNextId] = useState(2);

  const handleAddTime = () => {
    setTimeList((prev) => [
      ...prev,
      { id: nextId, jamDari: "", jamSampai: "" },
    ]);
    setNextId((prev) => prev + 1);
  };

  const handleDeleteTime = (idToDelete: number) => {
    if (timeList.length > 1) {
      setTimeList((prev) => prev.filter((item) => item.id !== idToDelete));
    }
  };

  const handleTimeChange = (
    id: number,
    field: "jamDari" | "jamSampai",
    value: string
  ) => {
    setTimeList((prev) =>
      prev.map((time) => (time.id === id ? { ...time, [field]: value } : time))
    );
  };

  const onSubmit: SubmitHandler<typeFormJadwal> = async (data) => {
    const bodyToPos = {
      dokter_id: dataJadwal.id,
      slot: Number(data.slot?.value),
      days: data.hari.map((day: { value: string }) => day.value),
      times: timeList.map((time) => ({
        from: time.jamDari,
        to: time.jamSampai,
      })),
    };

    try {
      const postApi = await fetch("/api/dokter/jadwaldokter/postjadwal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToPos),
      });

      if (!postApi.ok) {
        const resMessage = await postApi.json();
        ToastAlert({ icon: "error", title: resMessage.message });
        return;
      }

      ToastAlert({ icon: "success", title: "Berhasil!" });
      reset();
      const modal: any = document?.getElementById("add-jadwal");
      modal.close();
      setTimeList([{ id: 1, jamDari: "", jamSampai: "" }]);
      setNextId(2);
      route.refresh();
    } catch (error: any) {
      console.log(error);
      ToastAlert({ icon: "error", title: error.message });
    }
  };
  return (
    <>
      <div className="mb-[-50px] z-[999] flex gap-3">
        <Link
          href={"/klinik/setting/paramedis/jadwaldokter"}
          className=" w-max"
        >
          <button className="btn btn-sm btn-primary text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z"
                clipRule="evenodd"
              />
            </svg>
            Kembali
          </button>
        </Link>
        <button
          className="btn btn-success btn-sm text-white"
          onClick={() => {
            const modal: any = document.getElementById("add-jadwal");
            modal.showModal();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z"
              clipRule="evenodd"
            />
          </svg>
          Tambah Jadwal
        </button>
      </div>
      <dialog id="add-jadwal" className="modal">
        <div className="modal-box w-4/12 max-w-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Tambah Jadwal Dokter</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
          >
            <Controller
              name="hari"
              control={control}
              rules={{ required: "Tidak boleh kosong!" }}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  isClearable
                  placeholder="Pilih Hari"
                  options={[
                    { label: "Senin", value: "Senin" },
                    { label: "Selasa", value: "Selasa" },
                    { label: "Rabu", value: "Rabu" },
                    { label: "Kamis", value: "Kamis" },
                    { label: "Jumat", value: "Jumat" },
                    { label: "Sabtu", value: "Sabtu" },
                    { label: "Minggu", value: "Minggu" },
                  ]}
                />
              )}
            />
            <span className="label-text-alt opacity-50 mt-[-5px]">
              Anda dapat memilih lebih dari satu hari sesuai kebutuhan
            </span>

            <span className="label-text-alt text-error">
              {errors.hari && <span>{errors.hari.message?.toString()}</span>}
            </span>

            <div className="relative">
              <Controller
                name="slot"
                control={control}
                rules={{ required: "Tidak boleh kosong!" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable
                    placeholder="Pilih Sesi"
                    options={[
                      {
                        label: "60 Menit",
                        value: 60,
                      },
                      {
                        label: "90 Menit",
                        value: 90,
                      },
                    ]}
                  />
                )}
              />
            </div>
            <span className="label-text-alt text-error">
              {errors.slot && <span>{errors.slot?.message?.toString()}</span>}
            </span>

            {/* Time input fields */}
            {timeList.map((item) => (
              <div key={item.id} className="flex gap-2 items-center mb-2">
                <input
                  type="time"
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                  value={item.jamDari}
                  onChange={(e) =>
                    handleTimeChange(item.id, "jamDari", e.target.value)
                  }
                />
                <span className="label-text-alt">s/d</span>
                <input
                  type="time"
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                  value={item.jamSampai}
                  onChange={(e) =>
                    handleTimeChange(item.id, "jamSampai", e.target.value)
                  }
                />
                {timeList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTime(item.id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24" // Tambahkan width
                      height="24" // Tambahkan height
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636"
                          stroke="#ffffff"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {/* Add time button */}
            <button
              type="button"
              onClick={handleAddTime}
              className="btn btn-sm btn-success text-white"
            >
              Tambah Waktu
            </button>

            {session?.user.role !== "tester" && <SubmitButtonServer />}
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ButtonDetailJadwal;
