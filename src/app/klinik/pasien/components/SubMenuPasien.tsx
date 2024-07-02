import { Session } from "next-auth"
import Link from "next/link"

const SubMenuPasien = ({ session, params }: { session: Session | null, params: { id?: string } }) => {
    return (
        <>
            {session?.user.role === 'admin' || session?.user.role === 'admisi' ?
                <ul className="menu menu-xs menu-horizontal space-x-2 bg-base-300 rounded self-end">
                    <li>
                        <Link href={`/klinik/pasien/registrasi/${params.id}`} className="btn btn-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z" clipRule="evenodd" />
                            </svg>
                            Pendaftaran
                        </Link>
                    </li>
                    <li>
                        <Link href={`/klinik/pendaftaran/riwayat/${params.id}`} className="btn btn-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Z" />
                                <path fillRule="evenodd" d="M13 6H3v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6ZM8.75 7.75a.75.75 0 0 0-1.5 0v2.69L6.03 9.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.22 1.22V7.75Z" clipRule="evenodd" />
                            </svg>

                            Riwayat Pendaftaran
                        </Link>
                    </li>
                </ul>
                : <ul className="menu menu-xs menu-horizontal space-x-2 bg-base-300 rounded self-end">
                    <li>
                        <Link href={`/klinik/pendaftaran/riwayat/${params.id}`} className="btn btn-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Z" />
                                <path fillRule="evenodd" d="M13 6H3v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6ZM8.75 7.75a.75.75 0 0 0-1.5 0v2.69L6.03 9.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.22 1.22V7.75Z" clipRule="evenodd" />
                            </svg>

                            Riwayat Pendaftaran
                        </Link>
                    </li>
                </ul>
            }
        </>
    )
}

export default SubMenuPasien