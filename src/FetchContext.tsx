import React, { createContext, useContext, useMemo, useState } from "react";
import { UserContext } from "./UserProvider";
import CRUDLocalStorage from "./CRUDLocalStorage";
import { Loan } from "./models/loan";
import AuthService from "./AuthService";
import { Deposit } from "./models/deposit";
import { DateTime } from "luxon";
import { Transaction } from "./models/transactions";

type FetchContextType = {
  fetchUserLoans: () => Promise<void>;
  fetchUserDeposits: () => Promise<void>;
  fetchUserTransactions: () => Promise<void>;
  isLoading: boolean;
  loans: Loan[];
  deposits: Deposit[];
  transactions: Transaction[];
};

const FetchContext = createContext<FetchContextType>({
  fetchUserLoans: () => Promise.resolve(),
  fetchUserDeposits: () => Promise.resolve(),
  fetchUserTransactions: () => Promise.resolve(),

  isLoading: false,
  loans: [],
  deposits: [],
  transactions: [],
});

export function FetchContextProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const fetchUserTransactions = async () => {
    setIsLoading(true);
    try {
      const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");
      const sortedTransactions = fetchedTransactions.sort((a, b) => {
        return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
      });
      const userTransactions = sortedTransactions.filter(
        (transaction) => transaction.senderID === currentUser!.id || transaction.receiverID === currentUser!.id
      );
      setTransactions(userTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserDeposits = async () => {
    setIsLoading(true);
    try {
      const fetchedDeposits = await CRUDLocalStorage.getAsyncData<Deposit[]>("deposits");

      if (isAdmin) {
        setDeposits(fetchedDeposits);
        setIsLoading(false);
        return;
      }

      const userDeposits = fetchedDeposits.filter((deposit) => deposit.accountID === currentUser!.id);
      setDeposits(userDeposits);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const fetchUserLoans = async () => {
    setIsLoading(true);
    try {
      const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");

      if (isAdmin) {
        setLoans(fetchedLoans);
        setIsLoading(false);
        return;
      }

      const userLoans = fetchedLoans.filter((currentLoan) => currentLoan.accountID === currentUser!.id);
      setLoans(userLoans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  return (
    <FetchContext.Provider
      value={{
        fetchUserLoans: fetchUserLoans,
        fetchUserDeposits: fetchUserDeposits,
        fetchUserTransactions: fetchUserTransactions,
        isLoading: isLoading,
        loans: loans,
        deposits: deposits,
        transactions:transactions,
      }}
    >
      {children}
    </FetchContext.Provider>
  );
}

export const useFetchContext = () => useContext(FetchContext);
