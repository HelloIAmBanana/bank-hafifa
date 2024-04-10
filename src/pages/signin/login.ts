import CRUDLocalStorage from "../../CRUDLocalStorage";
import { User } from "../../models/user";

export async function validateLogin(userData: User): Promise<User | undefined> {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  const foundUser = users.find((user) => user.email === userData.email && user.password === userData.password);
  
  return foundUser;
}
