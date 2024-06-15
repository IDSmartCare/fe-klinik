import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../setting/paramedis/components/AlertHeaderComponent"
import FilterPasienComponent from "@/app/components/FilterPasienComponent"
import ModalAddPasien from "./pageclient/ModalAddPasien"

const PagePasien = () => {
    return (
        <>
            <FilterPasienComponent />
            <AlertHeaderComponent message="List 150 pasien terakhir" />
            <ModalAddPasien />
            <TableFilterComponent rowsData={[]} columnsData={[]} />
        </>
    )
}

export default PagePasien