import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "./AuthService";
import UserProvider from "./UserProvider";
import NavBar from "./components/NavigationBar/NavBar";
import { Box, Grid } from "@mui/material";
import { User } from "./models/user";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/Loader";

export const AuthHandlerRoute = () => {
  const isAuthenticated = AuthService.isUserAuthenticated();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User>();
  const storeCurrentUser = async () => {
    const user = (await AuthService.getCurrentUser()) as User;
    setCurrentUser(user);
  };

  useEffect(() => {
    storeCurrentUser();
  }, []);

  const currentRoute = location.pathname;
  const isPublicRoute = ["/", "/signup"].some((route) => route === currentRoute);
  const isAdminRoute = ["/admin/cards", "/admin/loans", "/admin/deposits", "/admin/users"].some(
    (route) => route === currentRoute
  );

  if (isAuthenticated) {
    return isPublicRoute ? (
      <UserProvider>
          {!currentUser ? (
            <LoadingScreen/>
          ) : (
            <Box sx={{ display: "flex", backgroundColor: "white" }}>
              <NavBar />
              <Grid container direction="column" justifyContent="flex-start" alignItems="center">
                <Navigate to="/home" />
              </Grid>
            </Box>
          )}
      </UserProvider>
    ) : (
      <UserProvider>
          {!currentUser ? (
            <LoadingScreen/>
          ) : (
            <Box sx={{ display: "flex", backgroundColor: "white" }}>
              <NavBar />
              <Grid container direction="column" justifyContent="flex-start" alignItems="center">
                {isAdminRoute ? (
                  currentUser.role === "admin" ? (
                    <Outlet />
                  ) : (
                    <Navigate to={location.pathname.slice(6)} />
                  )
                ) : (
                  <Outlet />
                )}
              </Grid>
            </Box>
          )}
      </UserProvider>
    );
  } else {
    return isPublicRoute ? <Outlet /> : <Navigate to="/" />;
  }
};
