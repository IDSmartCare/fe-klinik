"use client";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";
import ButtonModalComponent, {
  icon,
} from "../../../../../components/ButtonModalComponent";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { typeFormJadwal } from "../interface/typeFormJadwal";
import { useEffect, useId, useState } from "react";
import { typeFormDokter } from "../interface/typeFormDokter";
import Select from "react-select";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

const ModalAddJadwal = ({ session }: { session: Session | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<typeFormJadwal>();
  const [listDokter, setListDokter] = useState<any[]>([]);
  const route = useRouter();

  useEffect(() => {
    async function getDokter() {
      const getApi = await fetch(
        `/api/paramedis/findalldokter?idFasyankes=${session?.user.idFasyankes}`
      );
      if (!getApi.ok) {
        setListDokter([]);
        return;
      }
      const data = await getApi.json();
      const newData = data.map((item: typeFormDokter) => {
        return {
          label: item.namaLengkap,
          value: item.id,
        };
      });
      setListDokter([...newData]);
    }
    getDokter();
  }, [session?.user.idFasyankes]);

  const onSubmit: SubmitHandler<typeFormJadwal> = async (data) => {
    const bodyToPos = {
      hari: data.kodeHari.label,
      kodeHari: Number(data.kodeHari.value),
      dokterId: Number(data.dokterId.value),
      jamPraktek: `${data.jamDari}-${data.jamSampai}`,
      idFasyankes: session?.user.idFasyankes,
    };
    try {
      const postApi = await fetch(`/api/jadwal/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToPos),
      });
      if (!postApi.ok) {
        const resMessage = await postApi.json();
        ToastAlert({ icon: "error", title: resMessage.message });
        return;
      }
      ToastAlert({ icon: "success", title: "Berhasil!" });
      reset();
      route.refresh();
    } catch (error: any) {
      console.log(error);
      ToastAlert({ icon: "error", title: error.message });
    }
  };
  const uuid = useId();
  return (
    <div className="self-end">
      <ButtonModalComponent
        icon={icon.add}
        modalname="add-jadwal"
        title="Jadwal Baru"
      />
      <dialog id="add-jadwal" className="modal">
        <div className="modal-box w-4/12 max-w-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Tambah Jadwal Dokter</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
          >
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
                />
              )}
            />
            <span className="label-text-alt text-error">
              {" "}
              {errors.kodeHari && (
                <span>{errors.kodeHari.message?.toString()}</span>
              )}
            </span>
            <Controller
              name="dokterId"
              control={control}
              rules={{
                required: "Tidak boleh kosong!",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  instanceId={uuid}
                  placeholder="Pilih dokter"
                  options={listDokter}
                />
              )}
            />
            <span className="label-text-alt text-error">
              {" "}
              {errors.dokterId && (
                <span>{errors.dokterId.message?.toString()}</span>
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
              {" "}
              {errors.jamDari && <span>{errors.jamDari.message}</span>}
            </span>
            {session?.user.role !== "tester" && <SubmitButtonServer />}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddJadwal;
