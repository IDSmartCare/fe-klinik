"use client";
import { ToastAlert } from "@/app/helper/ToastAlert";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ModalPayment = ({ src }: { src: string }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClose = () => {
    if (isConfirming) return;

    setIsConfirming(true);

    Swal.fire({
      title: "Batalkan Pembayaran?",
      target: document.getElementById("modal-payment"),
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Tidak",
      confirmButtonText: "Ya",
    }).then((result) => {
      if (result.isConfirmed) {
        const modal = document.getElementById(
          "modal-payment"
        ) as HTMLDialogElement;
        modal?.close();
      }

      setIsConfirming(false);
    });
  };

  useEffect(() => {
    const modal = document.getElementById("modal-payment") as HTMLDialogElement;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <dialog id="modal-payment" className="modal z-0">
      <div className="modal-box p-10">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>

        <div className="w-full">
          <iframe src={src} style={{ height: "600px" }} width="100%"></iframe>
        </div>
      </div>
    </dialog>
  );
};

export default ModalPayment;
