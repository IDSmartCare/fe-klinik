"use client";

import { ToastAlert } from "@/app/helper/ToastAlert";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonModalComponent, {
  icon,
} from "@/app/components/ButtonModalComponent";
import Link from "next/link";

const ModalAddVoice = ({ session }: { session: Session | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();
  const route = useRouter();

  const onSubmit: SubmitHandler<any> = async (data) => {
    const formData = new FormData();
    formData.append("namaPoli", data.namaPoli);
    formData.append("file", data.voiceFile[0]);
    formData.append("idFasyankes", session?.user.idFasyankes);
    formData.append("namaFasyankes", session?.user.nameFasyankes);

    try {
      const postApi = await fetch(`/api/mastervoice/add`, {
        method: "POST",
        body: formData,
      });

      if (!postApi.ok) {
        ToastAlert({ icon: "error", title: "Gagal" });
        return;
      }

      ToastAlert({ icon: "success", title: "Berhasil!" });
      const modal = document.getElementById("add-voice") as HTMLDialogElement;
      modal?.close();
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
        modalname="add-voice"
        title="Voice Baru"
      />
      <dialog id="add-voice" className="modal">
        <div className="modal-box w-8/12 md:w-3/12 max-w-md">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Tambah Voice untuk Poli baru</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
          >
            <input
              type="text"
              placeholder="Nama Poliklinik"
              {...register("namaPoli", { required: "Tidak boleh kosong!" })}
              className="input input-md input-bordered input-primary w-full"
            />
            <span className="label-text-alt text-error">
              {" "}
              {errors.namaPoli && (
                <span>{errors.namaPoli.message?.toString()}</span>
              )}
            </span>
            <div className="input input-md input-bordered input-primary w-full flex items-center overflow-hidden">
              <input
                type="file"
                accept=".mp3,.wav"
                {...register("voiceFile", { required: "Tidak boleh kosong!" })}
              />
            </div>

            <span className="label-text-alt text-error">
              {" "}
              {errors.voiceFile && (
                <span>{errors.voiceFile?.message?.toString()}</span>
              )}
            </span>

            <Link
              href="https://micmonster.com/"
              target="_blank"
              className="text-primary text-sm mb-2 "
            >
              *Klik disini untuk membuat voice
            </Link>

            {session?.user.role !== "tester" && <SubmitButtonServer />}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddVoice;
