"use client";

import ButtonModalComponent, {
  icon,
} from "@/app/components/ButtonModalComponent";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { typeFormAsuransi } from "../interface/typeFormAsuransi";
import AlertHeaderComponent from "../../paramedis/components/AlertHeaderComponent";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";
import { Session } from "next-auth";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";

const ModalAddAsuransi = ({ session }: { session: Session | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<typeFormAsuransi>();

  const route = useRouter();

  const onSubmit: SubmitHandler<typeFormAsuransi> = async (data) => {
    const bodyToPost = {
      ...data,
      idFasyankes: session?.user.idFasyankes,
      isAktif: true,
    };

    try {
      const postApi = await fetch(`/api/masterasuransi/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToPost),
      });

      const data = await postApi.json();

      if (!postApi.ok) {
        ToastAlert({ icon: "error", title: data.message });
        return;
      }

      ToastAlert({ icon: "success", title: "Berhasil Menambahkan Asuransi" });
      reset();
      const modal: any = document?.getElementById("add-asuransi");
      modal.close();
      route.refresh();
    } catch (error: any) {
      console.log(error);
      ToastAlert({ icon: "error", title: error.message });
    }
  };

  return (
    <div className="self-end">
      <ButtonModalComponent
        icon={icon.add}
        modalname="add-asuransi"
        title="Tambah Asuransi"
      />
      <dialog id="add-asuransi" className="modal">
        <div className="modal-box lg:w-4/12 max-w-lg">
          <AlertHeaderComponent message="Tambah Asuransi" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
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
                className="input input-sm input-primary w-full"
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
                {...register("namaPic", {
                  required: "*Tidak boleh kosong",
                })}
                className="input input-sm input-primary w-full "
              />
              {errors.namaPic && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.namaPic.message}
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
                {...register("picEmail", {
                  required: "*Tidak boleh kosong",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "*Format email tidak valid",
                  },
                })}
                className="input input-sm input-primary w-full "
              />
              {errors.picEmail && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.picEmail.message}
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
                {...register("picPhone", {
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
              {errors.picPhone && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.picPhone.message}
                  </span>
                </label>
              )}
            </div>

            <div className="mt-3 flex gap-5 items-center w-full mb-5">
              <div className="w-full">
                <label htmlFor="from" className="label">
                  <span className="label-text">Tanggal Mulai Kerjasama</span>
                </label>
                <input
                  id="from"
                  type="date"
                  {...register("from", { required: "Tidak boleh kosong!" })}
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                />
              </div>

              <span className="label-text-alt mt-9">s/d</span>

              <div className="w-full">
                <label htmlFor="to" className="label">
                  <span className="label-text">Tanggal Selesai Kerjasama</span>
                </label>
                <input
                  id="to"
                  type="date"
                  {...register("to", {
                    required: "Tidak boleh kosong!",
                  })}
                  className="input input-sm input-bordered input-primary w-full max-w-xs"
                />
              </div>
            </div>

            {session?.user.role !== "tester" && <SubmitButtonServer />}
          </form>
          <form method="dialog" className="mt-2">
            <button className="btn btn-sm w-full btn-error text-white">
              Batal
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddAsuransi;
