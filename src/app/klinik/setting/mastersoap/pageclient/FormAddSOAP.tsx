"use client";

import React, { useId } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { typeFormSOAP } from "../interface/typeFormSOAP";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

const FormAddSOAP = ({ session }: { session: Session | null }) => {
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<typeFormSOAP>();
  const uuid = useId();

  const onSubmit: SubmitHandler<typeFormSOAP> = async (data) => {
    const soapCategory = data.category?.value.toLowerCase();
    const endpoint = `master-${soapCategory}`;

    const body = {
      category: data.category?.value,
      questionType: data.questionType.value,
      question: data.question,
      idFasyankes: session?.user.idFasyankes,
      createdBy: session?.user.role,
    };

    const post = await fetch(`/api/mastersoap/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: body, endpoint }),
    });

    if (post.ok) {
      ToastAlert({ icon: "success", title: "Berhasil" });
      route.refresh();
      reset();
    } else {
      ToastAlert({ icon: "error", title: "Gagal" });
    }
  };

  return (
    <div className="p-3 px-5 bg-[#F2F2F2] rounded w-full">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full">
          <div className="flex gap-9 items-center">
            <div className="w-full flex gap-9">
              <div className="w-full">
                <label className="label">
                  <span className="label-text font-bold">Kategori SOAP</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{
                    required: "Tidak boleh kosong!",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      instanceId={uuid}
                      placeholder="SOAP"
                      options={[
                        { label: "Subjective", value: "Subjective" },
                        { label: "Objective", value: "Objective" },
                        { label: "Assessment", value: "Assessment" },
                        { label: "Plan", value: "Plan" },
                        { label: "Instruction", value: "Instruction" },
                      ]}
                    />
                  )}
                />
                {errors.category && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.category.message?.toString()}
                    </span>
                  </label>
                )}
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text font-bold">Tipe Pertanyaan</span>
                </label>
                <Controller
                  name="questionType"
                  control={control}
                  rules={{
                    required: "Tidak boleh kosong!",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      instanceId={uuid}
                      placeholder="Pertanyaan"
                      options={[
                        { label: "Text", value: "text" },
                        { label: "Number", value: "number" },
                        { label: "Date", value: "date" },
                      ]}
                    />
                  )}
                />
                {errors.questionType && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.questionType.message?.toString()}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
          <label className="label mt-3">
            <span className="label-text font-bold">Masukkan Pertanyaan</span>
          </label>
          <input
            type="text"
            {...register("question", {
              required: "*Tidak boleh kosong",
            })}
            placeholder="Pertanyaan"
            className="input input-bordered w-full"
          />
          {errors.question && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.question.message}
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

export default FormAddSOAP;
