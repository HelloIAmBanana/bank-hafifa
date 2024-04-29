import Swal from "sweetalert2";
import { NotificationType } from "../models/notification";

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

export function showNotification(notification: NotificationType) {
  switch (notification) {
    case "cardApproved":
      return notificationAlert("Your card request was approved by an admin!");
    case "cardDeclined":
      return notificationAlert("Your card request was declined by an admin!");
    case "loanApproved":
      return notificationAlert("Your loan request was approved by an admin!");
    case "loanDeclined":
      return notificationAlert("Your loan request was declined by an admin!");
    case "newTransaction":
      return notificationAlert("You have received a new transaction while you were offline!");
    case "newDepositOffer":
      return notificationAlert("You have a new deposit offer!");
  }
}
