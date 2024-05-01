import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "./AuthService";
import UserProvider from "./UserProvider";
import NavBar from "./components/NavigationBar/NavBar";
import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import LoadingScreen from "./components/Loader";
import BlockModal from "./components/BlockModal";
import userStore from "./UserStore";
import { observer } from "mobx-react-lite";

function exctractPathFromAdminRoute(path: string) {
  if (!path.includes("/admin/")) return path;
  const normalPath = path.slice(6);
  return normalPath;
}

export const AuthHandlerRoute = observer(() => {
  const isAuthenticated = AuthService.isUserAuthenticated();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      userStore.fetchCurrentUser();
    }
  }, [isAuthenticated]);


  useEffect(() => {
    userStore.blockUnpayingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const currentRoute = location.pathname;

  const isAdminRoute = [
    "/admin/",
    "/admin/loans",
    "/admin/deposits",
    "/admin/users",
    "/settings",
    "/home",
    "/admin/users/:userID/cards",
    "/admin/users/:userID/deposits",
    "/admin/users/:userID/loans",
  ].some((route) => currentRoute.startsWith(route));

  const isPublicRoute = ["/", "/signup","/forgot-password"].includes(currentRoute);

  const isUserRoute = ["/cards", "/loans", "/deposits", "/users", "/settings", "/home"].includes(currentRoute);

  if (!isAuthenticated) {
    return isPublicRoute ? <Outlet /> : <Navigate to="/" />;
  }

  return (
    <UserProvider>
      {!userStore.currentUser ? (
        <LoadingScreen />
      ) : (
        <Box sx={{ display: "flex", backgroundColor: "white" }}>
          {isPublicRoute ? (
            <Navigate to="/home" />
          ) : (
            <>
              <NavBar />
              <Grid container direction="column" justifyContent="flex-start" alignItems="center">
                {userStore.isUserBlocked(userStore.currentUser.id) && <BlockModal />}
                {userStore.currentUser.role === "admin" ? (
                  isAdminRoute ? (
                    <Outlet />
                  ) : (
                    <Navigate to={`/admin${location.pathname}`} />
                  )
                ) : isUserRoute ? (
                  <Outlet />
                ) : (
                  <Navigate to={exctractPathFromAdminRoute(location.pathname)} />
                )}
              </Grid>
            </>
          )}
        </Box>
      )}
    </UserProvider>
  );
});
