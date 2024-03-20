import { User } from "../../models/user";
import CRUDLocalStorage from "../../CRUDLocalStorage";

export async function validateLogin(
  userData: User & { rememberMe: Boolean }
): Promise<User | null> {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  const foundUser = users.find(
    (user) =>
      user.email === userData.email && user.password === userData.password
  );

  if (foundUser) {
    if (userData.rememberMe) {
      rememberUser(foundUser.id);
    } else {
      return foundUser;
    }
  }

  return null;
}

function rememberUser(userId: string): void {
  localStorage.setItem("rememberedUser", JSON.stringify(userId));
}
