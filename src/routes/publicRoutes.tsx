import { RouteObject } from "react-router-dom";
import SignInPage from "../pages/Signin";
import SignUpPage from "../pages/Signup";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
];

export default publicRoutes;
