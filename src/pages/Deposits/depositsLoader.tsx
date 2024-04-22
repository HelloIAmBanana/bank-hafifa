import { LoaderFunction, defer } from "react-router-dom";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import AuthService from "../../AuthService";
import { Deposit } from "../../models/deposit";

export type DepositsLoaderData = {
  deposits: Promise<Deposit[]>;
};

export const depositsLoader: LoaderFunction = () => {
  const deposits = (async () => {
    const currentUser = (await AuthService.getCurrentUser())!;
    const isAdmin = AuthService.isUserAdmin(currentUser);

    const fetchedDeposits = await CRUDLocalStorage.getAsyncData<Deposit[]>("deposits");
    return isAdmin ? fetchedDeposits : fetchedDeposits.filter((deposit) => deposit.accountID === currentUser!.id);
  })();
  return defer({
    deposits,
  } satisfies DepositsLoaderData);
};
