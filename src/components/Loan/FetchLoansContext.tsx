import React, { createContext, useContext, useMemo, useState } from "react";
import { UserContext } from "../../UserProvider";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { Loan } from "../../models/loan";
import AuthService from "../../AuthService";

type FetchLoansContextType = {
  fetchUserLoans: () => Promise<void>;
  isLoansLoading: boolean;
  loans: Loan[];
};

const FetchLoansContext = createContext<FetchLoansContextType>({
  fetchUserLoans: () => Promise.resolve(),
  isLoansLoading: false,
  loans: [],
});

export function FetchLoansContextProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);
  const [isLoansLoading, setIsLoanLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const fetchUserLoans = async () => {
    setIsLoanLoading(true);
    try {
      const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");

      if (isAdmin) {
        setLoans(fetchedLoans);
        setIsLoanLoading(false);
        return;
      }

      const userLoans = fetchedLoans.filter((currentLoan) => currentLoan.accountID === currentUser!.id);
      setLoans(userLoans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoanLoading(false);
  };

  return (
    <FetchLoansContext.Provider
      value={{ fetchUserLoans: fetchUserLoans, isLoansLoading: isLoansLoading, loans: loans }}
    >
      {children}
    </FetchLoansContext.Provider>
  );
}

export const useFetchLoansContext = () => useContext(FetchLoansContext);
