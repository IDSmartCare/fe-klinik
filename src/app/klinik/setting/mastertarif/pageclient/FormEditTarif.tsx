"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import AlertHeaderComponent from "../../paramedis/components/AlertHeaderComponent";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { formatRupiahEdit } from "@/app/helper/formatRupiah";
import { useRouter } from "next/navigation";

const FormEditTarif = ({ dataForm }: { dataForm: any }) => {
  const [rawHargaTarif, setRawHargaTarif] = useState(dataForm?.hargaTarif);
  const route = useRouter();

  const handleHargaTarifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setRawHargaTarif(numericValue);
    e.target.value = formatRupiahEdit(numericValue);
  };

  const { data } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formEditTarif>();

  const onSubmit: SubmitHandler<formEditTarif> = async (form) => {
    const body = {
      id: dataForm.id,
      namaTarif: dataForm.namaTarif ?? form?.namaTarif,
      doctorId: dataForm.doctorId,
      hargaTarif: rawHargaTarif,
    };

    try {
      const posttoApi = await fetch("/api/mastertarif/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (posttoApi.ok) {
        ToastAlert({ icon: "success", title: "Berhasil Mengubah Tarif" });
        route.push("/klinik/setting/mastertarif");
        route.refresh();
      } else {
        const errorResponse = await posttoApi.json();
        ToastAlert({
          icon: "error",
          title: errorResponse.message || "Gagal Mengubah Tarif",
        });
      }
    } catch (error: any) {
      ToastAlert({
        icon: "error",
        title: error.message || "Terjadi Kesalahan",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <AlertHeaderComponent message="Edit tarif" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 w-1/2"
      >
        <input {...register("id", { value: dataForm?.id })} type="hidden" />
        {dataForm?.penjamin != null && (
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Penjamin</span>
            </div>
            <input
              type="text"
              disabled
              value={dataForm?.penjamin}
              className="input input-sm input-bordered w-full "
            />
          </div>
        )}

        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Kategori</span>
          </div>
          <input
            type="text"
            disabled
            value={dataForm?.kategoriTarif}
            className="input input-sm input-bordered w-full "
          />
        </div>
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Nama Tarif</span>
          </div>
          <input
            type="text"
            defaultValue={dataForm?.namaTarif}
            {...register("namaTarif")}
            className="input input-sm input-primary w-full"
            disabled={dataForm?.kategoriTarif == "Dokter"}
          />
        </div>
        {errors.namaTarif && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.namaTarif.message}
            </span>
          </label>
        )}
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Harga Tarif</span>
          </div>
          <input
            type="text"
            defaultValue={formatRupiahEdit(dataForm?.hargaTarif)}
            {...register("hargaTarif", { required: "Tidak boleh kosong!" })}
            onChange={handleHargaTarifChange}
            className="input input-sm input-primary w-full"
          />
        </div>
        {errors.hargaTarif && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.hargaTarif.message}
            </span>
          </label>
        )}
        {data?.user.role !== "tester" && (
          <button className="btn btn-sm btn-primary btn-block">EDIT</button>
        )}
      </form>
    </div>
  );
};

export default FormEditTarif;
