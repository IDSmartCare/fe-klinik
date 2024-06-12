import { ReactNode } from "react"
import SubMenuJadwal from "./components/SubMenuJadwalComponent"
const LayoutSetJadwal = async ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col gap-2">
            <SubMenuJadwal />
            {children}
        </div>

    )
}

export default LayoutSetJadwal