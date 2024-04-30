import { LoaderFunction, defer } from "react-router-dom";
import { DateTime } from "luxon";
import AuthService from "../../AuthService";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { Transaction } from "../../models/transactions";

export type TransactionsLoaderData = {
  transactions: Promise<Transaction[]>;
};

export const transactionsLoader: LoaderFunction = () => {
  const transactions = (async () => {
    const currentUser = (await AuthService.getCurrentUser())!;
    const isAdmin = AuthService.isUserAdmin(currentUser);

    const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");

    const sortedTransactions = fetchedTransactions.sort((a, b) => {
      return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
    });

    return isAdmin
      ? sortedTransactions
      : sortedTransactions.filter(
          (transaction) => transaction.senderID === currentUser!.id || transaction.receiverID === currentUser!.id
        );
  })();
  return defer({
    transactions,
  } satisfies TransactionsLoaderData);
};
