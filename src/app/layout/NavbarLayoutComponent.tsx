'use client'

import { Session } from "next-auth"
import { signOut } from "next-auth/react"

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
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost">
                        <p>{session?.user.name}</p>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><button onKeyDown={() => onClickLogout()} onClick={() => onClickLogout()}>Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavbarLayoutComponent