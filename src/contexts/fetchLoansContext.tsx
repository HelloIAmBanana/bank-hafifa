import React, { createContext, useContext, useMemo, useState } from "react";
import { UserContext } from "../UserProvider";
import CRUDLocalStorage from "../CRUDLocalStorage";
import { Loan } from "../models/loan";
import AuthService from "../AuthService";

type FetchLoansContextType = {
  fetchLoans: () => Promise<void>;
  isLoading: boolean;
  loans: Loan[];
};

const FetchLoansContext = createContext<FetchLoansContextType>({
  fetchLoans: () => Promise.resolve(),
  isLoading: false,
  loans: [],
});

export function FetchLoansProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
      const currentLoans = isAdmin
        ? fetchedLoans
        : fetchedLoans.filter((currentLoan) => currentLoan.accountID === currentUser!.id);

      setLoans(currentLoans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  return (
    <FetchLoansContext.Provider
      value={{
        fetchLoans: fetchLoans,
        isLoading: isLoading,
        loans: loans,
      }}
    >
      {children}
    </FetchLoansContext.Provider>
  );
}

export const useFetchLoanContext = () => useContext(FetchLoansContext);
