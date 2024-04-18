import React, { createContext, useContext, useMemo} from "react";
import { UserContext } from "../UserProvider";
import CRUDLocalStorage from "../CRUDLocalStorage";
import { Loan } from "../models/loan";
import AuthService from "../AuthService";
import { useQuery } from "react-query";

type FetchLoansContextType = {
  isLoading: boolean;
  loans: Loan[];
};

const FetchLoansContext = createContext<FetchLoansContextType>({
  isLoading: false,
  loans: [],
});

export function FetchLoansProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const { isLoading, data: loans = [] } = useQuery(["loans", isAdmin, currentUser], async () => {
    const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
    return isAdmin ? fetchedLoans : fetchedLoans.filter((loan) => loan.accountID === currentUser!.id);
  });

  return <FetchLoansContext.Provider value={{ isLoading, loans }}>{children}</FetchLoansContext.Provider>;
}

export const useFetchLoanContext = () => useContext(FetchLoansContext);
