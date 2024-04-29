import { makeAutoObservable } from "mobx";
import AuthService from "./AuthService";
import { User } from "./models/user";

class UserStore {
  currentUser: User | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  async storeCurrentUser() {
    const user = (await AuthService.getCurrentUser()) as User;
    this.currentUser = user;
  }
}

const userStore = new UserStore();
export default userStore;
