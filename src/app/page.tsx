import Image from "next/image";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex gap-4">
        {/* <div className="card w-96 bg-base-100 shadow-xl">
                    <figure>
                        <Image src={"/bg-antrian.png"} alt="bg-klinik" width={400} height={400} />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Antrian</h2>
                        <p>Sistem pengambilan antrian pasien</p>
                        <div className="card-actions justify-end">
                            <Link href="#" className="btn btn-primary">Masuk</Link>
                        </div>
                    </div>
                </div> */}
        <div className="card w-96 bg-base-100 shadow-xl">
          <figure>
            <Image
              src={"/bg-klinik.jpg"}
              alt="bg-klinik"
              width={400}
              height={400}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">SIM Klinik</h2>
            <p>Sistem informasi management klinik</p>
            <div className="card-actions justify-end">
              <Link href="/klinik" className="btn btn-primary">
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
