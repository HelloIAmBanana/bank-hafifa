import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "./AuthService";
import React from "react";
import UserProvider from "./UserProvider";

export const ProtectedRoutes = () => {
  let isAuthenticated = AuthService.isUserAuthenticated();
  return isAuthenticated ? (
    <UserProvider>
      <Outlet />
    </UserProvider>
  ) : (
    <Navigate to="/signin" />
  );
};
export const UnprotectedRoutes = () => {
  let isAuthenticated = AuthService.isUserAuthenticated();
  return isAuthenticated ? (
    <UserProvider>
        <Navigate to="/home" />
    </UserProvider>
  ) : (
    <Outlet/>
  );
};

export const AuthHandlerRoute = () => {
  const isAuthenticated = AuthService.isUserAuthenticated();
  const location = useLocation();
  const currentRoute = location.pathname;
  const isPublicRoute = ["/signin", "/","/signup"].some(route => route === currentRoute);

  if (isAuthenticated) {
    return isPublicRoute ? (
      <UserProvider>
        <Navigate to="/home" />
      </UserProvider>
    ) : (
      <UserProvider>
        <Outlet />
      </UserProvider>
    );
  }  
  return <Outlet/>

}
