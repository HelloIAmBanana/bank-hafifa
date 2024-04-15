import { Outlet } from "react-router-dom";
import { FetchLoansProvider } from "./contexts/fetchLoansContext";
import { FetchDepositsProvider } from "./contexts/fetchDepositsContext";
import { FetchTransactionsProvider } from "./contexts/fetchTransactionsContext";
export const FetchProvider = () => {
    return(
  <FetchLoansProvider>
    <FetchDepositsProvider>
      <FetchTransactionsProvider>
        <Outlet />
      </FetchTransactionsProvider>
    </FetchDepositsProvider>
  </FetchLoansProvider>);
};
