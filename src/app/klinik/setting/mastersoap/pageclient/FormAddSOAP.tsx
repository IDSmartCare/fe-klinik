"use client";
import { useRouter } from "next/router";
import React, { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const FormAddSOAP = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const uuid = useId();
  //   const route = useRouter();

  return (
    <div className="p-3 px-5 bg-[#F2F2F2] rounded w-full">
      <form className="w-full">
        <div className="form-control w-full">
          <div className="flex gap-9 items-center">
            <div className="w-full">
              <label className="label">
                <span className="label-text font-bold">Kategori SOAP</span>
              </label>
              <Controller
                name="kodeHari"
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
                    options={[]}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <label className="label">
                <span className="label-text font-bold">Tipe Pertanyaan</span>
              </label>
              <Controller
                name="kodeHari"
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
                    options={[]}
                  />
                )}
              />
            </div>
          </div>
          <label className="label mt-3">
            <span className="label-text font-bold">Masukkan Pertanyaan</span>
          </label>
          <input
            type="text"
            {...register("kode", { required: true })}
            placeholder="Pertanyaan"
            className="input input-bordered w-full"
          />
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
