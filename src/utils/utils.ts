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
