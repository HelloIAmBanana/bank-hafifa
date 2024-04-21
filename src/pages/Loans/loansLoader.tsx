import { LoaderFunction, defer } from "react-router-dom";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import AuthService from "../../AuthService";
import { Loan } from "../../models/loan";

export type LoansLoaderData = {
  loans: Promise<Loan[]>;
};

export const loansLoader: LoaderFunction = () => {
  const loans = (async () => {
    const currentUser = (await AuthService.getCurrentUser())!;
    const isAdmin = AuthService.isUserAdmin(currentUser);

    const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
    return isAdmin ? fetchedLoans : fetchedLoans.filter((loan) => loan.accountID === currentUser!.id);
  })();
  return defer({
    loans,
  } satisfies LoansLoaderData);
};
