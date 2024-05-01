import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { User } from "../../models/user";
import { NavigateFunction } from "react-router-dom";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { successAlert } from "../../utils/swalAlerts";

export default async function openVerifyEmailModal(user: User,navigate: NavigateFunction) {
  withReactContent(Swal)
    .fire({
      title: `A verification code was sent to ${user.email}`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      confirmButtonText: "Verify Email",
      showLoaderOnConfirm: true,
      preConfirm: async (enteredCode: string) => {
        try {
          const isCodeValid = Boolean(enteredCode === user.id.slice(1));
          if (!isCodeValid) {
            return Swal.showValidationMessage("INVALID CODE");
          }
          return isCodeValid;
        } catch (error) {
          Swal.showValidationMessage("INVALID CODE");
        }
      },
      allowOutsideClick: false,
    })
    .then(async (result) => {
      if (result) {
        await CRUDLocalStorage.addItemToList<User>("users", user);
        successAlert("Account Created! Navigating to Signin Page...");
        navigate('/', {state: { email: user.email, password: user.password  }})
      }
    });
}
