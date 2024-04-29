import { makeAutoObservable } from "mobx";
import AuthService from "./AuthService";
import { User } from "./models/user";
import CRUDLocalStorage from "./CRUDLocalStorage";
import { Notification } from "./models/notification";
import { showNotification } from "./utils/swalAlerts";
import { Loan } from "./models/loan";

class UserStore {
  currentUser: User | undefined;
  blockedUsers: string[] = [];

  constructor() {
    makeAutoObservable(this);
    this.fetchCurrentUser();
    this.loadBlockedUsers();
  }

  async fetchCurrentUser() {
    this.currentUser = (await AuthService.getCurrentUser()) as User;
    this.triggerNotifications();
    this.blockUnpayingUsers();
  }

  async storeCurrentUser() {
    const user = await AuthService.getCurrentUser();
    if (user) {
      this.currentUser = user;
    }
  }

  async triggerNotifications() {
    const notifications = await CRUDLocalStorage.getAsyncData<Notification[]>("notifications");

    if (!this.currentUser) return;

    const userNotifications = notifications.filter((notification) => notification.accountID === this.currentUser!.id);

    userNotifications.forEach(async (notification) => {
      showNotification(notification.type);

      await CRUDLocalStorage.deleteItemFromList("notifications", notification);
    });
  }

  async blockUnpayingUsers() {
    const currentDate = new Date().toISOString();
    const loans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
    const expiredLoans = loans.filter((loan) => loan.expireDate < currentDate);

    for (const loan of expiredLoans) {
      if (!this.blockedUsers.includes(loan.accountID) && loan.status === "approved") {
        this.blockedUsers.push(loan.accountID);
        await CRUDLocalStorage.addItemToList("blocked", loan.accountID);
      }
      if (loan.status === "approved" || loan.status === "offered") {
        await CRUDLocalStorage.deleteItemFromList("loans", loan);
      }
    }

    await this.loadBlockedUsers();
  }

  private async loadBlockedUsers() {
    const blockedUsers = await CRUDLocalStorage.getAsyncData<string[]>("blocked");
    if (blockedUsers) {
      this.blockedUsers = blockedUsers;
    }
  }

  isUserBlocked(userId: string) {
    return this.blockedUsers.includes(userId);
  }
}

const userStore = new UserStore();
export default userStore;
