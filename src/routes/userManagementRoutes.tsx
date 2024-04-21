import { RouteObject } from "react-router-dom";
import { FetchUsersProvider } from "../contexts/fetchUserContext";
import { FetchCardsProvider } from "../contexts/fetchCardsContext";
import { FetchLoansProvider } from "../contexts/fetchLoansContext";
import CardsPage from "../pages/Cards";
import AdminUsersPage from "../pages/adminPages/users";
import LoansPage from "../pages/Loans";
import DepositsPage from "../pages/Deposits";
import { FetchDepositsProvider } from "../contexts/fetchDepositsContext";
import { CardLoader } from "../pages/Cards/cardsLoader";
import { loansLoader } from "../pages/Loans/loansLoader";
import { depositsLoader } from "../pages/Deposits/depositsLoader";
import { userLoader } from "../pages/adminPages/users/usersLoader";

const userManagementRoutes: RouteObject[] = [
    {
        path:"users",
        children:[
          {
            index: true,
            element: <FetchUsersProvider><AdminUsersPage /></FetchUsersProvider>,
            loader:userLoader
          },
          {
            element:<FetchCardsProvider><CardsPage /></FetchCardsProvider>,
            path:"cards/:userID",
            loader:CardLoader
          },
          {
            element:<FetchLoansProvider><LoansPage /></FetchLoansProvider>,
            path:"loans/:userID",
            loader:loansLoader
          },
          {
            element:<FetchDepositsProvider><DepositsPage /></FetchDepositsProvider>,
            path:"deposits/:userID",
            loader:depositsLoader
          },
        ]
      }
];

export default userManagementRoutes;
