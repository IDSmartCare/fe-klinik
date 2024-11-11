"use client";
import { createColumnHelper } from "@tanstack/table-core";
import { ListUserLoginInterface } from "./interface/listuserlogin";

const columHelper = createColumnHelper<ListUserLoginInterface>();

const UserTableColumn = [
  columHelper.accessor((row) => row.id_profile, {
    cell: (info) => info.getValue(),
    header: "ID",
  }),
  columHelper.accessor((row) => row.username, {
    cell: (info) => info.getValue(),
    header: "Username",
  }),
  columHelper.accessor((row) => row.role, {
    cell: (info) => info.getValue(),
    header: "Role",
  }),
  columHelper.accessor((row) => row?.detail?.namaLengkap, {
    cell: (info) => info.getValue(),
    header: "Nama",
  }),
  columHelper.accessor((row) => row.detail?.poliklinik?.namaPoli, {
    cell: (info) => info.getValue(),
    header: "Poliklinik",
  }),
  columHelper.accessor((row) => row.detail?.str, {
    cell: (info) => info.getValue(),
    header: "STR",
  }),
  columHelper.accessor((row) => row.detail?.sip, {
    cell: (info) => info.getValue(),
    header: "SIP",
  }),
];

export default UserTableColumn;
