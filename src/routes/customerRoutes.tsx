import { RouteObject } from "react-router-dom";
import { FetchCardsProvider } from "../contexts/fetchCardsContext";
import CardsPage from "../pages/Cards";
import LoansPage from "../pages/Loans";
import { FetchLoansProvider } from "../contexts/fetchLoansContext";
import { FetchDepositsProvider } from "../contexts/fetchDepositsContext";
import DepositsPage from "../pages/Deposits";

const customerRoutes: RouteObject[] = [
    {
        element:<FetchCardsProvider><CardsPage /></FetchCardsProvider>,
        path:"cards"
      },
      {
        element:<FetchLoansProvider><LoansPage /></FetchLoansProvider>,
        path:"loans"
      },
      {
        element:<FetchDepositsProvider><DepositsPage /></FetchDepositsProvider>,
        path:"deposits"
      },
];

export default customerRoutes;
