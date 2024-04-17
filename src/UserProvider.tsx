import React, { createContext, useEffect, useState } from "react";
import AuthService from "./AuthService";
import { User } from "./models/user"; 

export const UserContext = createContext<[User | undefined, React.Dispatch<React.SetStateAction<User | undefined>>]>([
  null!,
  () => null!,
]);

const UserProvider = ({ children }: React.PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User>();

  const storeCurrentUser = async () => {
    const user = (await AuthService.getCurrentUser()) as User;
    setCurrentUser(user);
  };

  useEffect(() => {

    storeCurrentUser();
  }, []);

  return <UserContext.Provider value={[currentUser, setCurrentUser]}>{children}</UserContext.Provider>;
};

export default UserProvider;
