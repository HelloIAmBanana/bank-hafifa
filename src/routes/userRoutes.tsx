import { RouteObject } from "react-router-dom";
import ProfileSettingsPage from "../pages/ProfileSettings";
import { FetchTransactionsProvider } from "../contexts/fetchTransactionsContext";
import { Home } from "@mui/icons-material";

const userRoutes: RouteObject[] = [
    {
        path:"settings",
        element:<ProfileSettingsPage />
      },
      {
        path:"home",
        element:<FetchTransactionsProvider><Home /></FetchTransactionsProvider>
      },
];

export default userRoutes;
