import { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOption } from "@/auth"
import BaseLayoutComponent from "../layout/BaseLayoutComponent"
import NavbarLayoutComponent from "../layout/NavbarLayoutComponent"

const LayoutKlinik = async ({ children }: { children: ReactNode }) => {
    const session = await getServerSession(authOption)
    return (
        <BaseLayoutComponent session={session}>
            <NavbarLayoutComponent />
            {children}
        </BaseLayoutComponent>
    )
}

export default LayoutKlinik