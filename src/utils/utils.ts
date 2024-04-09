import { DateTime } from "luxon";
import { User } from "../models/user";
import CRUDLocalStorage from "../CRUDLocalStorage";
import { Card } from "../models/card";

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

export function generateUniqueNumber(digit: number) {
  return Math.random().toFixed(digit).split(".")[1];
}

export async function deleteLegacyCreditCard(card: Card) {
  const cards = (await CRUDLocalStorage.getAsyncData<Card[]>("cards")) || [];
  const filteredList: Card[] = cards.filter((currentCard) => currentCard.cardNumber !== card.cardNumber);
  await CRUDLocalStorage.setAsyncData("cards", filteredList);
}
