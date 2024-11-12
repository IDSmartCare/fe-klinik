"use client";

import ButtonModalComponent, {
  icon,
} from "../../../../../components/ButtonModalComponent";
import { useForm, SubmitHandler } from "react-hook-form";
import { typeFormPoliklinik } from "../interface/typeFormPoliklinik";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

const ModalAddPoli = ({ session }: { session: Session | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<typeFormPoliklinik>();
  const route = useRouter();

  const onSubmit: SubmitHandler<typeFormPoliklinik> = async (data) => {
    const bodyToPost = {
      namaPoli: data.namaPoli,
      kodePoli: data.kodePoli,
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
        <div className="modal-box w-3/12 max-w-md">
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
              className="input input-sm nput-bordered input-primary w-full max-w-xs"
            />
            <span className="label-text-alt text-error">
              {" "}
              {errors.namaPoli && <span>{errors.namaPoli.message}</span>}
            </span>
            <input
              type="text"
              placeholder="Kode Poliklinik"
              {...register("kodePoli", { required: "Tidak boleh kosong!" })}
              className="input input-sm input-bordered input-primary w-full max-w-xs"
            />
            <span className="label-text-alt text-error">
              {" "}
              {errors.kodePoli && <span>{errors.kodePoli.message}</span>}
            </span>
            {session?.user.role !== "tester" && <SubmitButtonServer />}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddPoli;
