"use client";
import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import Link from "next/link";
import AlertHeaderComponent from "../../paramedis/components/AlertHeaderComponent";

const FormEditAnswer = ({
  data,
  session,
  alertTitle,
  title,
  endPoint,
}: {
  data: any;
  title: string;
  session: Session | null;
  alertTitle: string;
  endPoint: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const route = useRouter();

  const onSubmit: SubmitHandler<any> = async (formData) => {
    const body = {
      id: data.id,
      data: {
        answer: formData.answer,
      },
      endpoint: endPoint,
    };

    try {
      const response = await fetch(`/api/mastersoap/editjawaban`, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const resMessage = await response.text();
        ToastAlert({
          icon: "error",
          title: resMessage,
        });
        return;
      }
      ToastAlert({
        icon: "success",
        title: "Berhasil, Silahkan Refresh Halaman!",
      });
    } catch (error) {
      ToastAlert({
        icon: "error",
        title: error instanceof Error ? error.message : "Gagal",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <AlertHeaderComponent message={alertTitle} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mt-10 w-full md:w-4/12 border-gray-300 border-2 rounded-lg p-5  md:p-8"
      >
        <div className="form-control w-full mb-6">
          <div className="label">
            <span className="label-text">{title}</span>
          </div>
          <input
            type="text"
            {...register("answer", {
              required: "*Tidak boleh kosong",
            })}
            defaultValue={data?.answer || "Tidak ada"}
            className="input input-sm input-primary w-full"
          />
        </div>

        {session?.user.role != "tester" && (
          <button type="submit" className="btn btn-primary btn-sm">
            Submit
          </button>
        )}

        <button
          type="button"
          onClick={() => route.back()}
          className="btn btn-sm w-full btn-error text-white"
        >
          Kembali
        </button>
      </form>
    </div>
  );
};

export default FormEditAnswer;
