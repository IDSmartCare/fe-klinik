"use client";
import ButtonModalComponent, {
  icon,
} from "../../../../../components/ButtonModalComponent";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { typeFormPoliklinik } from "../interface/typeFormPoliklinik";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import Select from "react-select";

const ModalAddPoli = ({ session }: { session: Session | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<typeFormPoliklinik>();
  const route = useRouter();
  const uuid = useId();
  const [poli, setPoli] = useState<any[]>([]);

  useEffect(() => {
    const getPoli = async () => {
      const dataPoli = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/setting/voicepoli/${session?.user.idFasyankes}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );

      if (!dataPoli.ok) {
        setPoli([]);
        return;
      }

      const dataAllPoli = await dataPoli.json();
      const newArr = dataAllPoli.map((item: typeFormPoliklinik) => {
        return {
          label: item.namaPoli,
          value: item.id,
        };
      });
      setPoli(newArr);
    };
    getPoli();
  }, [session?.user.idFasyankes]);

  const onSubmit: SubmitHandler<typeFormPoliklinik> = async (data) => {
    const bodyToPost = {
      namaPoli: data.namaPoli,
      kodePoli: data.kodePoli,
      voiceId: data.voiceId.value,
      idFasyankes: session?.user.idFasyankes,
    };

    try {
      const postApi = await fetch(`/api/poli/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToPost),
      });
      if (!postApi.ok) {
        ToastAlert({ icon: "error", title: "Gagal simpan data!" });
        return;
      }
      ToastAlert({ icon: "success", title: "Berhasil!" });
      const modal: any = document?.getElementById("add-poli");
      modal.close();
      reset();
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
        modalname="add-poli"
        title="Poli Baru"
      />
      <dialog id="add-poli" className="modal">
        <div className="modal-box w-8/12 md:w-8/12 h-4/6 p-5">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Tambah Poliklinik Baru</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
          >
            <input
              type="text"
              placeholder="Nama Poliklinik"
              {...register("namaPoli", { required: "Tidak boleh kosong!" })}
              className="input input-sm input-bordered input-primary w-full"
            />
            <span className="label-text-alt text-error">
              {errors.namaPoli && <span>{errors.namaPoli.message}</span>}
            </span>
            <input
              type="text"
              placeholder="Kode Poliklinik"
              {...register("kodePoli", { required: "Tidak boleh kosong!" })}
              className="input input-sm input-bordered input-primary w-full"
            />
            <span className="label-text-alt text-error">
              {errors.kodePoli && <span>{errors.kodePoli.message}</span>}
            </span>

            <Controller
              name="voiceId"
              control={control}
              rules={{
                required: "*Tidak boleh kosong",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Pilih Voice"
                  instanceId={uuid}
                  className="w-full"
                  isClearable
                  options={poli}
                />
              )}
            />
            {errors.voiceId && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.voiceId.message?.toString()}
                </span>
              </label>
            )}
            <div className="place-items-end">
              {session?.user.role !== "tester" && <SubmitButtonServer />}
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddPoli;
