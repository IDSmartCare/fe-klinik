"use client";

import { useEffect, useState } from "react";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { getBillingDetail } from "./getBilling";
import ModalPrintKwintansi from "./ModalPrintKwitansi";
import { useRouter } from "next/navigation";
import { formatRupiah, formatRupiahEdit } from "@/app/helper/formatRupiah";
import Image from "next/image";
import Select from "react-select";
import ModalPayment from "@/app/pos/pageclient/ModalPayment";
import { splitName } from "@/app/helper/SplitName";
import Swal from "sweetalert2";

const DetailBillPasien = ({ detailBill }: { detailBill: any }) => {
  const [discount, setDiscount] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [kembali, setKembali] = useState(0);
  const [bayar, setBayar] = useState(0);
  const [totalDiskon, setTotalDiskon] = useState(0);
  const [totalPajak, setTotalPajak] = useState(0);
  const [billData, setBillData] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const route = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [srcPayment, setSrcPayment] = useState<string>("");
  const payment = [
    { name: "QRIS", icon: "/QR.png" },
    { name: "Virtual Account", icon: "/bank.png" },
    { name: "Debit Card", icon: "/debit.png" },
    { name: "Cash", icon: "/cash.png" },
  ];
  const paymentTypes: Record<number, string> = {
    0: "QRIS",
    1: "Virtual Account",
    2: "Debit",
    3: "Cash",
  };
  const [success, setSuccess] = useState(false);

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

      try {
        const bodyToPost = {
          id: detailBill.id,
          pendaftaranId: detailBill.pendaftaranId,
          bayar: total,
          total,
          totalDiskon,
          totalPajak,
          kembali,
          tglBayar: new Date(),
          kategoriBayar: paymentTypes[selectedPayment ?? 3],
        };
        try {
          const postApi = await fetch(`/api/kasir/bayar`, {
            method: "POST",
            body: JSON.stringify(bodyToPost),
          });
          if (!postApi.ok) {
            ToastAlert({ icon: "error", title: "Gagal simpan data!" });
            return;
          }
          const modal: any = document?.getElementById("modal-payment");
          modal?.close();
          ToastAlert({ icon: "success", title: "Berhasil!" });
          setDiscount("");
          setTaxRate("");
          route.refresh();
        } catch (error: any) {
          ToastAlert({ icon: "error", title: error.message });
          console.log(error);
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

  useEffect(() => {
    setSubTotal(
      detailBill?.billPasienDetail.reduce(
        (prev: any, next: any) => Number(prev) + Number(next.subTotal),
        0
      )
    );
    setTotal(
      detailBill?.billPasienDetail.reduce(
        (prev: any, next: any) => Number(prev) + Number(next.subTotal),
        0
      )
    );
  }, [detailBill]);

  const onChangeDiskon = (e: string) => {
    if (/^\d*$/.test(e)) {
      setDiscount(e);
      calcuLatorInvoice(Number(e), Number(taxRate));
    } else {
      setDiscount("");
      calcuLatorInvoice(0, Number(taxRate));
    }
  };

  const onChangePajak = (e: string) => {
    if (/^\d*$/.test(e)) {
      setTaxRate(e);
      calcuLatorInvoice(Number(discount), Number(e));
    } else {
      setTaxRate("");
      calcuLatorInvoice(Number(discount), 0);
    }
  };
  const calcuLatorInvoice = (diskon: number, pajak: number) => {
    const discountAmount = subTotal * (diskon / 100);
    setTotalDiskon(discountAmount);
    const discountedSubtotal = subTotal - discountAmount;
    const taxAmount = discountedSubtotal * (pajak / 100);
    setTotalPajak(taxAmount);
    const newTotal = discountedSubtotal + taxAmount;
    setTotal(newTotal);
  };

  const onChangeBayar = (e: string) => {
    const rawValue = e.replace(/[^0-9]/g, "");
    const jml = rawValue;

    if (rawValue) {
      setBayar(Number(jml));
      const bayar = Number(jml) - total;
      setKembali(bayar);
    } else {
      setBayar(0);
      setKembali(0);
    }
  };

  const onClickBayar = async () => {
    if (selectedPayment === null) {
      ToastAlert({ icon: "error", title: "Pilih metode pembayaran!" });
      return;
    } else if (selectedPayment == 0 || selectedPayment == 1) {
      const { firstName, lastName } = splitName(
        detailBill.Pendaftaran?.episodePendaftaran?.pasien?.namaPasien
      );
      try {
        const bodyToPost = {
          orderId: detailBill.id,
          email: detailBill.Pendaftaran?.episodePendaftaran?.pasien?.email,
          firstName: firstName,
          lastName: lastName,
          mobilePhone:
            detailBill.Pendaftaran?.episodePendaftaran?.pasien?.noHp.replace(
              /^0/,
              "+62"
            ),
          amount: total,
          description: "Bayar Tagihan Pasien",
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
        console.log(dataAPI);
        setSrcPayment(dataAPI.response.redirecturl);

        const modal: any = document?.getElementById("modal-payment");
        modal?.showModal();
      } catch (error) {
        console.error(error);
        ToastAlert({ icon: "error", title: "An error occurred" });
      }
    } else if (selectedPayment == 2 || selectedPayment == 3) {
      if (selectedPayment === 3 && bayar === 0) {
        ToastAlert({ icon: "error", title: "Pembayaran harus diisi!" });
      } else if (selectedPayment === 3 && bayar <= total) {
        ToastAlert({
          icon: "error",
          title: "Pembayaran harus lebih besar/sama dengan total tagihan!",
        });
      } else {
        if (selectedPayment === 2) {
          const isConfirmed = await Swal.fire({
            title: "Konfirmasi Pembayaran",
            text: "Apakah Anda yakin ingin melanjutkan pembayaran?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, lanjutkan",
            cancelButtonText: "Batal",
          });

          if (!isConfirmed.isConfirmed) {
            return;
          }
        }

        const payloadForBayar = selectedPayment === 2 ? total : bayar;
        const bodyToPost = {
          id: detailBill.id,
          pendaftaranId: detailBill.pendaftaranId,
          bayar: payloadForBayar,
          total,
          totalDiskon,
          totalPajak,
          kembali,
          tglBayar: new Date(),
          kategoriBayar: paymentTypes[selectedPayment ?? 3],
        };

        try {
          const postApi = await fetch(`/api/kasir/bayar`, {
            method: "POST",
            body: JSON.stringify(bodyToPost),
          });
          if (!postApi.ok) {
            ToastAlert({ icon: "error", title: "Gagal simpan data!" });
            return;
          }
          ToastAlert({ icon: "success", title: "Berhasil!" });
          route.refresh();
        } catch (error: any) {
          console.log(error);
          ToastAlert({ icon: "error", title: error.message });
        }
      }
    }
  };
  const cetakKwitansi = async (billId: number) => {
    const get = await getBillingDetail(billId);
    // console.log(JSON.stringify(get, null, 2));
    if (get.status) {
      setBillData(get.data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const modal: any = document?.getElementById("modal-print-bill-pasien");
      modal.showModal();
    } else {
      ToastAlert({ icon: "error", title: get.message as string });
    }
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Deskripsi</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {detailBill.billPasienDetail.map((item: any, index: any) => (
              <tr key={item.id}>
                <th>{index + 1}</th>
                <td>{item.deskripsi}</td>
                <td>{item.jumlah}</td>
                <td>{formatRupiah(item.harga)}</td>
                <td>{formatRupiah(item.subTotal)}</td>
              </tr>
            ))}

            <tr className="font-semibold">
              <td colSpan={4} className="text-right">
                Sub Total
              </td>
              <td>{formatRupiah(subTotal)}</td>
            </tr>

            <tr className="font-semibold">
              <td colSpan={4} className="text-right">
                Diskon %
              </td>
              <td>
                <input
                  type="text"
                  value={discount}
                  maxLength={2}
                  onChange={(e) => onChangeDiskon(e.target.value)}
                  className="input input-sm input-primary"
                />
              </td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={4} className="text-right">
                Pajak %
              </td>
              <td>
                <input
                  type="text"
                  maxLength={2}
                  onChange={(e) => onChangePajak(e.target.value)}
                  value={taxRate}
                  className="input input-sm input-primary"
                />
              </td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={4} className="text-right">
                Total
              </td>
              <td>{formatRupiah(total)}</td>
            </tr>

            <tr className="font-semibold">
              <td colSpan={4} className="text-right">
                Metode Pembayaran
              </td>
              <td>
                <div className="flex gap-2">
                  {payment.map((pm, index) => {
                    const isSelectedPayment = selectedPayment === index;

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedPayment(index)}
                        className={`flex flex-col items-center justify-center w-24 h-24
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
                            pm.name === "QRIS" ? "w-12 h-6" : "w-[30px] h-8"
                          } mb-3 ${isSelectedPayment ? "filter invert" : ""}`}
                        />
                        <span
                          className={`text-[10px] text-center ${
                            isSelectedPayment ? "text-white" : "text-black"
                          }`}
                        >
                          {pm.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            {selectedPayment == 3 && (
              <>
                <tr className="font-semibold">
                  <td colSpan={4} className="text-right">
                    Jumlah Pembayaran
                  </td>
                  <td>
                    <input
                      type="text"
                      value={formatRupiah(bayar)}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      onChange={(e) => onChangeBayar(e.target.value)}
                      className="input input-sm input-primary"
                    />
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td colSpan={4} className="text-right">
                    Kembali
                  </td>
                  <td>{formatRupiah(kembali)}</td>
                </tr>
              </>
            )}
            <tr>
              <td colSpan={5}>
                {detailBill.status === "LUNAS" ? (
                  <div className="flex flex-col gap-3 mt-5">
                    <button className="btn btn-success btn-sm">LUNAS</button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => cetakKwitansi(detailBill.id)}
                    >
                      CETAK KWITANSI
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onClickBayar()}
                    className="btn btn-primary btn-sm btn-block"
                  >
                    BAYAR
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ModalPrintKwintansi tagihan={billData} />
      <ModalPayment src={srcPayment} />
    </div>
  );
};

export default DetailBillPasien;
