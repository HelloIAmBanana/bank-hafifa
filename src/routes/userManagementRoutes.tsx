import { RouteObject } from "react-router-dom";
import { FetchUsersProvider } from "../contexts/fetchUserContext";
import { FetchCardsProvider } from "../contexts/fetchCardsContext";
import { FetchLoansProvider } from "../contexts/fetchLoansContext";
import CardsPage from "../pages/Cards";
import AdminUsersPage from "../pages/adminPages/users";
import LoansPage from "../pages/Loans";
import DepositsPage from "../pages/Deposits";
import { FetchDepositsProvider } from "../contexts/fetchDepositsContext";

const userManagementRoutes: RouteObject[] = [
    {
        path:"users",
        children:[
          {
            index: true,
            element: <FetchUsersProvider><AdminUsersPage /></FetchUsersProvider>
          },
          {
            element:<FetchCardsProvider><CardsPage /></FetchCardsProvider>,
            path:"cards/:userID"
          },
          {
            element:<FetchLoansProvider><LoansPage /></FetchLoansProvider>,
            path:"loans/:userID"
          },
          {
            element:<FetchDepositsProvider><DepositsPage /></FetchDepositsProvider>,
            path:"deposits/:userID"
          },
        ]
      }
];

export default userManagementRoutes;
