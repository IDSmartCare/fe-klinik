'use client'
import ButtonModalComponent from "../../components/ButtonModalComponent"

const ModalAddJadwal = () => {
    return (
        <div className="self-end">
            <ButtonModalComponent modalname="add-jadwal" title="Jadwal Baru" />
            <dialog id="add-jadwal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click outside to close</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}

export default ModalAddJadwal