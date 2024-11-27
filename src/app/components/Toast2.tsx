import Swal from "sweetalert2";

export const ToastAlert2 = ({
  icon,
  title,
  text,
}: {
  icon: "success" | "error" | "warning" | "info" | "question";
  title: string;
  text: string;
}) => {
  Swal.fire({
    position: "center",
    icon,
    title,
    text,
  });
};
