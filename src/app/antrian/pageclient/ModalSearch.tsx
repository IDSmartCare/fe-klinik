"use client";
import { ToastAlert2 } from "@/app/components/Toast2";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const ModalSearch = ({ asuransi }: { asuransi?: string }) => {
  const modal: any = document.getElementById("search-patient");
  const [activeOption, setActiveOption] = useState<string>("NoRM");
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();

  const handleToggle = (option: string) => {
    setActiveOption(option);
    reset();
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    const body = {
      rm: data?.noRM,
      nik: data?.nik,
    };

    try {
      setLoading(true);
      const postApi = await fetch(`/api/antrian/searchpasien`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await postApi.json();
      if (!result.success) {
        setLoading(false);
        modal.close();
        ToastAlert2({
          icon: "error",
          title: "Ooops",
          text: "Pasien tidak ditemukan",
        });
        return;
      }
      if (asuransi === "insurance") {
        route.push(`/antrian/detail/${result.data.id}/${asuransi}`);
      } else {
        route.push(`/antrian/detail/${result.data.id}`);
      }
    } catch (error: any) {
      setLoading(false);
      modal.close();
      console.log(error);
      ToastAlert2({
        icon: "error",
        title: "Ooops",
        text: error.message,
      });
    }
  };

  return (
    <dialog id="search-patient" className="modal">
      <div className="modal-box w-8/12 max-w-2xl">
        <div className="flex flex-col">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
          >
            <div className="flex bg-gray-200 rounded-md w-full py-3 px-3 gap-2">
              <button
                type="button"
                onClick={() => handleToggle("NoRM")}
                className={`py-2 w-full transition-all duration-500 rounded-md 
                ${
                  activeOption === "NoRM" ? "bg-primary shadow text-white" : ""
                }`}
              >
                Nomor Rekam Medis
              </button>
              <button
                type="button"
                onClick={() => handleToggle("NIK")}
                className={`py-2 px-3 w-full transition-all duration-500 rounded-md 
                ${
                  activeOption === "NIK" ? "bg-primary shadow text-white" : ""
                }`}
              >
                Nomor Induk Kependudukan
              </button>
            </div>

            {/* Conditionally render the input fields based on the active option */}
            {activeOption === "NoRM" && (
              <div className="form-control w-full mb-2">
                <div className="label">
                  <span className="label-text">Nomor Rekam Medis</span>
                </div>
                <input
                  type="number"
                  placeholder="Nomor Rekam Medis"
                  {...register("noRM", { required: "Tidak boleh kosong!" })}
                  className="input input-md input-bordered input-primary w-full"
                />
                <span className="label-text-alt text-error">
                  {errors.noRM && (
                    <span>{errors.noRM.message?.toString()}</span>
                  )}
                </span>
              </div>
            )}

            {activeOption === "NIK" && (
              <div className="form-control w-full mb-2">
                <div className="label">
                  <span className="label-text">Nomor Induk Kependudukan</span>
                </div>
                <input
                  type="number"
                  placeholder="Nomor Induk Kependudukan"
                  {...register("nik", { required: "Tidak boleh kosong!" })}
                  className="input input-md input-bordered input-primary w-full"
                />
                <span className="label-text-alt text-error">
                  {errors.nik && <span>{errors.nik.message?.toString()}</span>}
                </span>
              </div>
            )}
          </form>
          <div className="self-end flex gap-3 mt-3">
            {!loading && (
              <form method="dialog">
                <button className="btn btn-error btn-md rounded-xl text-white">
                  Keluar
                </button>
              </form>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-md rounded-xl"
              onClick={handleSubmit(onSubmit)}
              disabled={loading} // Disable button saat loading
            >
              {!loading ? "Submit" : "Tunggu"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ModalSearch;
