import Swal from "sweetalert2";
import getFortune from "../components/NavigationBar/getFortune";

export function successAlert(message: string) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    color: "green",
    title: message,
    showConfirmButton: false,
    timer: 3750,
    timerProgressBar: true,
  });
}

export function errorAlert(message: string) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "error",
    color: "red",
    title: message,
    showConfirmButton: false,
    timer: 3750,
    timerProgressBar: true,
  });
}

export function warningAlert(message: string) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "warning",
    color: "yellow",
    title: message,
    showConfirmButton: false,
    timer: 3750,
    timerProgressBar: true,
  });
}

export function notificationAlert(message: string) {
  Swal.fire({
    toast: true,
    position: "top-right",
    icon: "info",
    color: "CornflowerBlue",
    title: message,
    showConfirmButton: false,
    timer: 3750,
    timerProgressBar: true,
  });
}

export function normalAlert(message: string) {
  Swal.fire({
    toast: true,
    title: message,
    showConfirmButton: false,
    timer: 3750,
    timerProgressBar: true,
  });
}

export function fortuneAlert() {
  const fortune = getFortune()
  Swal.fire({
    title: "Here is a furtone for ya!",
    html: fortune,
    timer: 5000,
    background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
    color: "#716add",
    backdrop: `
    rgba(0,0,123,0.4)
    url("https://sweetalert2.github.io/images/nyan-cat.gif")
    center top
    no-repeat
  `,
  });
}
