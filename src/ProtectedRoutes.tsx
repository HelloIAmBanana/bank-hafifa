import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "./AuthService";
import UserProvider from "./UserProvider";
import NavBar from "./components/NavigationBar/NavBar";
import { Box, Grid, Modal, Typography } from "@mui/material";
import { User } from "./models/user";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/Loader";
import CRUDLocalStorage from "./CRUDLocalStorage";
import { Loan } from "./models/loan";
import { notificationAlert } from "./utils/swalAlerts";
import { Notification, NotificationType } from "./models/notification";

function exctractPathFromAdminRoute(path: string) {
  if (!path.includes("/admin/")) return path;
  const normalPath = path.slice(6);
  return normalPath;
}

const showNotification = (notification: NotificationType) => {
  switch (notification) {
    case "cardApproved":
      return notificationAlert("Your card request was approved by an admin!");
    case "cardDeclined":
      return notificationAlert("Your card request was declined by an admin!");
    case "loanApproved":
      return notificationAlert("Your loan request was approved by an admin!");
    case "loanDeclined":
      return notificationAlert("Your loan request was declined by an admin!");
    case "newTransaction":
      return notificationAlert("You have received a new transaction while you were offline!");
    case "newDepositOffer":
      return notificationAlert("You have a new deposit offer!");
  }
};

export const AuthHandlerRoute = () => {
  const isAuthenticated = AuthService.isUserAuthenticated();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User>();
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const storeCurrentUser = async () => {
    const user = (await AuthService.getCurrentUser()) as User;

    setCurrentUser(user);
  };

  const triggerNotifications = async () => {
    const notifications = await CRUDLocalStorage.getAsyncData<Notification[]>("notifications");

    if (!currentUser) return;
    const userNotifications = notifications.filter((notification) => notification.accountID === currentUser.id);

    userNotifications.forEach(async (notification) => {
      showNotification(notification.type);

      await CRUDLocalStorage.deleteItemFromList("notifications", notification);
    });
  };

  const blockUnpayingUsers = async () => {
    const currentDate = new Date().toISOString();

    const loans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");

    const expiredLoans = loans.filter((loan) => loan.expireDate < currentDate);

    const blocked = await CRUDLocalStorage.getAsyncData<string[]>("blocked");
    for (const loan of expiredLoans) {
      if (!blocked.includes(loan.accountID) && loan.status === "approved") {
        await CRUDLocalStorage.addItemToList("blocked", loan.accountID);
      }
      if (loan.status === "approved" || loan.status === "offered") {
        await CRUDLocalStorage.deleteItemFromList("loans", loan);
      }
    }

    const blockedList = await CRUDLocalStorage.getAsyncData<string[]>("blocked");
    setBlockedUsers(blockedList);
  };

  useEffect(() => {
    triggerNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    blockUnpayingUsers();
    storeCurrentUser();
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
    "/admin/users/cards",
    "/admin/users/deposits",
    "/admin/users/loans/:userID",
    "/admin/users/cards/:userID",
    "/admin/users/deposits/:userID",
  ].some((route) => currentRoute.startsWith(route));

  const isPublicRoute = ["/", "/signup"].includes(currentRoute);

  
  const isUserRoute = ["/cards", "/loans", "/deposits", "/users", "/settings", "/home"].includes(currentRoute);

  if (!isAuthenticated) {
    return isPublicRoute ? <Outlet /> : <Navigate to="/" />;
  }

  return (
    <UserProvider>
      {!currentUser ? (
        <LoadingScreen />
      ) : (
        <Box sx={{ display: "flex", backgroundColor: "white" }}>
          {isPublicRoute ? (
            <Navigate to="/home" />
          ) : (
            <>
              <NavBar />
              <Grid container direction="column" justifyContent="flex-start" alignItems="center">
                {blockedUsers.includes(currentUser.id) && (
                  <Modal open={true} sx={{ backgroundColor: "white" }}>
                    <Grid
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="100vh"
                      mr={5}
                    >
                      <Typography fontFamily="Poppins" variant="h2">
                        Your account was blocky blocky!
                      </Typography>
                      <Typography fontFamily="Poppins" variant="h4">
                        Please don't contact us.
                      </Typography>
                    </Grid>
                  </Modal>
                )}
                {currentUser.role === "admin" ? (
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
};
