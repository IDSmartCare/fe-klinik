"use client";

import ButtonModalComponent, {
  icon,
} from "@/app/components/ButtonModalComponent";
import { useId, useState, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { Session } from "next-auth";
import { AddMasterTarif } from "../interface/typeFormAddTarif";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import { formatRupiahEdit } from "@/app/helper/formatRupiah";

const ModalAddMasterTarif = ({ session }: { session: Session | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
  } = useForm<AddMasterTarif>();
  const uuid = useId();
  const route = useRouter();
  const [rawHargaTarif, setRawHargaTarif] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);

  const onSubmit: SubmitHandler<AddMasterTarif> = async (data) => {
    if (data) {
      const body = {
        namaTarif: data.namaTarif,
        kategoriTarif: data.kategoriTarif.value,
        hargaTarif: rawHargaTarif,
        penjamin: data.penjamin.value,
        idFasyankes: session?.user.idFasyankes,
      };

      try {
        const posttoApi = await fetch("/api/mastertarif", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (posttoApi.ok) {
          ToastAlert({ icon: "success", title: "Berhasil Menambahkan Tarif" });
          reset();
          route.refresh();
          if (modalRef.current) {
            modalRef.current.close();
          }
        } else {
          const errorResponse = await posttoApi.json();
          // Handle errors from API response
          ToastAlert({
            icon: "error",
            title: errorResponse.message || "Gagal Menambahkan Tarif",
          });

          // Set API errors on specific fields
          if (errorResponse.errors) {
            Object.keys(errorResponse.errors).forEach((field) => {
              setError(field as keyof AddMasterTarif, {
                type: "api",
                message: errorResponse.errors[field],
              });
            });
          }
        }
      } catch (error: any) {
        // Handle fetch or unexpected errors
        ToastAlert({
          icon: "error",
          title: error.message || "Terjadi Kesalahan",
        });
        console.error(error);
      }
    } else {
      ToastAlert({ icon: "error", title: "Data tidak valid" });
    }
  };

  const handleHargaTarifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Get raw numeric value
    setRawHargaTarif(numericValue); // Update state with the raw value
    e.target.value = formatRupiahEdit(numericValue); // Display formatted value
  };

  return (
    <div className="self-end">
      <ButtonModalComponent
        icon={icon.add}
        modalname="add-master-tarif"
        title="Tambah Master Tarif"
      />
      <dialog id="add-master-tarif" className="modal" ref={modalRef}>
        <div className="modal-box w-8/12 max-w-3xl h-screen">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Tambah Master Tarif</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
          >
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Nama Tarif</span>
              </div>
              <input
                type="text"
                {...register("namaTarif", {
                  required: "*Tidak boleh kosong",
                })}
                className="input input-primary w-full input-sm"
              />
              {errors.namaTarif && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.namaTarif.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Kategori Tarif</span>
              </div>
              <Controller
                name="kategoriTarif"
                control={control}
                rules={{
                  required: "*Tidak boleh kosong",
                }}
                render={({ field }) => (
                  <div className="form-control w-full">
                    <Select
                      {...field}
                      isClearable
                      placeholder="Pilih Kategori"
                      instanceId={uuid}
                      options={[
                        { value: "Admin", label: "Admin" },
                        { value: "Dokter", label: "Dokter" },
                      ]}
                    />
                    {errors.kategoriTarif && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.kategoriTarif.message}
                        </span>
                      </label>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Nominal</span>
              </div>
              <input
                type="text"
                {...register("hargaTarif", {
                  required: "*Tidak boleh kosong",
                })}
                onChange={handleHargaTarifChange}
                className="input input-sm input-primary w-full"
                value={rawHargaTarif ? formatRupiahEdit(rawHargaTarif) : ""} // Display formatted value
              />

              {errors.hargaTarif && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.hargaTarif.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Penjamin</span>
              </div>
              <Controller
                name="penjamin"
                control={control}
                rules={{
                  required: "*Tidak boleh kosong",
                }}
                render={({ field }) => (
                  <div className="form-control w-full">
                    <Select
                      {...field}
                      isClearable
                      placeholder="Pilih Penjamin"
                      instanceId={uuid}
                      options={[
                        { value: "BPJS", label: "BPJS" },
                        { value: "PRIBADI", label: "PRIBADI" },
                        { value: "ASURANSI", label: "ASURANSI" },
                      ]}
                    />
                    {errors.penjamin && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.penjamin.message}
                        </span>
                      </label>
                    )}
                  </div>
                )}
              />
            </div>

            {session?.user.role !== "tester" && (
              <button className="btn btn-primary btn-block btn-sm mt-3">
                Simpan
              </button>
            )}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddMasterTarif;
