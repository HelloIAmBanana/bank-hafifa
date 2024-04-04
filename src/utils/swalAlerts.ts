import Swal from "sweetalert2";

export function successAlert(message:string){
  Swal.fire({
  toast: true,
  position: "bottom",
  icon: "success",
  color: "green",
  title: message,
  showConfirmButton: false,
  timer: 3750,
  timerProgressBar: true,
});
}

export function errorAlert(message:string){
  Swal.fire({
  toast: true,
  position: "bottom",
  icon: "error",
  color: "red",
  title: message,
  showConfirmButton: false,
  timer: 3750,
  timerProgressBar: true,
});
}

export function warningAlert(message:string){
  Swal.fire({
  toast: true,
  position: "bottom",
  icon: "warning",
  color: "yellow",
  title: message,
  showConfirmButton: false,
  timer: 3750,
  timerProgressBar: true,
});
}

