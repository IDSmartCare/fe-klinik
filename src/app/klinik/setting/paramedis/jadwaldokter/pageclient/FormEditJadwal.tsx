"use client";
import React, { useId, useEffect, useState } from "react";
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

  const route = useRouter();
  const [timeList, setTimeList] = useState<
    { id: number; jamDari: string; jamSampai: string }[]
  >([
    // Default initial time entry
    { id: 1, jamDari: "", jamSampai: "" },
  ]);

  // Counter for generating unique IDs
  const [nextId, setNextId] = useState(2);

  const handleAddTime = () => {
    setTimeList((prev) => [
      ...prev,
      { id: nextId, jamDari: "", jamSampai: "" },
    ]);
    setNextId((prev) => prev + 1);
  };

  // Handle deleting a specific time entry
  const handleDeleteTime = (idToDelete: number) => {
    if (timeList.length > 1) {
      // Prevent deleting if only one time entry remains
      setTimeList((prev) => prev.filter((item) => item.id !== idToDelete));
    }
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

  const onSubmit: SubmitHandler<typeFormJadwal> = async (data) => {
    const bodyToPos = {
      dokter_id: Number(data.dokterId.value),
      slot: Number(data.slot?.value),
      days: data.hari.map((day: { value: string }) => day.value),
      times: timeList.map((time) => ({
        from: time.jamDari,
        to: time.jamSampai,
      })),
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
      route.back();
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
        className="flex flex-col gap-2 mt-10 w-full md:w-4/12 border-gray-300 border-2 rounded-lg p-5  md:p-8"
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
                  {
                    label: "60 Menit",
                    value: 60,
                  },
                  {
                    label: "90 Menit",
                    value: 90,
                  },
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" // Tambahkan width
                  height="24" // Tambahkan height
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636"
                      stroke="#ffffff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
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

        {session?.user.role != "tester" && (
          <button type="submit" className="btn btn-primary btn-sm">
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default FormEditJadwal;
