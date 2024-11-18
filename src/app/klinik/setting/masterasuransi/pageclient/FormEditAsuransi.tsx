"use client";
import React, { useId, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Select from "react-select";
import { typeFormAsuransi } from "../interface/typeFormAsuransi";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import AlertHeaderComponent from "../../paramedis/components/AlertHeaderComponent";
import Link from "next/link";

const FormEditAsuransi = ({
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
    control,
  } = useForm<typeFormAsuransi>();

  const uuid = useId();
  const route = useRouter();

  const onSubmit: SubmitHandler<typeFormAsuransi> = async (data) => {
    try {
      const response = await fetch(`/api/jadwal/edit`, {
        method: "PUT",
        // body: JSON.stringify(bodyToPos),
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

      const resData = await response.json();
      ToastAlert({
        icon: "success",
        title: resData.message,
      });
      route.push("/klinik/setting/paramedis/jadwaldokter");
      route.refresh();
    } catch (error) {
      console.log(error);

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
      <AlertHeaderComponent message="Edit Asuransi" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mt-4 w-full md:w-5/12 "
      >
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Nama Asuransi</span>
          </div>
          <input
            type="text"
            {...register("namaAsuransi", {
              required: "*Tidak boleh kosong",
            })}
            className="input input-sm input-primary w-full "
          />
          {errors.namaAsuransi && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.namaAsuransi.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Alamat</span>
          </div>
          <input
            type="text"
            {...register("alamat", {
              required: "*Tidak boleh kosong",
            })}
            className="input input-sm input-primary w-full "
          />
          {errors.alamat && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.alamat.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Nama PIC</span>
          </div>
          <input
            type="text"
            {...register("namaPIC", {
              required: "*Tidak boleh kosong",
            })}
            className="input input-sm input-primary w-full "
          />
          {errors.namaPIC && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.namaPIC.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Email PIC</span>
          </div>
          <input
            type="email"
            {...register("emailPIC", {
              required: "*Tidak boleh kosong",
            })}
            className="input input-sm input-primary w-full "
          />
          {errors.emailPIC && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.emailPIC.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Nomor Telepon PIC</span>
          </div>
          <input
            type="number"
            {...register("noPIC", {
              required: "*Tidak boleh kosong",
              minLength: {
                value: 10,
                message: "Minimal 10 angka",
              },
              maxLength: {
                value: 16,
                message: "Maksimal 16 angka",
              },
            })}
            className="input input-sm input-primary w-full "
          />
          {errors.noPIC && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.noPIC.message}
              </span>
            </label>
          )}
        </div>

        <div className="mt-3 flex gap-5 items-center w-full mb-5">
          <div className="w-full">
            <label htmlFor="tglDari" className="label">
              <span className="label-text">Tanggal Mulai Kerjasama</span>
            </label>
            <input
              id="tglDari"
              type="date"
              {...register("tglDari", { required: "Tidak boleh kosong!" })}
              className="input input-sm input-bordered input-primary w-full max-w-xs"
            />
          </div>

          <span className="label-text-alt mt-9">s/d</span>

          <div className="w-full">
            <label htmlFor="tglSampai" className="label">
              <span className="label-text">Tanggal Selesai Kerjasama</span>
            </label>
            <input
              id="tglSampai"
              type="date"
              {...register("tglSampai", {
                required: "Tidak boleh kosong!",
              })}
              className="input input-sm input-bordered input-primary w-full max-w-xs"
            />
          </div>
        </div>
        {session?.user.role != "tester" && (
          <button type="submit" className="btn btn-primary btn-sm">
            Submit
          </button>
        )}
        <Link
          href="/klinik/setting/masterasuransi"
          className="btn btn-sm w-full btn-error text-white"
        >
          Batal
        </Link>
      </form>
    </div>
  );
};

export default FormEditAsuransi;
