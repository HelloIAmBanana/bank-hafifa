import React, { createContext, useContext, useMemo, useState } from "react";
import { UserContext } from "../UserProvider";
import CRUDLocalStorage from "../CRUDLocalStorage";
import AuthService from "../AuthService";
import { Deposit } from "../models/deposit";

type FetchDepositsContextType = {
  fetchDeposits: () => Promise<void>;
  isLoading: boolean;
  deposits: Deposit[];
};

const FetchDepositsContext = createContext<FetchDepositsContextType>({
  fetchDeposits: () => Promise.resolve(),
  isLoading: false,
  deposits: [],
});

export function FetchDepositsProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const fetchedDeposits = await CRUDLocalStorage.getAsyncData<Deposit[]>("deposits");
      const currentDeposits = isAdmin
        ? fetchedDeposits
        : fetchedDeposits.filter((deposit) => deposit.accountID === currentUser!.id);

      setDeposits(currentDeposits);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  return (
    <FetchDepositsContext.Provider
      value={{
        fetchDeposits: fetchDeposits,
        isLoading: isLoading,
        deposits: deposits,
      }}
    >
      {children}
    </FetchDepositsContext.Provider>
  );
}

export const useFetchDepositsContext = () => useContext(FetchDepositsContext);
