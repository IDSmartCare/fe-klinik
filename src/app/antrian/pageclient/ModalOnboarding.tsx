import Image from "next/image";
import React from "react";

const ModalOnboarding = ({ onClick }: { onClick: () => void }) => {
  return (
    <dialog id="modal-onboarding" className="modal">
      <div className="modal-box max-w-md">
        <div className="flex flex-col gap-5">
          <Image src="/modal-image.png" width={500} height={500} alt="logo" />
          <span className="font-bold text-2xl">Selamat Datang</span>
          <p className="text-xl">
            Anda telah memasuki Anjungan Pendaftaran Mandiri.
          </p>
          <div className="self-end">
            <button className="btn btn-md btn-primary" onClick={onClick}>
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ModalOnboarding;
