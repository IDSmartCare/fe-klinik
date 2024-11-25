"use client";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { typeAddJawaban } from "../interface/typeAddJawaban";
import { Session } from "next-auth";

const FormInputJawaban = ({
  data,
  session,
  category,
}: {
  data: any;
  session: Session | null;
  category: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<typeAddJawaban>();

  const router = useRouter();

  const onSubmit: SubmitHandler<typeAddJawaban> = async (formData) => {
    const soapCategory = data.category?.toLowerCase();
    const endpoint = `${soapCategory}-answer`;

    const body = {
      questionId: Number(data.id),
      answer: formData.answer,
      createdBy: session?.user.role,
    };

    try {
      const response = await fetch("/api/mastersoap/inputjawaban", {
        method: "POST",
        body: JSON.stringify({ endpoint, body }),
        headers: {
          "content-type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        ToastAlert({ icon: "success", title: "Berhasil" });
        reset();
        router.refresh();
      } else {
        ToastAlert({
          icon: "error",
          title: result.message || "Gagal",
        });
      }
    } catch (error: any) {
      ToastAlert({
        icon: "error",
        title: error.message || "Kesalahan tidak diketahui",
      });
    }
  };

  return (
    <div className="p-3 px-5 bg-[#F2F2F2] rounded w-full">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full">
          <label className="label mt-3">
            <span className="label-text font-bold">Masukkan Keyword</span>
          </label>
          <input
            type="text"
            {...register("answer", { required: "*Tidak boleh kosong" })}
            placeholder="Pertanyaan"
            className={`input input-bordered w-full ${
              errors.answer ? "input-error" : ""
            }`}
          />
          {errors.answer && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.answer.message?.toString()}
              </span>
            </label>
          )}
        </div>
        <div className="mt-5 pb-3 flex justify-end">
          <button type="submit" className="btn btn-primary w-full md:w-52">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormInputJawaban;
