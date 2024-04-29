import { RouteObject } from "react-router-dom";
import AdminUsersPage from "../pages/adminPages/Users";
import { usersLoader } from "../pages/adminPages/Users/usersLoader";
import customerRoutes from "./customerRoutes";

const userManagementRoutes: RouteObject[] = [
  {
    path: "users",
    children: [
      {
        index: true,
        element: <AdminUsersPage />,
        loader: usersLoader,
      },
      {
        path: ":userID",
        children: [...customerRoutes],
      },
    ],
  },
];

export default userManagementRoutes;
