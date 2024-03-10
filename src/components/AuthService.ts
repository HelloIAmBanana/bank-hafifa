import { User } from "./models/user";
class AuthService {
  static generateToken(user: User) {
    sessionStorage.setItem("currentUser", JSON.stringify(user.id));
  }
  static async getUserFromToken(id: string) {
    const users= await this.getAsyncUsers() as User[];
    try {
      const decoded = users.filter((user) => user.id == id);
      return decoded[0] as User;
    } catch (error) {
      return null;
    }
  }
  static getToken(){
    const user = sessionStorage.getItem("currentUser");
    return (user? JSON.parse(user):undefined);
  }
  static getAsyncUsers() {
    const myPromise: Promise<User[]> = new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem("users");
        resolve(data ? JSON.parse(data) : []);
      }, 1000);
    });
    return myPromise;
  }
}

export default AuthService;
