import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "./AuthService";
import UserProvider, { UserContext } from "./UserProvider";
import FirstLoadProvider from "./FirstLoanProvider";
import { useContext } from "react";

export const AuthHandlerRoute = () => {
  const [currentUser] = useContext(UserContext);

  const isAuthenticated = AuthService.isUserAuthenticated();
  // const isAdmin = AuthService.isUserAdmin(currentUser!)
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
