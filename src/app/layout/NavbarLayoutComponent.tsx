'use client'

import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"

const NavbarLayoutComponent = ({ session }: { session: Session | null }) => {
    const onClickLogout = () => {
        signOut()
    }
    return (
        <div className="navbar bg-base-200 rounded">
            <div className="flex-1">
                <label htmlFor="my-drawer-2" className="btn drawer-button btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                </label>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href={"/"}>Home</Link></li>
                    <li>
                        <details>
                            <summary>
                                {session?.user.name}
                            </summary>
                            <ul className="p-2 bg-base-100 z-20 rounded-t-none">
                                <li><button onKeyDown={() => onClickLogout()} onClick={() => onClickLogout()}>Logout</button></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NavbarLayoutComponent