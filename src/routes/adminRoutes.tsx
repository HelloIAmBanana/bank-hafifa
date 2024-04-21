import { RouteObject } from "react-router-dom";
import { FetchCardsProvider } from "../contexts/fetchCardsContext";
import CardsPage from "../pages/Cards";
import LoansPage from "../pages/Loans";
import { FetchLoansProvider } from "../contexts/fetchLoansContext";
import { FetchDepositsProvider } from "../contexts/fetchDepositsContext";
import DepositsPage from "../pages/Deposits";
import userManagementRoutes from "./userManagementRoutes";
import { CardLoader } from "../pages/Cards/cardsLoader";
import { loansLoader } from "../pages/Loans/loansLoader";
import { depositsLoader } from "../pages/Deposits/depositsLoader";

const adminRoutes: RouteObject[] = [
    {
        path:"admin",
        children:[
          {
            element:<FetchCardsProvider><CardsPage /></FetchCardsProvider>,
            path:"cards",
            loader:CardLoader
          },
          {
            element:<FetchLoansProvider><LoansPage /></FetchLoansProvider>,
            path:"loans",
            loader:loansLoader
          },
          {
            element:<FetchDepositsProvider><DepositsPage /></FetchDepositsProvider>,
            path:"deposits",
            loader:depositsLoader
          },
          ...userManagementRoutes
        ]
      }
];

export default adminRoutes;
