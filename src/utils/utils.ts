import CRUDLocalStorage from "../CRUDLocalStorage";
import { User } from "../models/user";

export const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substring(2, 9);
};
export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
export async function updateUser(user: User) {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  const updatedUsers = users.filter((userItem) => userItem.id !== user.id);
  updatedUsers.push(user);
  await CRUDLocalStorage.setAsyncData("users", updatedUsers);
}
export const generateUniqueCardNumber = () => {
  const randomCardNumber = Math.floor(Math.random() * 10000000000000000);
  return parseInt(randomCardNumber.toString().padStart(16, "0"), 10);
};
export const generateUniqueCardPin = () => {
  let randomNumber = Math.floor(Math.random() * 900) + 100;
  return parseInt(randomNumber.toString().padStart(3, "0"), 10);
};

export function generateUniqueNumber(digit:number) {
  return Math.random().toFixed(digit).split('.')[1];
}
