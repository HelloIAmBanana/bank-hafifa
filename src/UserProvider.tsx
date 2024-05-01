import React, { useEffect, ReactNode } from "react";
import { observer } from "mobx-react-lite";
import userStore from "./UserStore";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = observer(({ children }) => {
  useEffect(() => {
    userStore.storeCurrentUser();
  }, []);

  return <>{children}</>;
});

export default UserProvider;
