import { createBrowserRouter } from "react-router-dom";
import { AuthHandlerRoute } from "../ProtectedRoutes";
import publicRoutes from "./publicRoutes";
import customerRoutes from "./customerRoutes";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";

const router = createBrowserRouter([
  {
    element: <AuthHandlerRoute />,
    children: [...publicRoutes, ...userRoutes, ...customerRoutes, ...adminRoutes],
  },
]);

export default router;
