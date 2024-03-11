import { User } from "./models/user";
import CRUDLocalStorage from "./CRUDLocalStorage";
class AuthService {
  static storeUserToStorage(user: User) {
    sessionStorage.setItem("currentUser", JSON.stringify(user.id));
  }
  static async getUserFromStorage(id: string) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
    try {
      const decoded = users.filter((user) => user.id === id);
      return decoded[0] as User;
    } catch (error) {
      return null;
    }
  }
  static getUserID() {
    const user = sessionStorage.getItem("currentUser");
    return user ? JSON.parse(user) : undefined;
  }
}

export default AuthService;
