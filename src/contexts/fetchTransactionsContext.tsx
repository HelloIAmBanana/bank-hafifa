import React, { createContext, useContext, useMemo, useState } from "react";
import { UserContext } from "../UserProvider";
import CRUDLocalStorage from "../CRUDLocalStorage";
import AuthService from "../AuthService";
import { DateTime } from "luxon";
import { Transaction } from "../models/transactions";

type FetchTransactionsContextType = {
  fetchTransactions: () => Promise<void>;
  isLoading: boolean;
  transactions: Transaction[];
};

const FetchTransactionsContext = createContext<FetchTransactionsContextType>({
  fetchTransactions: () => Promise.resolve(),
  isLoading: false,
  transactions: [],
});

export function FetchTransactionsProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");
      const sortedTransactions = fetchedTransactions.sort((a, b) => {
        return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
      });
      const currentTransactions = isAdmin
        ? sortedTransactions
        : sortedTransactions.filter(
            (transaction) => transaction.senderID === currentUser!.id || transaction.receiverID === currentUser!.id
          );

      setTransactions(currentTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <FetchTransactionsContext.Provider
      value={{
        fetchTransactions: fetchTransactions,
        isLoading: isLoading,
        transactions: transactions,
      }}
    >
      {children}
    </FetchTransactionsContext.Provider>
  );
}

export const useFetchTransactionsContext = () => useContext(FetchTransactionsContext);
