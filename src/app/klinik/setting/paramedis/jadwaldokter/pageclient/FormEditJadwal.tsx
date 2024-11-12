"use client";
import React, { useId, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Select from "react-select";
import { typeFormJadwal } from "../interface/typeFormJadwal";
import AlertHeaderComponent from "../../components/AlertHeaderComponent";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

const FormEditJadwal = ({
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
  } = useForm<typeFormJadwal>();

  const uuid = useId();
  const route = useRouter();

  useEffect(() => {
    if (data) {
      const [jamDari, jamSampai] = data.jamPraktek.split("-");
      reset({
        kodeHari: {
          label: data.hari,
          value: data.kodeHari,
        },
        jamDari: jamDari,
        jamSampai: jamSampai,
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<typeFormJadwal> = async (data) => {
    const bodyToPos = {
      hari: data.kodeHari.label,
      kodeHari: Number(data.kodeHari.value),
      jamPraktek: `${data.jamDari}-${data.jamSampai}`,
      id: Number(data.id),
      idFasyankes: session?.user.idFasyankes,
    };

    try {
      const response = await fetch(`/api/jadwal/edit`, {
        method: "PUT",
        body: JSON.stringify(bodyToPos),
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
      <AlertHeaderComponent message="Edit Jadwal Dokter" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mt-10 md:w-4/12 border-gray-300 border-2 rounded-lg p-5  md:p-8"
      >
        <input {...register("id", { value: data.id })} type="hidden" />
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
              placeholder="Pilih hari"
              options={[
                { label: "Senin", value: 1 },
                { label: "Selasa", value: 2 },
                { label: "Rabu", value: 3 },
                { label: "Kamis", value: 4 },
                { label: "Jumat", value: 5 },
                { label: "Sabtu", value: 6 },
                { label: "Minggu", value: 0 },
              ]}
              value={field.value || null} // pastikan field.value memiliki format { label, value }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption : null);
              }}
            />
          )}
        />
        <span className="label-text-alt text-error">
          {errors.kodeHari && (
            <span>{errors.kodeHari.message?.toString()}</span>
          )}
        </span>

        <div className="flex gap-2 items-center">
          <input
            type="time"
            {...register("jamDari", { required: "Tidak boleh kosong!" })}
            className="input input-sm input-bordered input-primary w-full max-w-xs"
          />
          <span className="label-text-alt">s/d</span>
          <input
            type="time"
            {...register("jamSampai", { required: "Tidak boleh kosong!" })}
            className="input input-sm input-bordered input-primary w-full max-w-xs"
          />
        </div>
        <span className="label-text-alt text-error">
          {errors.jamDari && <span>{errors.jamDari.message}</span>}
        </span>
        {session?.user.role != "tester" && (
          <button type="submit" className="btn btn-primary mt-4">
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default FormEditJadwal;
