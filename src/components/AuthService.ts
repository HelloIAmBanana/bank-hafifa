import { User } from "./models/user";
import CRUDLocalStorage from "./CRUDLocalStorage";
class AuthService {
  static storeUserToStorage(user: User) {
    sessionStorage.setItem("currentUser", JSON.stringify(user.id));
  }
  static async getUserFromStorage(id: string) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
    try {
      const user = users.find((user) => user.id === id);
      return user as User;
    } catch (error) {
      return null;
    }
  }
  static async getUserID(inputUser:User) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
console.log("ID: ")
      const user = users.find((user) => user.id === inputUser.id);
      console.log("Blaaa: ",user)
      return user ? JSON.parse(user.id) : undefined;
    
  }
  
  static getCurrentUserID() {
    const user = sessionStorage.getItem("currentUser");
    return user ? JSON.parse(user) : undefined;
  }
}

export default AuthService;
