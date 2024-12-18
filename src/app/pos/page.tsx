"use client";

import { useEffect, useRef, useState } from "react";
import { getApiBisnisOwner, postApiBisnisOwner } from "../lib/apiBisnisOwner";
import { useSession } from "next-auth/react";
import {
  PembelianInterface,
  StokBarangInterface,
} from "./interface/postInterface";
import { ToastAlert } from "../helper/ToastAlert";
import simpanPOS from "./actionSimpanPos";
import Link from "next/link";
import GetPosByGroupId from "./getPos";
import { TransaksiAfterSubmit } from "./interface/listAfterSubmit";
import ModalPrintBill from "./pageclient/ModalPrintBill";
import { formatRupiah, formatRupiahEdit } from "../helper/formatRupiah";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ModalPayment from "./pageclient/ModalPayment";
import { splitName } from "../helper/SplitName";

const PagePos = () => {
  const { data } = useSession();
  const [barang, setBarang] = useState<StokBarangInterface[]>([]);
  const [pembelian, setPembelian] = useState<PembelianInterface[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [biayaLain, setBiayaLain] = useState("");
  const [pajak, setPajak] = useState("");
  const [diskon, setDiskon] = useState("");
  const [kembalian, setKembalian] = useState(0);
  const [hargaDiskon, setHargaDiskon] = useState(0);
  const [hargaPajak, setHargaPajak] = useState(0);
  const [bayar, setBayar] = useState("");
  const [email, setEmail] = useState("");
  const [hpPelanggan, setHpPelanggan] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [jenisDiskon, setJenisDiskon] = useState("");
  const [srcPayment, setSrcPayment] = useState<string>("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isEditing, setIsEditing] = useState(false);
  const [resAfterSubmit, setResAfterSubmit] = useState<
    TransaksiAfterSubmit | null | undefined
  >();
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const paymentTypes: Record<number, string> = {
    0: "QRIS",
    1: "Virtual Account",
    2: "Debit",
    3: "Cash",
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [groupIdBayar, setGroupIdBayar] = useState("");
  const router = useRouter();

  const getApiBarang = async (search: string) => {
    const wfid = data?.user.wfid;
    if (!wfid) return;

    const apiRes = await getApiBisnisOwner({
      url: `master-barang?wfid=${wfid}&search=${search}`,
    });

    setBarang(apiRes?.data?.data);
  };

  useEffect(() => {
    if (data?.user?.wfid) {
      getApiBarang(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user, debouncedSearch, search]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Allow all origins during development (use specific domain in production)
      if (event.data?.success === true) {
        setSuccess(true);
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    const handleSuccess = async () => {
      if (!success) return;

      const modal: any = document.getElementById("modal-payment");
      modal?.close();

      try {
        const post = await simpanPOS(
          pembelian,
          {
            namaPelanggan,
            emailPelanggan: email.trim() === "" ? "noemail@gmail.com" : email,
            groupTransaksiId: groupIdBayar,
            hpPelanggan,
            diskonInvoice: hargaDiskon.toString(),
            pajak: hargaPajak.toString(),
            biayaLainnya: biayaLain ?? "0",
            kategoriBayar: paymentTypes[selectedPayment ?? 3],
            subTotal: subTotal.toString(),
            total: total.toString(),
            totalBayar: bayar,
          },
          data?.user?.idFasyankes,
          data?.user?.package
        );

        if (post.status) {
          const bodyToPost2 = {
            barang: pembelian.map((item) => ({
              barang_id: item.barang_id,
              nama_obat: item.nama_barang,
              qty: item.qty,
            })),
            wfid: data?.user?.wfid,
          };

          const postApi = await postApiBisnisOwner({
            url: "decrease-stock",
            data: bodyToPost2,
          });

          if (!postApi.status) {
            ToastAlert({ icon: "error", title: postApi.message });
            return;
          }
          await getApiBarang(search);

          ToastAlert({ icon: "success", title: "Berhasil" });

          setPembelian([]);
          subTotalCalculate([]);
          setBiayaLain("");
          setEmail("");
          setHpPelanggan("");
          setNamaPelanggan("");
          setGroupIdBayar("");
          setSelectedPayment(null);
          setSuccess(false);
          router.refresh();

          const getDataAfterSubmit = (await GetPosByGroupId(
            groupIdBayar
          )) as any;
          setResAfterSubmit(getDataAfterSubmit.data);

          setTimeout(() => {
            const modalPrint: any = document?.getElementById("modal-pos-print");
            modalPrint?.show();
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        ToastAlert({ icon: "error", title: "An error occurred" });
      }
    };

    handleSuccess();

    return () => {
      window.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const payment = [
    { name: "QRIS", icon: "/QR.png" },
    { name: "Virtual Account", icon: "/bank.png" },
    { name: "Debit Card", icon: "/debit.png" },
    { name: "Cash", icon: "/cash.png" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onClickTambah = (barang: StokBarangInterface) => {
    const existingItem = pembelian.find(
      (item) => item.barang_id === barang.barang_id
    );
    if (existingItem) {
      const updatedItems = pembelian.map((item) => {
        if (item.barang_id === barang.barang_id) {
          let totalDiskon = 0;
          if (barang.diskon?.percent_disc) {
            const diskon =
              Number(barang.barang.harga_jual) *
              (Number(barang.diskon.percent_disc) / 100);
            const subTotal = Number(barang.barang.harga_jual) - diskon;
            totalDiskon = subTotal;
          } else {
            totalDiskon =
              Number(barang.barang.harga_jual) -
              Number(barang.diskon?.amount_disc)
                ? Number(barang.barang.harga_jual) -
                  Number(barang.diskon?.amount_disc)
                : Number(barang.barang.harga_jual);
          }
          return {
            ...item,
            qty: item.qty + 1,
            totalHarga: Number(item.qty + 1) * totalDiskon,
          };
        }
        return item;
      });
      setPembelian(updatedItems);
      subTotalCalculate(updatedItems);
    } else {
      let totalDiskon = 0;
      if (barang.diskon?.percent_disc) {
        const diskon =
          Number(barang.barang.harga_jual) *
          (Number(barang.diskon.percent_disc) / 100);
        const subTotal = Number(barang.barang.harga_jual) - diskon;
        totalDiskon = subTotal;
      } else {
        totalDiskon =
          Number(barang.barang.harga_jual) - Number(barang.diskon?.amount_disc)
            ? Number(barang.barang.harga_jual) -
              Number(barang.diskon?.amount_disc)
            : Number(barang.barang.harga_jual);
      }
      const addBarang: any = {
        barang_id: barang.barang_id,
        nama_barang: barang.barang.nama_barang,
        harga_jual: barang.barang.harga_jual,
        qty: 1,
        totalHarga: totalDiskon,
        diskonFromBo: barang.diskon?.amount_disc
          ? barang.diskon.amount_disc
          : barang.diskon?.percent_disc
          ? Number(barang.barang.harga_jual) *
            (Number(barang.diskon.percent_disc) / 100)
          : 0,
      };
      let allBarang = [...pembelian, addBarang];
      setPembelian([...pembelian, addBarang]);
      subTotalCalculate(allBarang);
    }
  };

  const subTotalCalculate = (pembelian: PembelianInterface[]) => {
    let subTotalNow = pembelian.reduce(
      (prev, next) => prev + next.totalHarga,
      0
    );
    setSubTotal(subTotalNow);
    setTotal(subTotalNow);
  };

  const onChangeBiayaLain = (e: string) => {
    const rawValue = e.replace(/[^0-9]/g, "");
    if (rawValue) {
      setBiayaLain(rawValue);
      calculatorTotal(Number(pajak), Number(rawValue), Number(diskon));
    } else {
      setBiayaLain("");
      calculatorTotal(Number(pajak), 0, Number(diskon));
    }
  };

  const onChangePajak = (e: string) => {
    if (/^\d*$/.test(e)) {
      setPajak(e);
      calculatorTotal(Number(e), Number(biayaLain), Number(diskon));
    } else {
      setPajak("");
      calculatorTotal(0, Number(biayaLain), Number(diskon));
    }
  };

  const onChangeDiskon = (e: string) => {
    const rawValue = e.replace(/[^\d]/g, "");
    if (jenisDiskon === "rp") {
      setDiskon(formatRupiahEdit(rawValue));
      calculatorTotal(Number(pajak), Number(biayaLain), Number(rawValue));
    } else if (jenisDiskon === "percent" && rawValue.length <= 2) {
      setDiskon(rawValue);
      calculatorTotal(Number(pajak), Number(biayaLain), Number(rawValue));
    }
  };

  const handleRadioChange = (e: string) => {
    setJenisDiskon(e);

    setDiskon("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    calculatorTotal(Number(pajak), Number(biayaLain), 0);
  };

  const calculatorTotal = (
    pajak: number,
    biayalain: number,
    diskon: number
  ) => {
    let discountAmount = 0;
    let total = subTotal;
    let taxAmount = total * (pajak / 100);
    setHargaPajak(taxAmount);
    total = subTotal + taxAmount;
    if (jenisDiskon === "percent") {
      discountAmount = total * (diskon / 100);
      setHargaDiskon(discountAmount);
    } else {
      discountAmount = diskon;
      setHargaDiskon(diskon);
    }
    let newTotal = total - discountAmount + Number(biayalain);
    setTotal(newTotal);
  };

  const onBayar = async () => {
    if (selectedPayment == null) {
      ToastAlert({ icon: "error", title: "Silahkan pilih metode pembayaran!" });
      return;
    }
    const requiredFields = [
      { value: namaPelanggan, message: "Silahkan isi nama pelanggan!" },
      { value: hpPelanggan, message: "Silahkan isi no hp pelanggan!" },
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        ToastAlert({ icon: "error", title: field.message });
        return;
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() !== "" && !emailPattern.test(email)) {
      ToastAlert({
        icon: "error",
        title: "Email tidak valid!",
      });
      return;
    }

    if (hpPelanggan.length < 13 || hpPelanggan.length > 15) {
      ToastAlert({
        icon: "error",
        title: "Nomor HP tidak valid!",
      });
      return false;
    }

    if (selectedPayment === 2 || selectedPayment === 3) {
      const modal: HTMLDialogElement | null = document?.getElementById(
        "modal-pos"
      ) as HTMLDialogElement;
      modal?.showModal();
    } else if (selectedPayment === 0 || selectedPayment === 1) {
      const { firstName, lastName } = splitName(namaPelanggan);
      try {
        let groupId = new Date().valueOf().toString();

        const bodyToPost = {
          orderId: groupId,
          email: email.trim() === "" ? "noemail@gmail.com" : email,
          firstName,
          lastName,
          mobilePhone: hpPelanggan.replace(/^0/, "+62"),
          amount: total,
          description: "Bayar Obat",
        };

        const apiPayment = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyToPost),
        });

        if (!apiPayment.ok) {
          ToastAlert({ icon: "error", title: "Payment failed" });
          return;
        }

        const dataAPI = await apiPayment.json();
        setSrcPayment(dataAPI.response.redirecturl);

        const modal: any = document?.getElementById("modal-payment");
        modal?.showModal();
        setGroupIdBayar(groupId);
      } catch (error) {
        console.error(error);
        ToastAlert({ icon: "error", title: "An error occurred" });
      }
    }

    setBayar("");
    setKembalian(0);
  };

  const onSubmitData = async (e: any) => {
    e.preventDefault();
    let groupId = new Date().valueOf().toString();
    const listToApi = pembelian?.map((item) => {
      return {
        barang_id: item.barang_id,
        nama_obat: item.nama_barang,
        qty: item.qty,
      };
    });

    const bodyToPost = {
      barang: listToApi,
      wfid: data?.user.wfid,
    };

    if (Number(bayar) < total) {
      ToastAlert({ icon: "error", title: "Pembayaran tidak boleh kurang" });
      return;
    }
    const post = await simpanPOS(
      pembelian,
      {
        namaPelanggan,
        emailPelanggan: email,
        groupTransaksiId: groupId,
        hpPelanggan,
        diskonInvoice: hargaDiskon.toString(),
        pajak: hargaPajak.toString(),
        biayaLainnya: biayaLain ?? "0",
        kategoriBayar: paymentTypes[selectedPayment ?? 3],
        subTotal: subTotal.toString(),
        total: total.toString(),
        totalBayar: bayar,
      },
      data?.user.idFasyankes,
      data?.user.package
    );
    if (post.status) {
      const postApi = await postApiBisnisOwner({
        url: "decrease-stock",
        data: bodyToPost,
      });

      if (!postApi.status) {
        ToastAlert({ icon: "error", title: postApi.message });
        return;
      }

      ToastAlert({ icon: "success", title: post.message as string });
      router.refresh();
      const modal: any = document?.getElementById("modal-pos");
      modal.close();
      setPembelian([]);
      subTotalCalculate([]);
      setBiayaLain("");
      setEmail("");
      setHpPelanggan("");
      setNamaPelanggan("");
      setSelectedPayment(null);
      await getApiBarang(search);
      const getDataAfterSubmit = await GetPosByGroupId(groupId);
      setResAfterSubmit(getDataAfterSubmit.data as any);
      setTimeout(() => {
        const modal: any = document?.getElementById("modal-pos-print");
        modal?.show();
      }, 2000);
    } else {
      ToastAlert({ icon: "error", title: post.message as string });
    }
  };

  const onDeletePembelian = (idbarang: string) => {
    const list = pembelian.filter((item) => item.barang_id !== idbarang);
    subTotalCalculate(list);
    setPembelian(list);
  };

  const onChangePembayaran = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setBayar(numericValue);
    setKembalian(Number(numericValue) - total);
  };

  const handleHpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value === "") {
      setHpPelanggan(value);
      return;
    }

    if (value.startsWith("0")) {
      value = "+62" + value.slice(1);
    } else if (!value.startsWith("+62") && value.length > 0) {
      value = "+62";
    }

    if (value.length > 14) return;

    if (value.startsWith("+620")) {
      value = value.slice(0, 3); // Potong string jika ada angka 0 setelah +62
    }

    setHpPelanggan(value);
  };
  return (
    <div className="flex gap-2 flex-col p-2">
      <Link href={"/klinik"}>
        <button className="btn btn-sm btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z"
              clipRule="evenodd"
            />
          </svg>
          Kembali
        </button>
      </Link>
      <div role="alert" className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>POS Penjualan Obat</span>
      </div>
      <div className="flex gap-2">
        <div className="w-2/3 h-full flex flex-col min-h-screen p-2">
          <input
            type="text"
            placeholder="Cari obat"
            className="input input-primary w-full join-item"
            value={search}
            onChange={handleSearchChange}
          />
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Harga</th>
                  <td>Diskon</td>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {barang?.map((item) => {
                  const existingItem = pembelian.find(
                    (pembelianItem) =>
                      pembelianItem.barang_id === item.barang_id
                  );
                  const isOutOfStock = existingItem
                    ? existingItem.qty >= item.stok
                    : false;

                  return (
                    <tr key={item?.barang_id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-bold">
                              {item?.barang?.nama_barang || "Unknown Name"}
                            </div>
                            <div className="text-sm opacity-50">
                              Stok: {item?.stok ?? "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {item?.barang?.harga_jual
                          ? new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(Number(item.barang.harga_jual))
                          : "Unknown Price"}
                      </td>
                      <td>
                        {item?.diskon
                          ? item.diskon.type === "Percentage"
                            ? `${item.diskon.percent_disc}%`
                            : new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(Number(item.diskon.amount_disc))
                          : "No Discount"}
                      </td>
                      <th>
                        <button
                          onClick={() => onClickTambah(item)}
                          className="btn btn-primary"
                          disabled={isOutOfStock || item?.stok === 0}
                        >
                          Tambah
                        </button>
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-1/3">
          <div className="flex flex-col bg-base-200 min-h-screen p-2 gap-2">
            <p className="text-xl font-medium">Biodata Pasien</p>
            <div className="flex items-center justify-between">
              <p className="font-medium label-text">
                Nama <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={namaPelanggan}
                onChange={(e) => setNamaPelanggan(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium label-text">
                No HP <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={hpPelanggan}
                onChange={handleHpChange}
                placeholder="+628xxxxxxxxx"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium label-text">
                Email <span className="text-primary">(Opsional)</span>
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="divider"></div>
            <table className="table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>QTY</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pembelian?.map((item) => {
                  return (
                    <tr key={item.barang_id}>
                      <td>
                        <div>
                          <div className="font-bold">{item.nama_barang}</div>
                        </div>
                      </td>
                      <td>{item.qty}</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(Number(item.totalHarga))}
                      </td>
                      <td>
                        <button
                          className="btn btn-circle btn-error"
                          onClick={() => onDeletePembelian(item.barang_id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="size-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="divider"></div>
            <div className="flex flex-col gap-2">
              <p className="text-xl font-medium">Rincian Pembayaran</p>
              <div className="flex items-center justify-between">
                <p className="font-medium label-text">Sub Total</p>
                <input
                  type="text"
                  value={formatRupiah(subTotal)}
                  readOnly
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium label-text">Pajak %</p>
                <input
                  type="text"
                  maxLength={2}
                  value={pajak}
                  onChange={(e) => onChangePajak(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium label-text">Diskon</p>
                <p>%</p>
                <input
                  type="radio"
                  className="radio radio-primary"
                  onChange={() => handleRadioChange("percent")}
                  name="diskon"
                  value={"percent"}
                />
                <p>Rp.</p>
                <input
                  type="radio"
                  className="radio radio-primary"
                  onChange={() => handleRadioChange("rp")}
                  name="diskon"
                  value={"rp"}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={
                    jenisDiskon === "percent"
                      ? diskon
                      : formatRupiahEdit(diskon)
                  }
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  maxLength={jenisDiskon === "percent" ? 2 : undefined}
                  onChange={(e) => onChangeDiskon(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium label-text">Biaya Lainnya</p>
                <input
                  type="text"
                  value={formatRupiahEdit(biayaLain)}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  onChange={(e) => onChangeBiayaLain(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className="divider"></div>
              {data?.user.role !== "admin" && data?.user.role !== "tester" && (
                <>
                  <p className="text-xl font-medium">Metode Pembayaran</p>
                  <div className="flex justify-center gap-2">
                    {payment.map((pm, index) => {
                      const isSelectedPayment = selectedPayment === index;

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedPayment(index)}
                          className={`flex flex-col items-center justify-center w-40 h-32
                      } border-2 rounded-lg transition-all duration-300 px-2 ${
                        isSelectedPayment
                          ? "bg-primary border-primary text-white"
                          : "bg-gray-100 border-primary text-black"
                      } hover:shadow-lg hover:scale-105 cursor-pointer`}
                        >
                          <Image
                            src={pm.icon}
                            alt={pm.name}
                            width={100}
                            height={80}
                            className={`${
                              pm.name === "QRIS" ? "w-16 h-8" : "w-[48px] h-10"
                            } mb-3 ${isSelectedPayment ? "filter invert" : ""}`}
                          />
                          <span
                            className={`text-sm text-center ${
                              isSelectedPayment ? "text-white" : "text-black"
                            }`}
                          >
                            {pm.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={() => onBayar()}
                      disabled={total === 0}
                      className="btn btn-info btn-block"
                    >
                      BAYAR{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(total))}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <dialog id="modal-pos" className="modal">
        <div className="modal-box w-4/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form className="flex flex-col gap-2" onSubmit={onSubmitData}>
            <div className="flex items-center">
              <p className="w-1/3">Total</p>
              <input
                type="text"
                readOnly
                value={formatRupiah(total)}
                className="input input-primary"
              />
            </div>
            <div className="flex items-center">
              <p className="w-1/3">Bayar</p>
              <input
                type="text"
                required
                value={formatRupiahEdit(bayar)}
                name="bayar"
                onChange={onChangePembayaran}
                autoFocus
                className="input input-primary"
              />
            </div>
            <div className="flex items-center">
              <p className="w-1/3">Kembali</p>
              <input
                type="text"
                value={formatRupiah(kembalian)}
                readOnly
                className="input input-primary"
              />
            </div>
            {data?.user.role !== "admin" && data?.user.role !== "tester" && (
              <button type="submit" className="btn btn-info">
                BAYAR
              </button>
            )}
          </form>
        </div>
      </dialog>
      <ModalPrintBill data={resAfterSubmit} />
      <ModalPayment src={srcPayment} />
    </div>
  );
};

export default PagePos;
