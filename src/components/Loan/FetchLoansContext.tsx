import React, {createContext, useContext, useState} from 'react';
import { UserContext } from '../../UserProvider';
import CRUDLocalStorage from '../../CRUDLocalStorage';
import { Loan } from '../../models/loan';

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

export function FetchLoansContextProvider({ children }: React.PropsWithChildren)  {
    const [currentUser] = useContext(UserContext);
    const [isLoansLoading, setIsLoanLoading] = useState(true);
    const [loans, setLoans] = useState<Loan[]>([]);
    
  const fetchUserLoans = async () => {
    setIsLoanLoading(true);
    try {
      const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
      const userLoans = fetchedLoans.filter((currentLoan) => currentLoan.accountID === currentUser!.id);
      setLoans(userLoans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoanLoading(false);
  };

  return (
    <FetchLoansContext.Provider value={{ fetchUserLoans: fetchUserLoans, isLoansLoading:isLoansLoading,loans:loans}}>
      {children}
    </FetchLoansContext.Provider>
  );
}

export const useFetchLoansContext = () => useContext(FetchLoansContext);