"use client";
import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { Session } from "next-auth";
import AlertHeaderComponent from "../../paramedis/components/AlertHeaderComponent";
import Link from "next/link";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";
import { useRouter } from "next/navigation";

const FormEditVoice = ({
  data,
  session,
}: {
  data: any;
  session: Session | null;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();
  const router = useRouter();

  const onSubmit: SubmitHandler<any> = async (formData) => {
    try {
      const form = new FormData();
      form.append("id", data.id);
      form.append("idFasyankes", session?.user.idFasyankes || "");
      form.append("namaPoli", formData.namaPoli);
      form.append("namaFasyankes", session?.user.nameFasyankes || "");

      if (formData.voiceFile && formData.voiceFile[0]) {
        form.append("file", formData.voiceFile[0]);
      }

      const response = await fetch(`/api/mastervoice/edit`, {
        method: "PATCH",
        body: form,
      });

      if (!response.ok) {
        const resMessage = await response.text();
        ToastAlert({
          icon: "error",
          title: resMessage,
        });
        return;
      }

      const resData = await response.json();
      ToastAlert({
        icon: "success",
        title: "Berhasil",
      });
      setTimeout(() => {
        router.back();
      }, 2000);
      setTimeout(() => {
        window.location.reload();
      }, 2100);
    } catch (error) {
      console.error(error);
      ToastAlert({
        icon: "error",
        title:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <AlertHeaderComponent message="Edit Voice" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mt-10 w-full md:w-4/12 border-gray-300 border-2 rounded-lg p-5  md:p-8"
      >
        <input
          type="text"
          placeholder="Nama Poliklinik"
          defaultValue={data?.namaPoli}
          {...register("namaPoli", { required: "Tidak boleh kosong!" })}
          className="input input-md input-bordered input-primary w-full"
        />
        <span className="label-text-alt text-error">
          {errors.namaPoli && (
            <span>{errors.namaPoli.message?.toString()}</span>
          )}
        </span>
        <div className="input input-md input-bordered input-primary w-full flex items-center overflow-hidden">
          <input
            type="file"
            accept=".mp3,.wav"
            {...register("voiceFile", { required: "Tidak boleh kosong!" })}
          />
        </div>

        <span className="label-text-alt text-error">
          {errors.voiceFile && (
            <span>{errors.voiceFile?.message?.toString()}</span>
          )}
        </span>

        <Link
          href="https://micmonster.com/"
          target="_blank"
          className="text-primary text-sm mb-2 "
        >
          *Klik disini untuk membuat voice
        </Link>

        {session?.user.role !== "tester" && <SubmitButtonServer />}
        <button
          type="button"
          className="btn btn-sm btn-error text-white"
          onClick={() => router.back()}
        >
          Kembali
        </button>
      </form>
    </div>
  );
};

export default FormEditVoice;
