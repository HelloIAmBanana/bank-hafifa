import { User } from "./models/user";
import CRUDLocalStorage from "./CRUDLocalStorage";
import { errorAlert } from "./utils/swalAlerts";
import { redirect } from "react-router-dom";

export default class AuthService {
  static getRememberedToken() {
    return localStorage.getItem("rememberedAuthToken");
  }

  static isUserAdmin(user: User | undefined) {
    if (!user) return;
    const isAdmin = Boolean(user.role === "admin");
    return isAdmin;
  }

  static async getCurrentUser(): Promise<User | null> {
    const authToken = AuthService.getAuthToken();

    if (!authToken) return null;

    return (await CRUDLocalStorage.getItemInList<User>("users", authToken))!;
  }

  static isUserAuthenticated() {
    return Boolean(AuthService.getAuthToken());
  }

  static getAuthToken(): string | null {
    const rememberedUser = AuthService.getRememberedToken();
    const sessionToken = sessionStorage.getItem("currentAuthToken");
    const user = rememberedUser ?? sessionToken;
    return user;
  }

  static async isSpectatedUserReal(userID: string | undefined) {
    if (userID) {
      const spectatedUser = await CRUDLocalStorage.getItemInList<User>("users", userID);
      if (!spectatedUser) {
        errorAlert("ID ISNT REAL");
        redirect("/admin/users");
      }
    }
  }
}
