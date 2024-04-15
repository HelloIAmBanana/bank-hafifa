import CRUDLocalStorage from "../../CRUDLocalStorage";
import { User } from "../../models/user";

export async function validateLogin(email:string,password:string): Promise<User | undefined> {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  const foundUser = users.find((user) => user.email === email.toLowerCase() && user.password === password);
  
  return foundUser;
}
