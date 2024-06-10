'use client'

import { listMenu } from "@/setup/menu"
import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

const BaseLayoutComponent = ({ children, session }: { children: ReactNode, session: Session | null }) => {
    return (
        <div className="flex-1">
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col gap-2 p-2 mb-24">
                    {children}
                </div>
                <div className="drawer-side lg:pl-2 lg:py-2">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-60 min-h-full lg:rounded bg-base-200 text-base-content">
                        <div className="flex justify-center mb-2">
                            <Link href={"/"}>
                                <Image src={`/logo.png`} priority
                                    width={150} height={100} className="w-50 h-8"
                                    alt="logo klinik" />
                            </Link>
                        </div>
                        <div className="divider m-0"></div>
                        {
                            listMenu.map((item) => {
                                return (
                                    item.roles.includes(session?.user.role) &&
                                    <li key={item.id}>
                                        {item.submenu && item.submenu.length > 0 ?
                                            <details>
                                                <summary>
                                                    <Image src={`data:image/svg+xml;utf8,${item.icon}`} alt="icon-sidebar" width={20} height={20} />
                                                    {item.menu}
                                                </summary>
                                                <ul>
                                                    {item.submenu?.map((submenu) => {
                                                        return (
                                                            <li className="m-1" key={submenu.id}><Link href={submenu.url}>{submenu.title}</Link></li>
                                                        )
                                                    })}
                                                </ul>
                                            </details>
                                            :
                                            <Link href={item.link}>
                                                <Image src={`data:image/svg+xml;utf8,${item.icon}`} alt="icon-sidebar" width={20} height={20} />
                                                {item.menu}
                                            </Link>
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BaseLayoutComponent