import { DateTime } from "luxon";
import { User } from "../models/user";
import CRUDLocalStorage from "../CRUDLocalStorage";
import { Notification } from "../models/notification";
import { Loan } from "../models/loan";
import { Deposit } from "../models/deposit";

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

export async function getItemInList<T extends { id: string }>(key: string, itemID: string): Promise<T | undefined> {
  const items: T[] = (await CRUDLocalStorage.getAsyncData<T[]>(key)) || [];
  const wantedItem = items.find((currentItem) => currentItem.id === itemID);
  return wantedItem;
}

export function generateUniqueNumber(digitAmount: number) {
  return parseFloat((Math.random().toString().slice(2) + Math.random().toString().slice(15)).slice(0, digitAmount));
}

export async function createNewNotification(
  accountID: string,
  type: "loanDeclined" | "cardDeclined" | "cardApproved" | "loanApproved" | "newTransaction" | "newDepositOffer" |"DepositWithdrawn"
) {
  const newNotification: Notification = {
    accountID: accountID,
    type: type,
    id: generateUniqueId(),
  };

  await CRUDLocalStorage.addItemToList<Notification>("notifications", newNotification);
}

export async function fetchExpiredLoans() {
  const currentDate = new Date();

  const loans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");

  const expiredLoans = loans.filter((loan) => {
    const [hours, minutes] = loan.expireDate.split(":").map(Number);

    const expirationDateTime = new Date();
    expirationDateTime.setHours(hours);
    expirationDateTime.setMinutes(minutes);
    expirationDateTime.setSeconds(0);

    return expirationDateTime < currentDate && loan.status === "approved";
  });

  return expiredLoans;
}

export async function fetchExpiredDeposits() {

  const currentDate = new Date();

  const deposits = await CRUDLocalStorage.getAsyncData<Deposit[]>("deposits");

  const expiredDeposits = deposits.filter((deposit) => {
    const [hours, minutes] = deposit.expireTime.split(":").map(Number);

    const expirationDateTime = new Date();
    expirationDateTime.setHours(hours);
    expirationDateTime.setMinutes(minutes);
    expirationDateTime.setSeconds(0);

    return expirationDateTime < currentDate && deposit.status === "Active";
  });

  return expiredDeposits;
}
