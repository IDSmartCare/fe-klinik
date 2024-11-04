"use client";

import ButtonModalComponent, {
  icon,
} from "@/app/components/ButtonModalComponent";
import { useEffect, useId, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { typeFormPoliklinik } from "../../paramedis/poliklinik/interface/typeFormPoliklinik";
import { Session } from "next-auth";
import { FormAddUser } from "../interface/typeFormUser";
import { checkUserExistsByRole, createUser } from "./simpanUser";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { postApiBisnisOwner } from "@/app/lib/apiBisnisOwner";
import { useRouter } from "next/navigation";

const ModalAddUser = ({ session }: { session: Session | null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
  } = useForm<FormAddUser>();
  const uuid = useId();
  const route = useRouter();
  const [showFieldDokter, setShowFieldDokter] = useState(false);
  const [option, setOption] = useState<any[]>([]);

  useEffect(() => {
    async function getListPoli() {
      const getRes = await fetch(
        `/api/paramedis/findallpoli?idFasyankes=${session?.user.idFasyankes}`
      );
      if (!getRes.ok) {
        setOption([]);
        return;
      }
      const data = await getRes.json();
      const newArr = data.map((item: typeFormPoliklinik) => {
        return {
          label: item.namaPoli,
          value: item.id,
        };
      });
      setOption([...newArr]);
    }
    getListPoli();
  }, [session?.user.idFasyankes]);
  const onSubmit: SubmitHandler<FormAddUser> = async (data) => {
    // Jika package FREE, lakukan pengecekan hanya untuk role yang dipilih
    if (session?.user.package === "FREE") {
      const roleToAdd = data.role.value; // Ambil role yang ingin ditambahkan

      // Cek apakah sudah ada user untuk role yang dipilih
      const existingUser = await checkUserExistsByRole(
        roleToAdd,
        session?.user.idFasyankes
      );

      // Batasi setiap role untuk hanya memiliki satu user
      if (existingUser >= 1) {
        return ToastAlert({
          icon: "error",
          title: `Paket FREE hanya mengizinkan 1 pengguna untuk role ${data.role.label}.`,
        });
      }
    } else if (session?.user.package === "plus") {
      const roleToAdd = data.role.value; // Ambil role yang ingin ditambahkan

      // Cek apakah sudah ada user untuk role yang dipilih
      const existingUser = await checkUserExistsByRole(
        roleToAdd,
        session?.user.idFasyankes
      );

      // Batasi setiap role untuk hanya memiliki satu user
      if (existingUser >= 4) {
        return ToastAlert({
          icon: "error",
          title: `Paket PLUS hanya mengizinkan 4 pengguna untuk role ${data.role.label}.`,
        });
      }
    }

    // Jika tidak ada pembatasan atau role belum mencapai limit, lanjutkan dengan proses penambahan pengguna
    const post = await createUser(data, session?.user.idFasyankes);
    if (post.status) {
      const body = {
        username: data.username,
        password: data.password,
        password_confirmation: data.confirmPassword,
        created_by: data.createdBy,
        role: data.role.value,
        fasyankes_id: session?.user.idFasyankes,
        id_profile: post.data?.id,
      };
      const posttoApi = await postApiBisnisOwner({
        url: "access-fasyankes/store",
        data: body,
      });
      if (posttoApi.status) {
        ToastAlert({ icon: "success", title: posttoApi.message as string });
        reset();
        setTimeout(() => route.refresh(), 1000);
      } else {
        ToastAlert({ icon: "error", title: "Gagal Menambahkan User" });

        // Set API errors on specific fields
        if (posttoApi.errors) {
          Object.keys(posttoApi.errors).forEach((field) => {
            setError(field as keyof FormAddUser, {
              type: "api",
              message: posttoApi.errors[field],
            });
          });
        }
      }
    } else {
      ToastAlert({ icon: "error", title: "Gagal Menambahkan User" });
    }
  };

  const onChangeRole = (e: any) => {
    if (e.target.value) {
      const val = e.target.value;
      if (val.value === "dokter") {
        setShowFieldDokter(true);
      } else {
        setShowFieldDokter(false);
      }
    }
  };
  return (
    <div className="self-end">
      <ButtonModalComponent
        icon={icon.add}
        modalname="add-user"
        title="User Baru"
      />
      <dialog id="add-user" className="modal">
        <div className="modal-box w-8/12 max-w-3xl h-screen">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Tambah User Baru</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-5"
          >
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                {...register("username", {
                  required: "*Tidak boleh kosong",
                })}
                className="input input-primary w-full input-sm"
              />
              {errors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.username.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                {...register("password", { required: "*Tidak boleh kosong" })}
                className="input input-sm input-primary w-full "
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Password Confirm</span>
              </div>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "*Tidak boleh kosong",
                })}
                className="input input-sm input-primary w-full "
              />

              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Role</span>
              </div>
              <Controller
                name="role"
                control={control}
                rules={{
                  required: "*Tidak boleh kosong",
                  onChange: (e) => onChangeRole(e),
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    instanceId={uuid}
                    className="w-full"
                    isClearable
                    options={
                      session?.user.type === "Apotek"
                        ? [{ value: "kasir", label: "Kasir" }]
                        : [
                            { value: "admin", label: "Admin" },
                            { value: "admisi", label: "Pendaftaran" },
                            { value: "dokter", label: "Dokter" },
                            { value: "perawat", label: "Perawat" },
                            { value: "farmasi", label: "Farmasi" },
                            { value: "kasir", label: "Kasir" },
                          ]
                    }
                  />
                )}
              />
              {errors.role && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.role.message?.toString()}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Created By</span>
              </div>
              <input
                type="text"
                {...register("createdBy", { required: "*Tidak boleh kosong" })}
                className="input input-sm input-primary w-full "
              />
              {errors.createdBy && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.createdBy.message}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text">Nama Lengkap</span>
              </div>
              <input
                type="text"
                {...register("namaLengkap", {
                  required: "*Tidak boleh kosong",
                })}
                className="input input-sm input-primary w-full "
              />
              {errors.namaLengkap && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.namaLengkap.message}
                  </span>
                </label>
              )}
            </div>
            {showFieldDokter && (
              <>
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Pilih Poli Dokter</span>
                  </div>
                  <Controller
                    name="poliklinik"
                    control={control}
                    rules={{
                      required: "*Tidak boleh kosong", // Sets the field as mandatory
                    }}
                    render={({ field }) => (
                      <div className="form-control w-full">
                        <Select
                          {...field}
                          isClearable
                          placeholder="Pilih poli dokter"
                          instanceId={uuid}
                          options={option}
                        />
                        {errors.poliklinik && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.poliklinik.message}
                            </span>
                          </label>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Kode Dokter</span>
                  </div>
                  <input
                    type="text"
                    {...register("kodedokter", {
                      required: "*Tidak boleh kosong",
                    })}
                    className="input input-sm input-primary w-full "
                  />
                  {errors.kodedokter && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.kodedokter.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">STR</span>
                  </div>
                  <input
                    type="text"
                    {...register("str", { required: "*Tidak boleh kosong" })}
                    className="input input-sm input-primary w-full "
                  />
                  {errors.str && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.str.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">SIP</span>
                  </div>
                  <input
                    type="text"
                    {...register("sip", { required: "*Tidak boleh kosong" })}
                    className="input input-sm input-primary w-full "
                  />
                  {errors.sip && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.sip.message}
                      </span>
                    </label>
                  )}
                </div>
              </>
            )}
            {session?.user.role !== "tester" && (
              <button className="btn btn-primary btn-block btn-sm">
                Simpan
              </button>
            )}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ModalAddUser;
