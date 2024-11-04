import Swal, { SweetAlertIcon } from "sweetalert2";

export function ToastAlert({
  icon,
  title,
}: {
  icon: SweetAlertIcon;
  title: string;
}) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon,
    title,
  });
}
