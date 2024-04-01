import { User } from "../../models/user";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { UserAndRemembered } from "../../AuthService";

export async function validateLogin(userData: UserAndRemembered): Promise<User | null> {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  const foundUser = users.find((user) => user.email === userData.email && user.password === userData.password);

  if (foundUser) {
    return foundUser as UserAndRemembered;
  }
  return null;
}
