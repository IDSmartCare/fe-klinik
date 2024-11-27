import Image from "next/image";

export const TicketComponent = ({
  onPrintTicket,
  onBatalClick,
  nomor,
}: {
  onPrintTicket: () => void;
  onBatalClick: () => void;
  nomor: string;
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center bottom-[-80px]">
      <Image src="/ticket.png" alt="ticket" height={400} width={400} />
      <div className="absolute top-24 flex flex-col gap-5 text-center">
        <span className="text-2xl font-bold">Antrian Registrasi</span>
        <span className="text-7xl font-bold">{nomor}</span>
      </div>
      <div className="absolute top-96 flex flex-col gap-5">
        <span className="text-lg font-bold">Silahkan Menuju Administrasi</span>
        <button className="btn btn-sm btn-primary" onClick={onPrintTicket}>
          Print Tiket
        </button>
        <button
          className="btn btn-sm btn-error text-white"
          onClick={onBatalClick}
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
