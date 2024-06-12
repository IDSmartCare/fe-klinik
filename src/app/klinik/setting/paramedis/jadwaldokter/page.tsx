import AlertHeaderComponent from "@/app/klinik/setting/paramedis/components/AlertHeaderComponent"
import TableFilterComponent from "@/app/components/TableFilterComponent"
import ModalAddJadwal from "./pageclient/ModalAddJadwal"

const PageMasterJadwalDokter = () => {

    return (
        <>
            <AlertHeaderComponent message="List jadwal dokter" />
            <ModalAddJadwal />
            <TableFilterComponent rowsData={[]} columnsData={[]} />
        </>
    )
}

export default PageMasterJadwalDokter