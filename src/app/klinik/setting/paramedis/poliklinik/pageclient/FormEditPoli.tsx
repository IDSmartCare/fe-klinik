"use client";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

const FormEditPoli = ({
  data,
  session,
}: {
  data: any;
  session: Session | null;
}) => {
  const route = useRouter();
  const [poli, setPoli] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<any | null>(null); // State untuk nilai yang dipilih

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
      const newArr = dataAllPoli.map((item: any) => ({
        label: item.namaPoli,
        value: item.id,
      }));

      setPoli(newArr);

      // Set nilai awal untuk voice poli berdasarkan data yang diterima
      const initialVoice = newArr.find(
        (item: any) => item.value === data.voiceId
      );
      setSelectedVoice(initialVoice || null);
    };

    getPoli();
  }, [session?.user.idFasyankes, data.voiceId]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const body = {
      id: data.id,
      namaPoli: e.target.namaPoli.value,
      voiceId: selectedVoice?.value, // Gunakan nilai dari state
    };
    try {
      const fetchBody = await fetch("/api/paramedis/updatepoli", {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      });
      const res = await fetchBody.json();
      if (res.id) {
        ToastAlert({ icon: "success", title: "Berhasil!" });
        route.refresh();
        setTimeout(() => {
          route.push("/klinik/setting/paramedis/poliklinik");
        }, 500);
      } else {
        ToastAlert({ icon: "error", title: "Error" });
      }
    } catch (error: any) {
      ToastAlert({ icon: "error", title: error.message });
    }
  };

  return (
    <div className="flex w-1/2" onSubmit={onSubmit}>
      <form className="w-full">
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Kode Poli</span>
          </div>
          <input
            type="text"
            readOnly
            disabled
            value={data?.kodePoli || "Tidak ada data"}
            className="input input-bordered w-full input-sm"
          />
        </div>
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Nama Poli</span>
          </div>
          <input
            type="text"
            defaultValue={data?.namaPoli || "Tidak ada data"}
            name="namaPoli"
            className="input input-primary w-full input-sm"
          />
        </div>

        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Voice Poli</span>
          </div>

          <Select
            placeholder="Pilih Voice"
            className="w-full"
            isClearable
            value={selectedVoice} // Gunakan state untuk value
            onChange={(option) => setSelectedVoice(option)} // Perbarui state saat opsi dipilih
            options={poli}
          />
        </div>
        {session?.user.role !== "tester" && (
          <button className="btn btn-sm btn-primary btn-block mt-2">
            EDIT
          </button>
        )}
      </form>
    </div>
  );
};

export default FormEditPoli;
