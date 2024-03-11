import { User } from "../../components/models/user";
import AuthService from "../../components/AuthService";
import CRUDLocalStorage from "../../components/CRUDLocalStorage";
export default async function login(data: User, rememberMe: boolean) {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  users.map((currentUser) => {
    if (
      currentUser.email.includes(`${data.email}`) &&
      currentUser.email.length === data.email.length
    ) {
      if (
        currentUser.password.includes(`${data.password}`) &&
        currentUser.password.length === data.password.length
      ) {
        console.log(currentUser);
        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify(currentUser));
        }
        AuthService.storeUserToStorage(currentUser);
        return true;
      }
    }
  });
  return false;
}
