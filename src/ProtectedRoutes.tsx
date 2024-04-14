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
import { errorAlert, successAlert } from "./utils/swalAlerts";
import { Notification } from "./models/notification";

function exctractPathFromAdminRoute(path: string) {
  if (!path.includes("/admin/")) return path;
  const normalPath = path.slice(6);
  return normalPath;
}

const getNotification = (notification: string) => {
  switch (notification) {
    case "cardApproved":
      return successAlert("Your card request was approved by an admin!");
    case "cardDeclined":
      return errorAlert("Your card request was declined by an admin!");
    case "loanApproved":
      return successAlert("Your loan request was approved by an admin!");
    case "loanDeclined":
      return errorAlert("Your loan request was declined by an admin!");
    case "newTransaction":
      return successAlert("You have received a new transaction while you were offline!");
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

  const fetchUserNotifications = async () => {
    if (currentUser) {
      const notifications = await CRUDLocalStorage.getAsyncData<Notification[]>("notifications");
      const userNotifications = notifications.filter((notification) => notification.accountID === currentUser.id);

      userNotifications.forEach(async (notification) => {
        getNotification(notification.type);

        await CRUDLocalStorage.deleteItemFromList("notifications", notification);
      });
    }
  };

  const blockUnpayingUsers = async () => {
    const currentDate = new Date();

    const loans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");

    const expiredLoans = loans.filter((loan) => {
      const [hours, minutes] = loan.expireDate.split(":").map(Number);

      const expirationDateTime = new Date();
      expirationDateTime.setHours(hours);
      expirationDateTime.setMinutes(minutes);
      expirationDateTime.setSeconds(0);

      return expirationDateTime < currentDate && loan.status === "approved";
    });

    for (const loan of expiredLoans) {
      await CRUDLocalStorage.addItemToList("blocked", loan.accountID);
      await CRUDLocalStorage.deleteItemFromList("loans", loan);
    }
    
    const blockedList = await CRUDLocalStorage.getAsyncData<string[]>("blocked");
    const uniqueBlockedUsers = [...new Set(blockedList)];
    await CRUDLocalStorage.setAsyncData("blocked", uniqueBlockedUsers);
    setBlockedUsers(uniqueBlockedUsers);
  };

  useEffect(() => {
    storeCurrentUser();
    blockUnpayingUsers();
    fetchUserNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const currentRoute = location.pathname;
  const isPublicRoute = ["/", "/signup"].includes(currentRoute);
  const isAdminRoute = [
    "/admin/cards",
    "/admin/loans",
    "/admin/deposits",
    "/admin/users",
    "/settings",
    "/home",
  ].includes(currentRoute);

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
