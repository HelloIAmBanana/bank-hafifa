import { User } from "../../components/models/user";
import AuthService from "../../components/AuthService";
import CRUDLocalStorage from "../../components/CRUDLocalStorage";
export default async function loginValidate(data: User, rememberMe: boolean) {
  const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
  for(let i=0; i<users.length;i++){
    if (
      users[i].email.includes(`${data.email}`) &&
      users[i].email.length === data.email.length
    ) {
      if (
        users[i].password.includes(`${data.password}`) &&
        users[i].password.length === data.password.length
      ) {
        console.log(users[i]);
        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify(users[i]));
        }
        AuthService.storeUserToStorage(users[i]);
        return true;
      }
    }
  }
  return false;
}
