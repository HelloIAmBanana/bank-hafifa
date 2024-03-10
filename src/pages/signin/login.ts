import { User } from "../../components/models/user";
import AuthService from "../../components/AuthService";
export default async function Login(data: User, rememberMe: boolean) {
    const users= await AuthService.getAsyncUsers();
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
        AuthService.generateToken(currentUser);
        return true;
      }
    }
  });
  return false;
}
