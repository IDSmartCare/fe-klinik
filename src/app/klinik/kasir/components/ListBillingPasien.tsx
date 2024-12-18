"use client";

import { format } from "date-fns";
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent";
import Link from "next/link";
import ModalPrintTagihan from "../pageclient/ModalPrintTagihan";
import { useState } from "react";
import { getBillingPasien } from "./getBillingPasien";
import { Session } from "next-auth";

const ListBillingPasien = ({
  dataRegis,
  session,
}: {
  dataRegis: any;
  session: Session | null;
}) => {
  const [tagihan, setTagihan] = useState<any>();
  const onClickPrint = async (id: string) => {
    const getData: any = await getBillingPasien(Number(id));
    console.log(JSON.stringify(getData, null, 2));
    setTagihan(getData.data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const modal: any = document?.getElementById("modal-print-bill-kasir");
    modal.showModal();
  };

  return (
    <div className="flex flex-col gap-2">
      <AlertHeaderComponent message="List Tagihan Yang Ada!" />
      <div className="flex flex-wrap gap-2 bg-base-200 p-2 h-full">
        {dataRegis?.map((item: any) => (
          <div className="card bg-base-100 w-96 shadow-xl" key={item.id}>
            <div className="card-body">
              <h2 className="card-title">
                {format(item.createdAt, "dd/MM/yyyy HH:mm")}
              </h2>
              <p>ID : {item.billPasien[0].id}</p>
              <p>PendaftaranID : {item?.id}</p>
              <p>Penjamin : {item?.penjamin}</p>
              <p>Poli : {item.riwayat?.doctor?.unit}</p>
              <p>Dokter : {item.riwayat?.doctor?.name}</p>
              <div className="card-actions justify-end items-center">
                {item?.billPasien[0]?.status === "LUNAS" && (
                  <p className="font-bold text-success">SUDAH BAYAR</p>
                )}
                {item?.billPasien[0]?.status !== "LUNAS" && (
                  <button
                    className="btn btn-sm btn-info text-white"
                    onClick={() => onClickPrint(item?.id)}
                  >
                    CETAK TAGIHAN
                  </button>
                )}
                {item?.penjamin === "PRIBADI" &&
                  session?.user.role !== "admin" && (
                    <Link
                      href={`/klinik/kasir/detail/${item.id}`}
                      className={`btn btn-sm text-white ${
                        item?.billPasien[0]?.status === "LUNAS"
                          ? "btn-success"
                          : "btn-primary"
                      }`}
                    >
                      {item?.billPasien[0]?.status === "LUNAS"
                        ? "RIWAYAT TAGIHAN"
                        : "BAYAR"}
                    </Link>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalPrintTagihan tagihan={tagihan} />
    </div>
  );
};

export default ListBillingPasien;
