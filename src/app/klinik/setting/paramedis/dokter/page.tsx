import TableFilterComponent from "@/app/components/TableFilterComponent"
import AlertHeaderComponent from "../components/AlertHeaderComponent"
import ModalAddDokter from "./pageclient/ModalAddDokter"

const PageDokter = () => {
    return (
        <>
            <AlertHeaderComponent message="List dokter" />
            <ModalAddDokter />
            <TableFilterComponent rowsData={[]} columnsData={[]} />
        </>
    )
}

export default PageDokter