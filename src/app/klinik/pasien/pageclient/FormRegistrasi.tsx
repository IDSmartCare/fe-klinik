"use client";
import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { typeFormRegis } from "../interface/typeFormRegistrasi";
import { useEffect, useId, useState } from "react";
import { SubmitButtonServer } from "@/app/components/SubmitButtonServerComponent";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
const FormRegistrasi = ({
  idpasien,
  session,
}: {
  idpasien: string;
  session: Session | null;
}) => {
  const [ifAsuransi, setIfAsuransi] = useState(false);
  const [nomorAsuransi, setNomorAsuransi] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    register,
  } = useForm<typeFormRegis>();

  const uuid = useId();
  const [asuransi, setAsuransi] = useState([]);
  const [dokter, setDokter] = useState<{ label: string; value: string }[]>([]);
  const route = useRouter();
  const hari = new Date().getDay();

  useEffect(() => {
    const getDokter = async () => {
      const hari = new Date().getDay();
      const resDokter = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/dokter/jadwaldokter/${hari}/${session?.user.idFasyankes}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );

      if (!resDokter.ok) {
        setDokter([]);
        return;
      }

      const dataDokter = await resDokter.json();
      if (!dataDokter.success || !dataDokter.data) {
        setDokter([]);
        return;
      }

      // Sesuaikan format data dokter
      const newArr = dataDokter.data?.flatMap((item: any) => {
        return item.jam_praktek.map((jam: any) => ({
          value: item.id,
          label: `${item.name} -  ${item.unit} (${jam.from} - ${jam.to})`,
          idHari: item.hari.id,
          idJamPraktek: jam.id,
        }));
      });

      setDokter([...newArr]);
    };

    getDokter();
  }, [session?.user.idFasyankes]);

  useEffect(() => {
    const getAsuransi = async () => {
      const resDokter = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/masterasuransi/${session?.user.idFasyankes}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );

      if (!resDokter.ok) {
        setAsuransi([]);
        return;
      }

      const dataDokter = await resDokter.json();
      if (!dataDokter.success || !dataDokter.data) {
        setAsuransi([]);
        return;
      }

      const formattedAsuransi = dataDokter.data.map((item: any) => ({
        value: item.kodeAsuransi,
        label: item.namaAsuransi,
      }));

      setAsuransi(formattedAsuransi);
    };
    getAsuransi();
  }, [session?.user.idFasyankes]);

  const onSubmit: SubmitHandler<typeFormRegis> = async (data) => {
    const bodyPost = {
      pasienData: {
        pasienId: Number(idpasien),
        doctorId: Number(data.dokterId.value),
        penjamin: data.penjamin.value,
        namaAsuransi: data.namaAsuransi?.label,
        nomorAsuransi: data.nomorAsuransi,
        idFasyankes: session?.user.idFasyankes,
        availableDayId: data.dokterId.idHari,
        availableTimeId: data.dokterId.idJamPraktek,
        hari: hari,
      },
      userRole: session?.user.role,
      userPackage: session?.user.package,
    };

    try {
      const postApi = await fetch(`/api/pasien/addregistrasi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPost),
      });

      // Handle server-side validation error
      if (!postApi.ok) {
        const errorResponse = await postApi.json();
        if (errorResponse.message) {
          ToastAlert({ icon: "error", title: errorResponse.message });
        } else {
          ToastAlert({ icon: "error", title: "Gagal simpan data!" });
        }
        return;
      }

      ToastAlert({ icon: "success", title: "Berhasil!" });
      reset();
      route.refresh();
    } catch (error) {
      console.log(error);
      ToastAlert({ icon: "error", title: "Gagal!" });
    }
  };

  const onChangePenjamin = (e: any) => {
    const targetValue = e.target.value;
    if (targetValue) {
      if (e.target.value.value === "ASURANSI") {
        setIfAsuransi(true);
      } else {
        setIfAsuransi(false);
        setNomorAsuransi("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control w-full">
        <div className="label">
          <span className="label-text">Dokter Yang Tersedia Hari Ini</span>
        </div>
        <Controller
          name="dokterId"
          control={control}
          rules={{
            required: "*Silahkan pilih",
          }}
          render={({ field }) => (
            <Select
              {...field}
              isClearable
              instanceId={uuid}
              options={dokter}
              onChange={(selectedOption) => {
                field.onChange(selectedOption);
              }}
            />
          )}
        />
        {errors.dokterId && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.dokterId.message?.toString()}
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
            required: "*Silahkan pilih",
            onChange: (e) => onChangePenjamin(e),
          }}
          render={({ field }) => (
            <Select
              {...field}
              isClearable
              instanceId={uuid}
              options={[
                { value: "BPJS", label: "BPJS" },
                { value: "PRIBADI", label: "PRIBADI" },
                { value: "ASURANSI", label: "ASURANSI" },
              ]}
            />
          )}
        />

        {errors.penjamin && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.penjamin.message?.toString()}
            </span>
          </label>
        )}
        {ifAsuransi && (
          <div className="mt-1">
            <div className="label">
              <span className="label-text">Asuransi</span>
            </div>
            <Controller
              name="namaAsuransi"
              control={control}
              rules={{
                required: "*Silahkan pilih",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  instanceId={uuid}
                  options={asuransi}
                />
              )}
            />
            {errors.namaAsuransi && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.namaAsuransi.message?.toString()}
                </span>
              </label>
            )}
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Nomor Asuransi</span>
              </div>
              <input
                {...register("nomorAsuransi", {
                  required: "*Tidak boleh kosong",
                })}
                type="number"
                value={nomorAsuransi}
                onChange={(e) => setNomorAsuransi(e.target.value)}
                className="input input-primary w-full input-sm"
              />
            </div>
            {errors.nomorAsuransi && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.nomorAsuransi.message?.toString()}
                </span>
              </label>
            )}
          </div>
        )}
      </div>

      {session?.user.role !== "tester" && (
        <div className="mt-3">
          <SubmitButtonServer />
        </div>
      )}
    </form>
  );
};

export default FormRegistrasi;
