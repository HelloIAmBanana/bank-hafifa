import { User } from "./models/user";
import CRUDLocalStorage from "./CRUDLocalStorage";
import { capitalizeFirstLetter } from "./utils/utils";

export type UserAndRemembered = User & { rememberMe: Boolean };

class AuthService {
  static storeAuthTokenToStorage(userId: string) {
    sessionStorage.setItem("currentAuthToken", userId);
  }

  static async getUserFromStorage(id: string) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
    try {
      const user = users.find((user) => user.id === id);
      return user;
    } catch (error) {
      return null;
    }
  }

  static getRememberedToken() {
    return localStorage.getItem("rememberedAuthToken");
  }
  static getUserFullName(user: User) {
    if (user) {
      return `${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}`;
    }
  }
  static async getCurrentUser(): Promise<User | null> {
    const authToken = AuthService.getAuthToken();
    if (authToken) {
      return (await AuthService.getUserFromStorage(authToken)) as User;
    }
    return null;
  }

  static isUserAuthenticated() {
    return Boolean(AuthService.getAuthToken());
  }

  static getAuthToken() {
    const rememberedUser = AuthService.getRememberedToken();
    const sessionToken = sessionStorage.getItem("currentAuthToken");
    const user = rememberedUser ?? sessionToken;
    return user;
  }
}

export default AuthService;
