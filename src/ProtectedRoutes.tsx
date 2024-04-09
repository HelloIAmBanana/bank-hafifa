import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "./AuthService";
import UserProvider from "./UserProvider";
import FirstLoadProvider from "./FirstLoadProvider";

export const AuthHandlerRoute = () => {

  const isAuthenticated = AuthService.isUserAuthenticated();
  const location = useLocation();
  const currentRoute = location.pathname;
  const isPublicRoute = ["/", "/signup"].some((route) => route === currentRoute);

  if (isAuthenticated) {
    return isPublicRoute ? (
      <UserProvider>
        <FirstLoadProvider>
          <Navigate to="/home" />
        </FirstLoadProvider>
      </UserProvider>
    ) : (
      <UserProvider>
        <FirstLoadProvider>
          <Outlet />
        </FirstLoadProvider>
      </UserProvider>
    );
  } else {
    return isPublicRoute ? <Outlet /> : <Navigate to="/" />;
  }
};
