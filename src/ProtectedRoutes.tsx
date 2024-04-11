import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "./AuthService";
import UserProvider from "./UserProvider";
import NavBar from "./components/NavigationBar/NavBar";
import { Box, Grid, Modal, Typography } from "@mui/material";
import { User } from "./models/user";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/Loader";
import CRUDLocalStorage from "./CRUDLocalStorage";
import blocked from "./imgs/blocked.png";
import { Loan } from "./models/loan";

function exctractPathFromAdminRoute(path: string) {
  if (!path.includes("/admin/")) return path;
  const normalPath = path.slice(6);
  return normalPath;
}

function getTimeFromISO(isoString: string) {
  const time = isoString.slice(11, 16);
  const timeNumber = +time.replace(":","");
  return timeNumber;
}

function isUserBlocked(blockedList: string[], userID: string) {
  const isBlocked = blockedList.includes(userID);
  return isBlocked;
}

export const AuthHandlerRoute = () => {
  const isAuthenticated = AuthService.isUserAuthenticated();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User>();
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const storeCurrentUser = async () => {
    const user = (await AuthService.getCurrentUser()) as User;
    setCurrentUser(user);
  };
 

  const blockUnpayingUsers = async () => {
    const time = new Date().toISOString();
    const loans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
    const unpaidLoans = loans.filter((loan) => (getTimeFromISO(loan.expireDate) <= getTimeFromISO(time))&&((loan.status!=="rejected" ) && (loan.status!=="offered")));
    for (let i = 0; i < unpaidLoans.length; i++) {
      await CRUDLocalStorage.addItemToList("blocked", unpaidLoans[i].accountID);
      await CRUDLocalStorage.deleteItemFromList("loans", unpaidLoans[i])
    }
    await storeBlockedUsers()
  };
 
  const storeBlockedUsers = async () => {
    const hatedUsers = await CRUDLocalStorage.getAsyncData<string[]>("blocked");
    setBlockedUsers(hatedUsers);
  };
  useEffect(() => {
    storeCurrentUser();
    blockUnpayingUsers()
    storeBlockedUsers();
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
      ) : isUserBlocked(blockedUsers, currentUser.id) ? (
        <Modal open={true}><Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh" mr={5}>
        <Typography fontFamily="Poppins" variant="h2">
          UMMM ACTUALLY... U R BLOCKED
        </Typography>
        <img src={`${blocked}`} alt="nerd" />

        <Typography fontFamily="Poppins" variant="h4">
          DONT FUCK WITH THE BANK AND PAY YOUR LOAN NEXT TIME🥶
        </Typography>
      </Grid></Modal>
      ) : (
        <Box sx={{ display: "flex", backgroundColor: "white" }}>
          {isPublicRoute ? (
            <Navigate to="/home" />
          ) : (
            <>
              <NavBar />
              <Grid container direction="column" justifyContent="flex-start" alignItems="center">
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
