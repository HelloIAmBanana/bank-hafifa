import { User } from "./models/user";
import CRUDLocalStorage from "./CRUDLocalStorage";

class AuthService {
  static storeUserToStorage(user: User) {
    sessionStorage.setItem("currentAuthToken", user.id);
  }

  static async getUserFromStorage(id: string) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
    console.log(id)
    try {
      const user = users.find((user) => user.id === id);
      return user as User;
    } catch (error) {
      return null;
    }
  }

  static getRememberedToken() {
    return localStorage.getItem("rememberedAuthToken");
  }

  static getCurrentUserID() {
    const rememberedUser = AuthService.getRememberedToken();
    const sessionToken = sessionStorage.getItem("currentAuthToken");
    const user = rememberedUser ?? sessionToken ;
    return user;
  }
}

export default AuthService;
