"use client";

import { useEffect, useState } from "react";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { getBillingDetail } from "./getBilling";
import ModalPrintKwintansi from "./ModalPrintKwitansi";
import { useRouter } from "next/navigation";
import { formatRupiah, formatRupiahEdit } from "@/app/helper/formatRupiah";

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
    if (bayar === 0) {
      ToastAlert({ icon: "error", title: "Pembayaran harus diisi!" });
    } else if (bayar < total) {
      ToastAlert({
        icon: "error",
        title: "Pembayaran harus lebih besar/sama dengan total tagihan!",
      });
    } else {
      const bodyToPost = {
        id: detailBill.id,
        pendaftaranId: detailBill.pendaftaranId,
        bayar,
        total,
        totalDiskon,
        totalPajak,
        kembali,
        tglBayar: new Date(),
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
  };
  const cetakKwitansi = async (billId: number) => {
    const get = await getBillingDetail(billId);
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
    </div>
  );
};

export default DetailBillPasien;
