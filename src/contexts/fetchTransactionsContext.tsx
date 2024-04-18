import React, { createContext, useContext, useMemo, useState } from "react";
import { UserContext } from "../UserProvider";
import CRUDLocalStorage from "../CRUDLocalStorage";
import AuthService from "../AuthService";
import { DateTime } from "luxon";
import { Transaction } from "../models/transactions";
import { useQuery } from "react-query";

type FetchTransactionsContextType = {
  isLoading: boolean;
  transactions: Transaction[];
};

const FetchTransactionsContext = createContext<FetchTransactionsContextType>({
  isLoading: false,
  transactions: [],
});

export function FetchTransactionsProvider({ children }: React.PropsWithChildren) {
  const [currentUser] = useContext(UserContext);

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const { isLoading, data: transactions = [] } = useQuery(["transactions", isAdmin, currentUser], async () => {
    const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");
    const sortedTransactions = fetchedTransactions.sort((a, b) => {
      return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
    });
    return isAdmin
      ? sortedTransactions
      : sortedTransactions.filter(
          (transaction) => transaction.senderID === currentUser!.id || transaction.receiverID === currentUser!.id
        );
  });

  return (
    <FetchTransactionsContext.Provider value={{ isLoading, transactions }}>
      {children}
    </FetchTransactionsContext.Provider>
  );
}

export const useFetchTransactionsContext = () => useContext(FetchTransactionsContext);
