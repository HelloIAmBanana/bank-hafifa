import { RouteObject } from "react-router-dom";
import ProfileSettingsPage from "../pages/ProfileSettings";
import Home from "../pages/Home";
import { transactionsLoader } from "../pages/Home/transactionsLoader";

const userRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <ProfileSettingsPage />,
  },
  {
    path: "home",
    element: (
        <Home />
    ),
    loader: transactionsLoader

  },
];

export default userRoutes;
