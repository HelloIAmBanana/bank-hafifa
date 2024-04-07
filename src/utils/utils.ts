import { DateTime } from "luxon";
import { User } from "../models/user";

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

export function generateUniqueNumber(digit: number) {
  return Math.random().toFixed(digit).split(".")[1];
}
