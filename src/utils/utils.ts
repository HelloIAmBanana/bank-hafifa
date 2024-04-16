import { DateTime } from "luxon";
import { User } from "../models/user";
import CRUDLocalStorage from "../CRUDLocalStorage";
import { Notification, NotificationType } from "../models/notification";

export const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substring(2, 9);
};

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function getUserFullName(user: User) {
  return `${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}`;
}

export function formatIsoStringToDate(iso: string, format: string) {
  return DateTime.fromISO(iso, {
    zone: "Asia/Jerusalem",
  }).toFormat(`${format}`);
}

export function generateUniqueNumber(digitAmount: number) {
  return parseFloat((Math.random().toString().slice(2) + Math.random().toString().slice(15)).slice(0, digitAmount));
}

export async function createNewNotification(accountID: string, type: NotificationType) {
  const newNotification: Notification = {
    accountID: accountID,
    type: type,
    id: generateUniqueId(),
  };

  await CRUDLocalStorage.addItemToList<Notification>("notifications", newNotification);
}

export async function doesUserExist(userEmail: string) {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  return Boolean(users.find((user) => user.email === userEmail));
}
