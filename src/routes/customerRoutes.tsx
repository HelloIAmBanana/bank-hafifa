import { RouteObject } from "react-router-dom";
import CardsPage from "../pages/Cards";
import LoansPage from "../pages/Loans";
import DepositsPage from "../pages/Deposits";
import { Card } from "../models/card";
import { genericLoader } from "../utils/genericLoader";
import { Loan } from "../models/loan";
import { Deposit } from "../models/deposit";

const customerRoutes: RouteObject[] = [
  {
    element: <CardsPage />,
    path: "cards",
    loader: genericLoader<Card>("cards"),
  },
  {
    element: <LoansPage />,
    path: "loans",
    loader: genericLoader<Loan>("loans"),
  },
  {
    element: <DepositsPage />,
    path: "deposits",
    loader: genericLoader<Deposit>("deposits"),
  },
];

export default customerRoutes;
