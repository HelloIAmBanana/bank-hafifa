import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "react-query"; // Import useQuery
import { UserContext } from "../UserProvider";
import CRUDLocalStorage from "../CRUDLocalStorage";
import AuthService from "../AuthService";
import { Deposit } from "../models/deposit";

type FetchDepositsContextType = {
  isLoading: boolean;
  deposits: Deposit[];
};

const FetchDepositsContext = createContext<FetchDepositsContextType>({
  isLoading: false,
  deposits: [],
});

export function FetchDepositsProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const { isLoading, data: deposits = [] } = useQuery(["deposits", isAdmin, currentUser], async () => {
    const fetchedDeposits = await CRUDLocalStorage.getAsyncData<Deposit[]>("deposits");
    return isAdmin ? fetchedDeposits : fetchedDeposits.filter((deposit) => deposit.accountID === currentUser!.id);
  });
  return <FetchDepositsContext.Provider value={{ isLoading, deposits }}>{children}</FetchDepositsContext.Provider>;
}
export const useFetchDepositsContext = () => useContext(FetchDepositsContext);
