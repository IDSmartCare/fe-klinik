"use client";
import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { typeFormJadwal } from "../interface/typeFormJadwal";
import { Session } from "next-auth";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";

const ModalEditJadwal = ({
  session,
  dataJadwal,
  availableDay,
}: {
  dataJadwal: any;
  availableDay: any;
  session: Session | null;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<typeFormJadwal>();

  const route = useRouter();

  const [timeList, setTimeList] = useState<
    {
      id: number;
      jamDari: string;
      jamSampai: string;
    }[]
  >([]);

  const [modalId, setModalId] = useState<string | null>(null);

  useEffect(() => {
    const modal = document.getElementById("edit-jadwal");
    if (!modal) return;

    const observer = new MutationObserver(() => {
      const dataId = modal.getAttribute("data-id");
      setModalId(dataId);
    });

    observer.observe(modal, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const selectedDay = availableDay.find(
    (item: any) => item.id.toString() === modalId
  );

  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    if (!modalId || !availableDay) return;

    if (selectedDay) {
      setTimeList(
        selectedDay.times.map((time: any, index: number) => ({
          id: index + 1,
          jamDari: time.from,
          jamSampai: time.to,
        }))
      );
      setValue("slot", {
        value: selectedDay.slot,
        label: `${selectedDay.slot} Menit`,
      });
      setValue(
        "hari",
        selectedDay.day
          .split(",")
          .map((day: string) => ({ value: day, label: day }))
      );
    }
  }, [modalId, availableDay, setValue, selectedDay]);

  const handleAddTime = () => {
    setTimeList((prev) => [
      ...prev,
      { id: Date.now(), jamDari: "", jamSampai: "" },
    ]);
  };

  const handleTimeChange = (
    id: number,
    field: "jamDari" | "jamSampai",
    value: string
  ) => {
    setTimeList((prev) =>
      prev.map((time) => (time.id === id ? { ...time, [field]: value } : time))
    );
  };

  const handleDeleteTime = (idToDelete: number) => {
    if (timeList.length > 1) {
      setTimeList((prev) => prev.filter((item) => item.id !== idToDelete));
    }
  };

  const onSubmit: SubmitHandler<typeFormJadwal> = async (data) => {
    const bodyToPos = {
      availableDayId: modalId,
      data: {
        dokter_id: dataJadwal.id,
        slot: Number(data.slot?.value),
        days: selectedDay,
        times: timeList.map((time) => ({
          from: time.jamDari,
          to: time.jamSampai,
        })),
      },
    };

    try {
      const postApi = await fetch("/api/dokter/jadwaldokter/editjadwal", {
        method: "PUT",
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
      const modal: any = document?.getElementById("edit-jadwal");
      modal.close();
      setTimeList([{ id: 1, jamDari: "", jamSampai: "" }]);
      setNextId(2);
      route.refresh();
    } catch (error: any) {
      console.log(error);
      ToastAlert({ icon: "error", title: error.message });
    }
  };

  return (
    <dialog id="edit-jadwal" className="modal">
      <div className="modal-box w-4/12 max-w-lg">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Edit Jadwal Dokter (Hari {selectedDay?.day})
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-5"
        >
          <div className="relative">
            <Controller
              name="slot"
              control={control}
              rules={{ required: "Tidak boleh kosong!" }}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  placeholder="Pilih Sesi"
                  options={[
                    { label: "60 Menit", value: 60 },
                    { label: "90 Menit", value: 90 },
                  ]}
                />
              )}
            />
          </div>
          <span className="label-text-alt text-error">
            {errors.slot && <span>{errors.slot?.message?.toString()}</span>}
          </span>

          {/* Time input fields */}
          {timeList.map((item) => (
            <div key={item.id} className="flex gap-2 items-center mb-2">
              <input
                type="time"
                className="input input-sm input-bordered input-primary w-full max-w-xs"
                value={item.jamDari}
                onChange={(e) =>
                  handleTimeChange(item.id, "jamDari", e.target.value)
                }
              />
              <span className="label-text-alt">s/d</span>
              <input
                type="time"
                className="input input-sm input-bordered input-primary w-full max-w-xs"
                value={item.jamSampai}
                onChange={(e) =>
                  handleTimeChange(item.id, "jamSampai", e.target.value)
                }
              />
              {timeList.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteTime(item.id)}
                  className="btn btn-sm btn-error text-white"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}

          {/* Add time button */}
          <button
            type="button"
            onClick={handleAddTime}
            className="btn btn-sm btn-success text-white"
          >
            Tambah Waktu
          </button>

          {session?.user.role !== "tester" && <SubmitButtonServer />}
        </form>
      </div>
    </dialog>
  );
};

export default ModalEditJadwal;
