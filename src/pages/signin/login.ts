import CRUDLocalStorage from "../../CRUDLocalStorage";
import { User } from "../../models";

export async function validateLogin(userData: User): Promise<User | null> {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  const foundUser = users.find((user) => user.email === userData.email && user.password === userData.password);

  if (foundUser) {
    return foundUser;
  }

  return null;
}
