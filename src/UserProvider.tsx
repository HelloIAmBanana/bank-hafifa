import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import userStore from "./UserStore";

const UserProvider: React.FC = observer(({ children }: React.PropsWithChildren) => {
  useEffect(() => {
    userStore.storeCurrentUser();
  }, []);

  return <>{children}</>;
});

export default UserProvider;
