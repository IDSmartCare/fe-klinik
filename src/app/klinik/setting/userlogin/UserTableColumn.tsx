'use client'
import { createColumnHelper } from "@tanstack/table-core"
import { ListUserLoginInterface } from "./interface/listuserlogin"

const columHelper = createColumnHelper<ListUserLoginInterface>()

const UserTableColumn = [
    columHelper.accessor(row => row.username, {
        cell: info => info.getValue(),
        header: "Username"
    }),
    columHelper.accessor(row => row.role, {
        cell: info => info.getValue(),
        header: "Role"
    }),
    columHelper.accessor(row => row.id_profile, {
        cell: info => info.getValue(),
        header: "Id Profile"
    }),
    columHelper.accessor(row => row?.detail?.namaLengkap, {
        cell: info => info.getValue(),
        header: "Nama"
    }),
    columHelper.accessor(row => row.detail?.profesi, {
        cell: info => info.getValue(),
        header: "Profesi"
    }),
    columHelper.accessor(row => row.detail?.poliklinik?.namaPoli, {
        cell: info => info.getValue(),
        header: "Poliklinik"
    }),
]

export default UserTableColumn