import { RouteObject } from "react-router-dom";
import SignInPage from "../pages/Signin";
import SignUpPage from "../pages/Signup";
import ForgotPasswordPage from "../pages/ForgotPassword";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path:"/forgot-password",
    element:<ForgotPasswordPage/>
  }
];

export default publicRoutes;
