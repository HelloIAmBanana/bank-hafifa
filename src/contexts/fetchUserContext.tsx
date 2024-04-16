import React, { createContext, useContext, useState } from "react";
import CRUDLocalStorage from "../CRUDLocalStorage";
import { User } from "../models/user";

type FetchUsersContextType = {
  fetchUsers: () => Promise<void>;
  isLoading: boolean;
  users: User[];
};

const FetchUsersContext = createContext<FetchUsersContextType>({
  fetchUsers: () => Promise.resolve(),
  isLoading: false,
  users: [],
});

export function FetchUsersProvider({ children }: React.PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);


  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await CRUDLocalStorage.getAsyncData<User[]>("users");
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  return (
    <FetchUsersContext.Provider
      value={{
        fetchUsers: fetchUsers,
        isLoading: isLoading,
        users: users,
      }}
    >
      {children}
    </FetchUsersContext.Provider>
  );
}

export const useFetchUsersContext = () => useContext(FetchUsersContext);
