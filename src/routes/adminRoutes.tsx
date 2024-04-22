import { RouteObject } from "react-router-dom";
import userManagementRoutes from "./userManagementRoutes";
import customerRoutes from "./customerRoutes";

const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    children: [...customerRoutes, ...userManagementRoutes],
  },
];

export default adminRoutes;
