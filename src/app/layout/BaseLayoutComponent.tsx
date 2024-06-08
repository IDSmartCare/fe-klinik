'use client'

import Image from "next/image"
import { ReactNode } from "react"
import { Session } from "next-auth"

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
                            <Image src={`/logo.png`} priority
                                width={100} height={100} className="w-8/10 h-auto"
                                alt="logo klinik" />
                        </div>
                        <div className="divider m-0"></div>
                        {/* {menus && <>
                            {menus?.map((item: ListFetchResponse) => {
                                if (item.data.sub_menus.length <= 0) {
                                    return (
                                        <li key={item.data.id_menu} className="m-1">
                                            <Link href={item.data.url_menu}>
                                                <Image src={`data:image/svg+xml;utf8,${item.data.icon_menu}`} alt="icon-sidebar" width={20} height={20} />
                                                {item.data.nama_menu}
                                            </Link>
                                        </li>
                                    )
                                } else {
                                    return (
                                        <li key={item.data.id_menu}>
                                            <details>
                                                <summary>
                                                    <Image src={`data:image/svg+xml;utf8,${item.data.icon_menu}`} alt="icon-sidebar" width={20} height={20} />
                                                    {item.data.nama_menu}
                                                </summary>
                                                <ul>
                                                    {item.data.sub_menus?.map((subMenus: SubMenusInterface) => {
                                                        return (
                                                            <li className="m-1" key={subMenus.id_sub_menu}><Link href={subMenus.url_sub_menu}>{subMenus.nama_sub_menu}</Link></li>
                                                        )
                                                    })}
                                                </ul>
                                            </details>
                                        </li>
                                    )
                                }
                            })}
                        </>
                        } */}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BaseLayoutComponent