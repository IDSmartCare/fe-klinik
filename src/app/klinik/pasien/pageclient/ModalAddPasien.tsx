"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { typeFormPasienBaru } from "../interface/typeFormPasienBaru";
import ButtonModalComponent, {
  icon,
} from "../../../components/ButtonModalComponent";
import Select from "react-select";
import { useEffect, useId, useRef, useState } from "react";
import { Session } from "next-auth";
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent";
import { useRouter } from "next/navigation";

const ModalAddPasien = ({ session }: { session: Session | null }) => {
  const uuid = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<typeFormPasienBaru>({
    defaultValues: {
      noHp: "+62",
    },
  });
  const route = useRouter();
  const noHpValue = watch("noHp");
  const [isStartedTyping, setIsStartedTyping] = useState(false);
  const [domisili, setDomisili] = useState(true);
  const [agamaLainnya, setAgamaLainnya] = useState(false);
  const [textAgamaLain, setTextAgamaLain] = useState("");
  const [pekerjaanLainnya, setPekerjaanLainnya] = useState(false);
  const [textPekerjaanLain, setTextPekerjaanLain] = useState("");
  const [listKota, setListKota] = useState<{ label: string; value: string }[]>(
    []
  );
  const [listKecamatan, setListKecamatan] = useState<
    { label: string; value: string }[]
  >([]);
  const [listKelurahan, setListKelurahan] = useState<
    { label: string; value: string }[]
  >([]);
  const [listKotaDomisili, setListKotaDomisili] = useState<
    { label: string; value: string }[]
  >([]);
  const [listKecamatanDomisili, setListKecamatanDomisili] = useState<
    { label: string; value: string }[]
  >([]);
  const [listKelurahanDomisili, setListKelurahanDomisili] = useState<
    { label: string; value: string }[]
  >([]);
  const [listProvinsi, setListProvinsi] = useState<
    { label: string; value: string }[]
  >([]);
  const [showNik, setShowNik] = useState(true);

  useEffect(() => {
    const getProv = async () => {
      try {
        const getProv = await fetch(`/api/wilayah/provinsi`);
        const resProv = await getProv.json();
        const newArr = resProv?.prov.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setListProvinsi([...newArr]);
      } catch (error) {
        console.log(error);
        setListProvinsi([]);
      }
    };
    getProv();
  }, []);
  //   const route = useRouter();
  const onSubmit: SubmitHandler<typeFormPasienBaru> = async (data) => {
    const alamat = {
      provinsi: data.provinsi.label,
      idProv: data.provinsi.value,
      kota: data.kota.label,
      idKota: data.kota.value,
      kecamatan: data.kecamatan.label,
      idKecamatan: data.kecamatan.value,
      kelurahan: data.kelurahan.label,
      idKelurahan: data.kelurahan.value,
      rt: Number(data.rt),
      rw: Number(data.rw),
    };

    const domisiliBody = {
      alamatDomisili: data.alamat,
      provinsiDomisili: alamat.provinsi,
      kotaDomisili: alamat.kota,
      kecamatanDomisili: alamat.kecamatan,
      kelurahanDomisili: alamat.kelurahan,
      idProvDomisili: alamat.idProv,
      idKotaDomisili: alamat.idKota,
      idKecamatanDomisili: alamat.idKecamatan,
      idKelurahanDomisili: alamat.idKelurahan,
      rtDomisili: alamat.rt,
      rwDomisili: alamat.rw,
      kodePosDomisili: data.kodePos,
    };

    const convertObtDomisili = {
      provinsiDomisili: data.provinsiDomisili?.label,
      idProvDomisili: data.provinsiDomisili?.value,
      kotaDomisili: data.kotaDomisili?.label,
      idKotaDomisili: data.kotaDomisili?.value,
      kecamatanDomisili: data.kecamatanDomisili?.label,
      idKecamatanDomisili: data.kecamatanDomisili?.value,
      kelurahanDomisili: data.kelurahanDomisili?.label,
      idKelurahanDomisili: data.kelurahanDomisili?.value,
      rtDomisili: Number(data.rtDomisili),
      rwDomisili: Number(data.rwDomisili),
    };

    const bodyToPost = {
      pasienData: {
        ...data,
        namaPasien: data.namaPasien,
        agama: textAgamaLain || data.agama.value,
        pendidikan: data.pendidikan.value,
        pekerjaan: textPekerjaanLain || data.pekerjaan.value,
        statusMenikah: data.statusMenikah.value,
        email: data.email ?? "noemail@gmail.com",
        ...alamat,
        ...(domisili && domisiliBody),
        ...(!domisili && convertObtDomisili),
        idFasyankes: session?.user.idFasyankes,
      },
      userRole: session?.user.role,
      userPackage: session?.user.package,
    };

    try {
      const postApi = await fetch(`/api/pasien/add`, {
        method: "POST",
        body: JSON.stringify(bodyToPost),
      });

      console.log(bodyToPost);

      if (!postApi.ok) {
        if (dialogRef.current) {
          dialogRef.current.close();
        }
        const errorData = await postApi.json();
        ToastAlert({
          icon: "error",
          title: errorData.message || "Gagal simpan data!",
        });
        return;
      }

      if (dialogRef.current) {
        dialogRef.current.close();
      }

      ToastAlert({ icon: "success", title: "Berhasil Menambahkan Pasien" });
      reset();
      route.refresh();
    } catch (error: any) {
      console.log(error);
      ToastAlert({ icon: "error", title: error.message });
    }
  };

  const onChangeAgama = (e: any) => {
    const targetValue = e.target.value;
    if (targetValue) {
      if (e.target.value.value === "LAINNYA") {
        setAgamaLainnya(true);
      } else {
        setAgamaLainnya(false);
        setTextAgamaLain("");
      }
    }
  };
  const onChangePekerjaan = (e: any) => {
    const targetValue = e.target.value;
    if (targetValue) {
      if (e.target.value.value === "LAINNYA") {
        setPekerjaanLainnya(true);
      } else {
        setPekerjaanLainnya(false);
        setTextPekerjaanLain("");
      }
    }
  };
  const onChangeProvinsi = async (e: any) => {
    if (e) {
      const getKota = await fetch(`/api/wilayah/kota?id=${e.value}`);
      const resKota = await getKota.json();
      const newArr = resKota?.kota.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setListKota([...newArr]);
    } else {
      setListKota([]);
      setListKecamatan([]);
      setListKelurahan([]);
    }
  };

  const onChangeKota = async (e: any) => {
    if (e) {
      const getData = await fetch(`/api/wilayah/kecamatan?id=${e.value}`);
      const resData = await getData.json();
      const newArr = resData?.kota.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setListKecamatan([...newArr]);
    } else {
      setListKecamatan([]);
      setListKelurahan([]);
    }
  };

  const onChangeKecamatan = async (e: any) => {
    if (e) {
      const getData = await fetch(`/api/wilayah/kelurahan?id=${e.value}`);
      const resData = await getData.json();
      const newArr = resData?.kota.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setListKelurahan([...newArr]);
    } else {
      setListKelurahan([]);
    }
  };

  const onChangeProvinsiDomisili = async (e: any) => {
    if (e) {
      const getKota = await fetch(`/api/wilayah/kota?id=${e.value}`);
      const resKota = await getKota.json();
      const newArr = resKota?.kota.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setListKotaDomisili([...newArr]);
    } else {
      setListKotaDomisili([]);
      setListKecamatanDomisili([]);
      setListKelurahanDomisili([]);
    }
  };

  const onChangeKotaDomisili = async (e: any) => {
    if (e) {
      const getData = await fetch(`/api/wilayah/kecamatan?id=${e.value}`);
      const resData = await getData.json();
      const newArr = resData?.kota.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setListKecamatanDomisili([...newArr]);
    } else {
      setListKecamatanDomisili([]);
      setListKelurahanDomisili([]);
    }
  };

  const onChangeKecamatanDomisili = async (e: any) => {
    if (e) {
      const getData = await fetch(`/api/wilayah/kelurahan?id=${e.value}`);
      const resData = await getData.json();
      const newArr = resData?.kota.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setListKelurahanDomisili([...newArr]);
    } else {
      setListKelurahanDomisili([]);
    }
  };

  const onChangeWNI = (e: any) => {
    const value = e.target.value;
    if (value === "WNI") {
      setShowNik(true);
    } else {
      setShowNik(false);
    }
  };
  return (
    <div className="self-end">
      <ButtonModalComponent
        icon={icon.add}
        modalname="add-pasien"
        title="Pasien Baru"
      />
      <dialog id="add-pasien" className="modal" ref={dialogRef}>
        <div className="modal-box w-11/12 max-w-6xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col mt-5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Tambah Pasien Baru</h3>
              <label className="label cursor-pointer">
                <span className="label-text font-bold text-lg mr-2">
                  Domisili Sesuai Dengan KTP
                </span>
                <input
                  type="checkbox"
                  onChange={() => setDomisili(!domisili)}
                  checked={domisili}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <AlertHeaderComponent message="Identitas Pasien" />
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 w-1/2">
                <div className="flex flex-col ">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Nama Pasien *</span>
                    </div>
                    <input
                      type="text"
                      {...register("namaPasien", {
                        required: "*Tidak boleh kosong",
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Nama tidak valid",
                        },
                      })}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                  {errors.namaPasien && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.namaPasien.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Tempat Lahir *</span>
                    </div>
                    <input
                      type="text"
                      {...register("tempatLahir", {
                        required: "*Tidak boleh kosong",
                      })}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                  {errors.tempatLahir && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.tempatLahir.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Tanggal Lahir *</span>
                    </div>
                    <input
                      type="date"
                      {...register("tanggalLahir", {
                        required: "*Tidak boleh kosong",
                      })}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                  {errors.tanggalLahir && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.tanggalLahir.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Nomor HP *</span>
                    </div>
                    <input
                      type="text"
                      placeholder="+628xxxxxxxx"
                      {...register("noHp", {
                        required: "*Tidak boleh kosong",
                        validate: {
                          isNumeric: (value) =>
                            /^[+62]\d*$/.test(value) ||
                            "*Nomor HP hanya boleh berisi angka",
                          startsWithPrefix: (value) =>
                            value.startsWith("+62") ||
                            "*Nomor HP harus diawali dengan +62",
                          noZeroAfterPrefix: (value) =>
                            !/^\+620/.test(value) ||
                            "*Nomor HP tidak boleh mengandung angka 0 setelah +62",
                          minLength: (value) =>
                            value.length >= 11 ||
                            "*Nomor HP harus minimal 11 karakter",
                          maxLength: (value) =>
                            value.length <= 13 ||
                            "*Nomor HP tidak boleh lebih dari 13 karakter",
                        },
                      })}
                      className="input input-primary w-full input-sm"
                      value={isStartedTyping ? noHpValue : ""}
                      onChange={(e) => {
                        let inputValue = e.target.value;
                        if (!isStartedTyping) {
                          // Tambahkan +62 saat pertama kali mengetik
                          setIsStartedTyping(true);
                          inputValue = "+62" + inputValue;
                        }
                        // Bersihkan karakter non-angka (kecuali +)
                        if (!inputValue.startsWith("+62")) {
                          setValue("noHp", "+62");
                        } else {
                          setValue("noHp", inputValue.replace(/[^+\d]/g, ""));
                        }
                      }}
                    />
                  </div>
                  {errors.noHp && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.noHp.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Email</span>
                    </div>
                    <input
                      type="email"
                      {...register("email")}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.email.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Ibu Kandung *</span>
                    </div>
                    <input
                      type="text"
                      {...register("ibuKandung", {
                        required: "*Tidak boleh kosong",
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Nama tidak valid",
                        },
                      })}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                  {errors.ibuKandung && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.ibuKandung.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex">
                  <div className="label w-1/3">
                    <span className="label-text">Nomor BPJS</span>
                  </div>
                  <input
                    type="number"
                    {...register("bpjs")}
                    className="input input-primary w-full input-sm"
                  />
                </div>
                <div className="flex">
                  <div className="label w-1/3">
                    <span className="label-text">No. Asuransi Lain</span>
                  </div>
                  <input
                    type="text"
                    {...register("noAsuransi")}
                    className="input input-primary w-full input-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col w-1/2 gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="label w-1/3">
                      <span className="label-text">Jenis Kelamin *</span>
                    </div>
                    <div className="flex gap-2 items-center w-full">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...register("jenisKelamin", {
                            required: "*Tidak boleh kosong",
                          })}
                          value={"L"}
                          className="radio radio-primary"
                        />
                        <span className="label-text">Laki-Laki</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...register("jenisKelamin", {
                            required: "*Tidak boleh kosong",
                          })}
                          value={"P"}
                          className="radio radio-primary"
                        />
                        <span className="label-text">Perempuan</span>
                      </div>
                    </div>
                  </div>
                  {errors.jenisKelamin && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.jenisKelamin.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="label w-1/3">
                      <span className="label-text">Warganegara *</span>
                    </div>
                    <div className="flex items-center w-full gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...register("wargaNegara", {
                            required: "*Tidak boleh kosong",
                            onChange: onChangeWNI,
                          })}
                          value={"WNI"}
                          className="radio radio-primary"
                        />
                        <span className="label-text">WNI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...register("wargaNegara", {
                            required: "*Tidak boleh kosong",
                            onChange: onChangeWNI,
                          })}
                          value={"WNA"}
                          className="radio radio-primary"
                        />
                        <span className="label-text">WNA</span>
                      </div>
                    </div>
                  </div>
                  {errors.wargaNegara && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.wargaNegara.message?.toString()}
                      </span>
                    </label>
                  )}
                </div>
                {showNik && (
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">NIK</span>
                    </div>
                    <input
                      type="number"
                      {...register("nik", {
                        minLength: { value: 16, message: "Harus 16 digit" },
                        maxLength: { value: 16, message: "Harus 16 digit" },
                      })}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                )}
                {errors.nik && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.nik.message}
                    </span>
                  </label>
                )}
                {!showNik && (
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">No. Paspor</span>
                    </div>
                    <input
                      type="text"
                      {...register("paspor")}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Status Menikah *</span>
                    </div>
                    <Controller
                      name="statusMenikah"
                      control={control}
                      rules={{
                        required: "*Tidak boleh kosong",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          className="w-full"
                          instanceId={uuid}
                          options={[
                            { value: "BELUM_KAWIN", label: "BELUM KAWIN" },
                            { value: "KAWIN", label: "KAWIN" },
                            { value: "CERAI_HIDUP", label: "CERAI HIDUP" },
                            { value: "CERAI_MATI", label: "CERAI MATI" },
                          ]}
                        />
                      )}
                    />
                  </div>
                  {errors.statusMenikah && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.statusMenikah.message?.toString()}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col ">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Agama *</span>
                    </div>
                    <Controller
                      name="agama"
                      control={control}
                      rules={{
                        required: "*Tidak boleh kosong",
                        onChange: (e) => onChangeAgama(e),
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          instanceId={uuid}
                          className="w-full"
                          options={[
                            { value: "ISLAM", label: "ISLAM" },
                            { value: "KRISTEN", label: "KRISTEN (PROTESTAN)" },
                            { value: "KATOLIK", label: "KATOLIK" },
                            { value: "HINDU", label: "HINDU" },
                            { value: "BUDHA", label: "BUDHA" },
                            { value: "KONGHUCU", label: "KONGHUCU" },
                            { value: "PENGHAYAT", label: "PENGHAYAT" },
                            { value: "LAINNYA", label: "LAIN-LAIN" },
                          ]}
                        />
                      )}
                    />
                  </div>
                  {errors.agama && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.agama.message?.toString()}
                      </span>
                    </label>
                  )}
                </div>
                {agamaLainnya && (
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Lainnya</span>
                    </div>
                    <input
                      type="text"
                      value={textAgamaLain}
                      onChange={(e) => setTextAgamaLain(e.target.value)}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Pendidikan *</span>
                    </div>
                    <Controller
                      name="pendidikan"
                      control={control}
                      rules={{
                        required: "*Tidak boleh kosong",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          instanceId={uuid}
                          className="w-full"
                          options={[
                            { value: "TS", label: "TIDAK SEKOLAH" },
                            { value: "SD", label: "SD" },
                            { value: "SMP", label: "SMP SEDERAJAT" },
                            { value: "SMA", label: "SMA SEDERAJAT" },
                            { value: "D1", label: "D1-D3 SEDERAJAT" },
                            { value: "D4", label: "D4" },
                            { value: "S1", label: "S1" },
                            { value: "S2", label: "S2" },
                            { value: "S3", label: "S3" },
                          ]}
                        />
                      )}
                    />
                  </div>
                  {errors.pendidikan && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.pendidikan.message?.toString()}
                      </span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Pekerjaan *</span>
                    </div>
                    <Controller
                      name="pekerjaan"
                      control={control}
                      rules={{
                        required: "*Tidak boleh kosong",
                        onChange: (e) => onChangePekerjaan(e),
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          instanceId={uuid}
                          className="w-full"
                          options={[
                            { value: "TIDAK_BEKERJA", label: "TIDAK BEKERJA" },
                            { value: "PNS", label: "PNS" },
                            { value: "TNI/POLRI", label: "TNI/POLRI" },
                            { value: "BUMN", label: "BUMN" },
                            {
                              value: "SWASTA",
                              label: "PEGAWAI SWASTA / WIRAUSAHA",
                            },
                            { value: "LAINNYA", label: "LAIN-LAIN" },
                          ]}
                        />
                      )}
                    />
                  </div>
                  {errors.pekerjaan && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.pekerjaan.message?.toString()}
                      </span>
                    </label>
                  )}
                </div>
                {pekerjaanLainnya && (
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Lainnya</span>
                    </div>
                    <input
                      type="text"
                      value={textPekerjaanLain}
                      onChange={(e) => setTextPekerjaanLain(e.target.value)}
                      className="input input-primary w-full input-sm"
                    />
                  </div>
                )}
                <div className="flex">
                  <div className="label w-1/3">
                    <span className="label-text">Bahasa *</span>
                  </div>
                  <div className="flex gap-2 items-center w-full">
                    <input
                      type="radio"
                      {...register("bahasa")}
                      value={"Indonesia"}
                      defaultChecked
                      className="radio radio-primary"
                    />
                    <span className="label-text">Indonesia</span>
                    <input
                      type="radio"
                      {...register("bahasa")}
                      value={"Inggris"}
                      className="radio radio-primary"
                    />
                    <span className="label-text">Inggris</span>
                  </div>
                </div>
              </div>
            </div>
            <AlertHeaderComponent message="Alamat Pasien" />
            <div className="flex flex-col">
              <div className="flex">
                <div className="label w-40">
                  <span className="label-text">Alamat KTP *</span>
                </div>
                <input
                  type="text"
                  {...register("alamat", { required: "*Tidak boleh kosong" })}
                  className="input input-primary w-full input-sm"
                />
              </div>
              {errors.alamat && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.alamat.message}
                  </span>
                </label>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 w-1/2">
                <div className="flex gap-2 flex-col">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Provinsi *</span>
                    </div>
                    <Controller
                      name="provinsi"
                      control={control}
                      rules={{
                        required: "*Tidak boleh kosong",
                        onChange: (e) => {
                          onChangeProvinsi(e.target.value);
                        },
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="w-full"
                          isClearable
                          instanceId={uuid}
                          options={listProvinsi}
                        />
                      )}
                    />
                  </div>
                  {errors.provinsi && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.provinsi.message?.toString()}
                      </span>
                    </label>
                  )}

                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Kecamatan *</span>
                    </div>
                    <Controller
                      name="kecamatan"
                      control={control}
                      rules={{
                        required: "*Tidak boleh kosong",
                        onChange: (e) => {
                          onChangeKecamatan(e.target.value);
                        },
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          className="w-full"
                          instanceId={uuid}
                          options={listKecamatan}
                        />
                      )}
                    />
                  </div>
                  {errors.kecamatan && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.kecamatan.message?.toString()}
                      </span>
                    </label>
                  )}
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">Kelurahan *</span>
                      </div>
                      <Controller
                        name="kelurahan"
                        control={control}
                        rules={{
                          required: "*Tidak boleh kosong",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isClearable
                            className="w-full"
                            instanceId={uuid}
                            options={listKelurahan}
                          />
                        )}
                      />
                    </div>
                    {errors.kelurahan && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.kelurahan.message?.toString()}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <div className="label w-1/3">
                      <span className="label-text">Kota / Kab *</span>
                    </div>
                    <Controller
                      name="kota"
                      control={control}
                      rules={{
                        required: "*Tidak boleh kosong",
                        onChange: (e) => {
                          onChangeKota(e.target.value);
                        },
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isClearable
                          className="w-full"
                          instanceId={uuid}
                          options={listKota}
                        />
                      )}
                    />
                  </div>
                  {errors.kota && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.kota.message?.toString()}
                      </span>
                    </label>
                  )}
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">RT / RW *</span>
                      </div>
                      <div className="flex w-full gap-2">
                        <input
                          type="number"
                          {...register("rt", {
                            required: "*RT Tidak boleh kosong",
                          })}
                          className="input input-primary w-full input-sm "
                        />
                        <input
                          type="number"
                          {...register("rw", {
                            required: "*RW Tidak boleh kosong",
                          })}
                          className="input input-primary w-full input-sm "
                        />
                      </div>
                    </div>
                    <div className="flex">
                      {errors.rt && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.rt.message}
                          </span>
                        </label>
                      )}
                      {errors.rw && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.rw.message}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">Kode Pos *</span>
                      </div>
                      <input
                        type="number"
                        {...register("kodePos", {
                          required: "*Tidak boleh kosong",
                          maxLength: { value: 6, message: "Max 6 digit" },
                        })}
                        className="input input-primary w-full input-sm "
                      />
                    </div>
                  </div>
                  {errors.kodePos && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.kodePos.message?.toString()}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
            {!domisili && (
              <div className="flex flex-col gap-2">
                <AlertHeaderComponent message="Alamat Domisili" />
                <div className="flex">
                  <div className="label w-40">
                    <span className="label-text">Alamat Domisili</span>
                  </div>
                  <input
                    type="text"
                    {...register("alamatDomisili")}
                    className="input input-primary w-full input-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col w-1/2 gap-2">
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">Provinsi Domisili</span>
                      </div>
                      <Controller
                        name="provinsiDomisili"
                        control={control}
                        rules={{
                          onChange: (e) => {
                            onChangeProvinsiDomisili(e.target.value);
                          },
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isClearable
                            instanceId={uuid}
                            options={listProvinsi}
                            className="w-full"
                          />
                        )}
                      />
                    </div>
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">Kec. Domisili</span>
                      </div>
                      <Controller
                        name="kecamatanDomisili"
                        control={control}
                        rules={{
                          onChange: (e) => {
                            onChangeKecamatanDomisili(e.target.value);
                          },
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className="w-full"
                            isClearable
                            instanceId={uuid}
                            options={listKecamatanDomisili}
                          />
                        )}
                      />
                    </div>
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">Kelurahan Domisili</span>
                      </div>
                      <Controller
                        name="kelurahanDomisili"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isClearable
                            className="w-full"
                            instanceId={uuid}
                            options={listKelurahanDomisili}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2 gap-2">
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">Kota / Kab Domisili</span>
                      </div>
                      <Controller
                        name="kotaDomisili"
                        control={control}
                        rules={{
                          onChange: (e) => {
                            onChangeKotaDomisili(e.target.value);
                          },
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isClearable
                            className="w-full"
                            instanceId={uuid}
                            options={listKotaDomisili}
                          />
                        )}
                      />
                    </div>
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">RT / RW Domisili </span>
                      </div>
                      <div className="flex gap-2 w-full">
                        <input
                          type="number"
                          {...register("rtDomisili")}
                          className="input input-primary w-full input-sm"
                        />
                        <input
                          type="number"
                          {...register("rwDomisili")}
                          className="input input-primary w-full input-sm"
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <div className="label w-1/3">
                        <span className="label-text">Kode Pos Domisili</span>
                      </div>
                      <input
                        type="text"
                        {...register("kodePosDomisili")}
                        className="input input-primary w-full input-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {session?.user.role !== "tester" && (
              <button
                type="submit"
                className="btn btn-sm btn-primary btn-block"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddPasien;
