"use client";

import ButtonModalComponent, {
  icon,
} from "@/app/components/ButtonModalComponent";
import { useId, useState, useRef, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { Session } from "next-auth";
import { AddMasterTarif } from "../interface/typeFormAddTarif";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { useRouter } from "next/navigation";
import { formatRupiahEdit } from "@/app/helper/formatRupiah";

const ModalAddMasterTarif = ({ session }: { session: Session | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
    setValue,
    watch,
  } = useForm<AddMasterTarif>();
  const uuid = useId();
  const route = useRouter();
  const [rawHargaTarif, setRawHargaTarif] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);
  // const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [selectedAsuransi, setSelectedAsuransi] = useState<string | null>(null);
  const [showAsuransi, setShowAsuransi] = useState<string | null>(null);

  const [listDokter, setListDokter] = useState<any[]>([]);
  const [listAsuransi, setListAsuransi] = useState<any[]>([]);

  const selectedKategori = watch("kategoriTarif")?.value;

  useEffect(() => {
    if (selectedKategori !== "Dokter") {
      setValue("dokter", null);
    } else {
      setValue("namaTarif", null);
    }
  }, [selectedKategori, setValue]);

  useEffect(() => {
    async function getDokter() {
      const getApi = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/dokter/listdokter/${session?.user.idFasyankes}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      if (!getApi.ok) {
        setListDokter([]);
        return;
      }
      const data = await getApi.json();
      const newData = data.data?.map((item: any) => {
        return {
          label: `${item.name} - ${item.unit}`,
          value: item.id,
        };
      });
      setListDokter(newData);
    }
    getDokter();
  }, [session?.user.idFasyankes]);

  useEffect(() => {
    async function getAsuransi() {
      const getApi = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/masterasuransi/${session?.user.idFasyankes}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      if (!getApi.ok) {
        setListAsuransi([]);
        return;
      }
      const data = await getApi.json();
      const newData = data.data?.map((item: any) => {
        return {
          label: item.namaAsuransi,
          value: item.id,
        };
      });
      setListAsuransi(newData);
    }
    getAsuransi();
  }, [session?.user.idFasyankes]);

  const onSubmit: SubmitHandler<AddMasterTarif> = async (data) => {
    if (data) {
      const body = {
        namaTarif: data.dokter?.label ?? data.namaTarif,
        kategoriTarif: data.kategoriTarif.value,
        doctorId: data.dokter?.value,
        hargaTarif: rawHargaTarif,
        penjamin: selectedAsuransi
          ? `ASURANSI ${selectedAsuransi}`
          : data.penjamin?.value || null,
        idFasyankes: session?.user.idFasyankes,
      };

      try {
        const posttoApi = await fetch("/api/mastertarif/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (posttoApi.ok) {
          ToastAlert({ icon: "success", title: "Berhasil Menambahkan Tarif" });
          reset();
          route.refresh();
          if (modalRef.current) {
            modalRef.current.close();
          }
        } else {
          const errorResponse = await posttoApi.json();
          ToastAlert({
            icon: "error",
            title: errorResponse.message || "Gagal Menambahkan Tarif",
          });

          if (errorResponse.errors) {
            Object.keys(errorResponse.errors).forEach((field) => {
              setError(field as keyof AddMasterTarif, {
                type: "api",
                message: errorResponse.errors[field],
              });
            });
          }
        }
      } catch (error: any) {
        // Handle fetch or unexpected errors
        ToastAlert({
          icon: "error",
          title: error.message || "Terjadi Kesalahan",
        });
        console.error(error);
      }
    } else {
      ToastAlert({ icon: "error", title: "Data tidak valid" });
    }
  };

  const handleHargaTarifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setRawHargaTarif(numericValue);
    e.target.value = formatRupiahEdit(numericValue);
  };

  return (
    <div className="self-end">
      <ButtonModalComponent
        icon={icon.add}
        modalname="add-master-tarif"
        title="Tambah Master Tarif"
      />
      <dialog id="add-master-tarif" className="modal" ref={modalRef}>
        <div className="modal-box w-8/12 max-w-3xl h-screen">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Tambah Master Tarif</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
          >
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Kategori Tarif</span>
              </div>
              <Controller
                name="kategoriTarif"
                control={control}
                rules={{
                  required: "*Tidak boleh kosong",
                }}
                render={({ field }) => (
                  <div className="form-control w-full">
                    <Select
                      {...field}
                      isClearable
                      placeholder="Pilih Kategori"
                      instanceId={uuid}
                      options={[
                        { value: "Admin", label: "Admin" },
                        { value: "Dokter", label: "Dokter" },
                        { value: "Layanan Injeksi", label: "Layanan Injeksi" },
                        {
                          value: "Layanan Perawatan Luka",
                          label: "Layanan Perawatan Luka",
                        },
                        {
                          value: "Layanan Terapi Infus",
                          label: "Layanan Terapi Infus",
                        },
                        {
                          value: "Layanan Pemeriksaan dan Diagnostik Cepat",
                          label: "Layanan Pemeriksaan dan Diagnostik Cepat",
                        },
                        {
                          value: "Layanan Tindakan Minor",
                          label: "Layanan Tindakan Minor",
                        },
                        {
                          value: "Layanan Ortopedi dan Fisioterapi",
                          label: "Layanan Ortopedi dan Fisioterapi",
                        },
                        {
                          value: "Layanan Dermatologi Ringan",
                          label: "Layanan Dermatologi Ringan",
                        },
                        {
                          value: "Layanan Kebersihan Medis",
                          label: "Layanan Kebersihan Medis",
                        },
                        {
                          value: "Layanan Penanganan Nyeri",
                          label: "Layanan Penanganan Nyeri",
                        },
                      ]}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                      }}
                    />
                    {errors.kategoriTarif && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.kategoriTarif.message}
                        </span>
                      </label>
                    )}
                  </div>
                )}
              />
            </div>
            {selectedKategori != "Dokter" && (
              <div className="form-control w-full">
                <div className="label">
                  <span className="label-text">Nama Tarif</span>
                </div>
                <input
                  type="text"
                  {...register("namaTarif", {
                    required: "*Tidak boleh kosong",
                  })}
                  className="input input-primary w-full input-sm"
                />
                {errors.namaTarif && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.namaTarif.message?.toString()}
                    </span>
                  </label>
                )}
              </div>
            )}

            {selectedKategori === "Dokter" && (
              <>
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Dokter</span>
                  </div>
                  <Controller
                    name="dokter"
                    control={control}
                    rules={{
                      required: "*Tidak boleh kosong",
                    }}
                    render={({ field }) => (
                      <div className="form-control w-full">
                        <Select
                          {...field}
                          isClearable
                          placeholder="Pilih Dokter"
                          instanceId={uuid}
                          options={listDokter}
                        />
                        {errors.dokter && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.dokter.message?.toString()}
                            </span>
                          </label>
                        )}
                      </div>
                    )}
                  />
                </div>
              </>
            )}

            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Nominal</span>
              </div>
              <input
                type="text"
                {...register("hargaTarif", {
                  required: "*Tidak boleh kosong",
                })}
                onChange={handleHargaTarifChange}
                className="input input-sm input-primary w-full"
                value={rawHargaTarif ? formatRupiahEdit(rawHargaTarif) : ""}
              />

              {errors.hargaTarif && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.hargaTarif.message}
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
                  required: "*Tidak boleh kosong",
                }}
                render={({ field }) => (
                  <div className="form-control w-full">
                    <Select
                      {...field}
                      isClearable
                      placeholder="Pilih Penjamin"
                      instanceId={uuid}
                      options={[
                        { value: "BPJS", label: "BPJS" },
                        { value: "PRIBADI", label: "PRIBADI" },
                        { value: "ASURANSI", label: "ASURANSI" },
                      ]}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                        setShowAsuransi(selectedOption?.value ?? null);
                        if (
                          ["BPJS", "PRIBADI", "ASURANSI"].includes(
                            selectedOption?.value
                          )
                        ) {
                          setValue("asuransi", null);
                          setSelectedAsuransi(null);
                        }
                      }}
                    />
                    {errors.penjamin && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.penjamin.message?.toString()}
                        </span>
                      </label>
                    )}
                  </div>
                )}
              />
            </div>
            {showAsuransi === "ASURANSI" && (
              <>
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Pilih Asuransi</span>
                  </div>
                  <Controller
                    name="asuransi"
                    control={control}
                    rules={{
                      required: "*Tidak boleh kosong",
                    }}
                    render={({ field }) => (
                      <div className="form-control w-full">
                        <Select
                          {...field}
                          isClearable
                          placeholder="Pilih Asuransi"
                          instanceId={uuid}
                          options={listAsuransi}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption);
                            setSelectedAsuransi(selectedOption?.label || null);
                          }}
                        />
                        {errors.dokter && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.dokter.message?.toString()}
                            </span>
                          </label>
                        )}
                      </div>
                    )}
                  />
                </div>
              </>
            )}

            {session?.user.role !== "tester" && (
              <button className="btn btn-primary btn-block btn-sm mt-3">
                Simpan
              </button>
            )}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddMasterTarif;
