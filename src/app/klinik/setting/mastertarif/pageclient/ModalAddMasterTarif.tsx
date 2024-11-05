"use client";

import ButtonModalComponent, {
  icon,
} from "@/app/components/ButtonModalComponent";
import { useId, useState, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { Session } from "next-auth";
import { AddMasterTarif } from "../interface/typeFormAddTarif";
// import { createTarif } from "./simpanMasterTarif";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import { postApiMasterTarif } from "../../../../api/mastertarif/apiMasterTarif";
import { formatRupiahEdit } from "@/app/utils/formatRupiah";

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
    // const post = await createTarif(data, session?.user.idFasyankes);
    if (data) {
      const body = {
        namaTarif: data.namaTarif,
        kategoriTarif: data.kategoriTarif.value,
        hargaTarif: rawHargaTarif,
        penjamin: data.penjamin.value,
        idFasyankes: session?.user.idFasyankes,
      };

      const posttoApi = await postApiMasterTarif({
        url: "master-tarif/create",
        data: body,
      });

      if (posttoApi) {
        if (modalRef.current) {
          modalRef.current.close();
        }
        ToastAlert({ icon: "success", title: "Berhasil Menambahkan Tarif" });
        reset();
        setTimeout(() => {
          route.refresh(), 1000;
          document.location.reload();
        }, 2000);
      } else {
        ToastAlert({ icon: "error", title: "Gagal Menambahkan Tarif" });
        console.log(posttoApi);

        // Set API errors on specific fields
        if (posttoApi.errors) {
          Object.keys(posttoApi.errors).forEach((field) => {
            setError(field as keyof AddMasterTarif, {
              type: "api",
              message: posttoApi.errors[field],
            });
          });
        }
      }
    } else {
      ToastAlert({ icon: "error", title: data as string });
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
                        { value: "bpjs", label: "BPJS" },
                        { value: "pribadi", label: "PRIBADI" },
                        { value: "asuransi", label: "ASURANSI" },
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
