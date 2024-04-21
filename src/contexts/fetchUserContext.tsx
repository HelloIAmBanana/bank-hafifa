import React, { createContext, useContext, useMemo } from "react";
import CRUDLocalStorage from "../CRUDLocalStorage";
import { User } from "../models/user";
import { useQuery } from "react-query";
import { UserContext } from "../UserProvider";
import AuthService from "../AuthService";

type FetchUsersContextType = {
  isLoading: boolean;
  users: User[];
};

const FetchUsersContext = createContext<FetchUsersContextType>({
  isLoading: false,
  users: [],
});

export function FetchUsersProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const { isLoading, data: users = [] } = useQuery(["users", isAdmin, currentUser], async () => {
    const fetchedCards = await CRUDLocalStorage.getAsyncData<User[]>("users");
    return fetchedCards;
  });

  return (
    <FetchUsersContext.Provider
      value={{
        isLoading: isLoading,
        users: users,
      }}
    >
      {children}
    </FetchUsersContext.Provider>
  );
}

export const useFetchUsersContext = () => useContext(FetchUsersContext);
