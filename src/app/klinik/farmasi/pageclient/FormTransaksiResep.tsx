"use client";

import { useEffect, useId, useState } from "react";
import { ListResepInterface } from "../interface/typeListResep";
import AsyncSelect from "react-select/async";
import {
  getApiBisnisOwner,
  postApiBisnisOwner,
} from "@/app/lib/apiBisnisOwner";
import { ObatInterface } from "../../cppt/interface/typeFormResep";
import { Session } from "next-auth";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { getTransaksiFarmasi } from "./getTransaksi";
import ModalPrintBillFarmasi from "./ModalPrintBillFarmasi";
import { CetakBill } from "../interface/cetakBill";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const FormTransaksiResep = ({
  data,
  session,
  soap,
  pendaftaranId,
  pasien,
}: {
  data: ListResepInterface[] | null;
  session: Session | null;
  soap: any;
  pendaftaranId: number;
  pasien: any;
}) => {
  const [listResep, setListResep] = useState<ListResepInterface[] | null>(null);
  const [obat, setObat] = useState<ObatInterface>({});
  const [btnSimpan, setBtnSimpan] = useState(false);
  const [isObatSelected, setIsObatSelected] = useState(false);
  const [billFarmasi, setBillFarmasi] = useState<CetakBill>();
  const uuid = useId();
  const route = useRouter();

  useEffect(() => {
    if (data) {
      setListResep([...data]);
    }
  }, [data, btnSimpan]);

  const optionCariObat = (inputValue: string) =>
    new Promise<[]>((resolve) => {
      setTimeout(() => {
        resolve(findObat(inputValue));
      }, 1000);
    });

  const findObat = async (inputValue: string) => {
    if (inputValue.length >= 2) {
      const apiRes = await getApiBisnisOwner({
        url: `master-barang?wfid=${session?.user.wfid}&search=${inputValue}`,
      });
      const list = apiRes.data.data.map((item: any) => {
        return {
          value: item.barang_id,
          label: `${item.barang.nama_barang} (${item.barang.satuan})`,
          satuan: item.barang.satuan,
          harga_jual: item.barang.harga_jual,
          stok: item.stok,
        };
      });
      return list;
    } else {
      const apiRes = await getApiBisnisOwner({
        url: `master-barang?wfid=${session?.user.wfid}`,
      });
      const list = apiRes.data.data.map((item: any) => {
        return {
          value: item.barang_id,
          label: `${item.barang.nama_barang} (${item.barang.satuan})`,
          satuan: item.barang.satuan,
          harga_jual: item.barang.harga_jual,
          stok: item.stok,
        };
      });
      return list;
    }
  };

  const onChangeObat = (e: any) => {
    if (e) {
      setObat({
        namaObat: e.label,
        obatId: e.value,
        satuan: e.satuan,
        harga_jual: e.harga_jual,
        stok: e.stok,
      });
      setIsObatSelected(true);
    } else {
      setIsObatSelected(false);
    }
  };

  const onAddResep = () => {
    const resepBaru: ListResepInterface = {
      id: Math.random(),
      namaObat: obat.namaObat,
      obatId: obat.obatId,
      satuan: obat.satuan,
      jumlah: 0,
      signa1: "",
      signa2: "",
      aturanPakai: "",
      waktu: "",
      catatan: "",
      hargaJual: obat.harga_jual,
      sOAPId: Number(soap.id),
      createdAt: new Date(),
      updatedAt: new Date(),
      stok: obat.stok,
    };
    if (listResep) {
      setListResep([...listResep, resepBaru]);
    } else {
      setListResep([resepBaru]);
    }
  };

  const onDeleteResep = (id: number) => {
    if (listResep) {
      const filter = listResep.filter((i) => i.id !== id);
      setListResep([...filter]);
    }
  };
  const onClickSimpan = async () => {
    setBtnSimpan(!btnSimpan);

    const list = listResep?.map((item) => ({
      ...item,
      total: Number(item.hargaJual) * Number(item.jumlah),
      pendaftaranId: pendaftaranId,
    }));

    const listToApi = listResep?.map((item) => ({
      barang_id: item.obatId,
      nama_obat: item.namaObat,
      qty: item.jumlah,
    }));

    const bodyToPost = {
      barang: listToApi,
      wfid: session?.user.wfid,
    };

    // Show confirmation alert
    const postApi = await Swal.fire({
      title: "Yakin?",
      text: "Apakah anda yakin ingin menyimpan transaksi ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Iya",
      cancelButtonText: "Tidak",
    });

    if (!postApi.isConfirmed) {
      // If user cancels, exit the function
      return;
    }

    try {
      // First API call
      const hitApi = await postApiBisnisOwner({
        url: "decrease-stock",
        data: bodyToPost,
      });

      if (!hitApi.status) {
        ToastAlert({ icon: "error", title: hitApi.message });
        return;
      }

      // Second API call
      const response = await fetch(
        `/api/resep/add?idsoap=${soap.id}&idpendaftaran=${pendaftaranId}`,
        {
          method: "POST",
          body: JSON.stringify(list),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        // Error toast if the second API call fails
        ToastAlert({ icon: "error", title: "Gagal simpan data!" });
        return;
      }

      // Success toast for the second API call
      ToastAlert({ icon: "success", title: "Berhasil!" });
      route.refresh(); // Refresh route on successful post
    } catch (error: any) {
      console.log(error);
      ToastAlert({
        icon: "error",
        title:
          typeof error.message === "string"
            ? error.message
            : "Terjadi kesalahan!",
      });
    }
  };

  const onChangeText = (e: any, jenisInput: string, id?: number) => {
    if (e) {
      if (listResep) {
        const findIndex = listResep?.findIndex((item) => item.id === id);
        if (jenisInput === "jumlah") {
          listResep[findIndex].jumlah = Number(e);
        } else if (jenisInput === "signa1") {
          listResep[findIndex].signa1 = e;
        } else if (jenisInput === "signa2") {
          listResep[findIndex].signa2 = e;
        } else if (jenisInput === "aturanPakai") {
          listResep[findIndex].aturanPakai = e;
        } else if (jenisInput === "waktu") {
          listResep[findIndex].waktu = e;
        } else {
          listResep[findIndex].catatan = e;
        }
      }
    }
  };

  const cetakBill = async () => {
    const getDb: any = await getTransaksiFarmasi(pendaftaranId);
    if (getDb.status) {
      ToastAlert({ icon: "success", title: "Berhasil!" });
      setBillFarmasi(getDb);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const modal: any = document?.getElementById("modal-print-bill-farmasi");
      modal.showModal();
    } else {
      ToastAlert({ icon: "error", title: "Gagal ambil data!" });
    }
  };

  return (
    <div className="flex flex-col">
      {session?.user.role !== "admin" && (
        <table className="table table-sm table-zebra mb-8">
          <thead className="bg-base-200">
            <tr>
              <th colSpan={2}>Tambah Obat Baru</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-info">
              <td>
                <div className="flex items-center">
                  <AsyncSelect
                    className="select-info w-full"
                    required
                    isClearable
                    name="obat"
                    loadOptions={optionCariObat}
                    defaultOptions
                    onChange={(e) => onChangeObat(e)}
                    placeholder="Cari obat"
                    instanceId={uuid}
                  />
                  {session?.user.role !== "tester" &&
                    session?.user.role !== "admin" && (
                      <div
                        className="tooltip tooltip-left w-20"
                        data-tip="Tambah Resep"
                      >
                        <button
                          className="btn btn-sm btn-circle btn-primary"
                          disabled={!isObatSelected}
                          onClick={() => onAddResep()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="size-4"
                          >
                            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                          </svg>
                        </button>
                      </div>
                    )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <table className="table table-sm table-zebra">
        <thead className="bg-base-200">
          <tr>
            <th>No</th>
            <th>Nama Obat</th>
            <th>Jumlah</th>
            <th>Satuan</th>
            <th>Signa 1</th>
            <th></th>
            <th>Signa 2</th>
            <th>Aturan</th>
            <th>Waktu</th>
            <th>Catatan</th>
            {session?.user.role !== "admin" &&
              session?.user.role !== "tester" && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {listResep?.map((i, index) => {
            return (
              <tr key={i.obatId}>
                <td>{index + 1}</td>
                <td>
                  <div className="font-bold">
                    {i?.namaObat?.toString() || "Unknown Obat"}
                  </div>
                  <div className="text-sm opacity-50">
                    Stok: {i?.stok ?? "N/A"}
                  </div>
                </td>
                <td>
                  <input
                    type="text"
                    onChange={(e) =>
                      onChangeText(e.target.value, "jumlah", i.id)
                    }
                    className="input input-sm input-primary w-14"
                    defaultValue={i.jumlah?.toString()}
                  />
                </td>
                <td>{i.satuan}</td>
                <td>
                  <input
                    type="text"
                    onChange={(e) =>
                      onChangeText(e.target.value, "signa1", i.id)
                    }
                    className="input input-sm input-primary w-14"
                    defaultValue={i.signa1?.toString()}
                  />
                </td>
                <td>X</td>
                <td>
                  <input
                    type="text"
                    onChange={(e) =>
                      onChangeText(e.target.value, "signa2", i.id)
                    }
                    className="input input-sm input-primary w-14"
                    defaultValue={i.signa2?.toString()}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    onChange={(e) =>
                      onChangeText(e.target.value, "aturanPakai", i.id)
                    }
                    className="input input-sm input-primary w-40"
                    defaultValue={i.aturanPakai?.toString()}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    onChange={(e) =>
                      onChangeText(e.target.value, "waktu", i.id)
                    }
                    className="input input-sm input-primary w-32"
                    defaultValue={i.waktu?.toString()}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    onChange={(e) =>
                      onChangeText(e.target.value, "catatan", i.id)
                    }
                    className="input input-sm input-primary w-32"
                    defaultValue={i.catatan?.toString()}
                  />
                </td>
                {session?.user.role !== "admin" &&
                  session?.user.role !== "tester" && (
                    <td className="tooltip tooltip-left" data-tip="Hapus Resep">
                      <button
                        onClick={() => onDeleteResep(Number(i.id))}
                        className="btn btn-xs btn-error btn-circle "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                        </svg>
                      </button>
                    </td>
                  )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {soap.isBillingFarmasi ? (
        <div className="flex flex-col gap-3 mt-5">
          <button className="btn btn-error btn-sm">SUDAH TRANSAKSI</button>
          <button className="btn btn-info btn-sm" onClick={() => cetakBill()}>
            CETAK BILL
          </button>
        </div>
      ) : (
        session?.user.role !== "admin" &&
        session?.user.role !== "tester" && (
          <button
            onClick={() => onClickSimpan()}
            className="btn btn-primary btn-sm mt-10"
          >
            SIMPAN TRANSAKSI
          </button>
        )
      )}
      <ModalPrintBillFarmasi billFarmasi={billFarmasi} pasien={pasien} />
    </div>
  );
};

export default FormTransaksiResep;
