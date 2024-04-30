import { Grid, Paper, Typography } from "@mui/material";
import thunderIcon from "../../../imgs/icons/Thunder.svg";
import React, { useContext, useMemo } from "react";
import { Deposit } from "../../../models/deposit";
import AdminDepositButtons from "./AdminButtons";
import UserDepositButtons from "./UserDepositButtons";
import AuthService from "../../../AuthService";
import { UserContext } from "../../../UserProvider";
import { formatIsoStringToDate } from "../../../utils/utils";
import WithdrawDepositButton from "./WithdrawDepositButton";
import { useLocation } from "react-router-dom";

interface DepositBoxProps {
  deposit: Deposit;
}

const DepositBox: React.FC<DepositBoxProps> = ({ deposit }) => {
  const [currentUser] = useContext(UserContext);

  const location = useLocation();

  const isSpectating = `/admin/users/${deposit.accountID}/deposits` === location.pathname;

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  return (
    <>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item>
          <Paper
            sx={{
              width: "14rem",
              height: 250,
              border: "3px solid black",
              borderRadius: 3,
              backgroundColor: "#AA1261",
              backgroundImage: "radial-gradient(at left top, #AA1261, #E22E19)",
              marginBottom: 2,
            }}
            elevation={16}
          >
            {
              <Grid
                container
                justifyContent="space-between"
                spacing={{ xs: 3, md: 3 }}
                columns={{ xs: 12, sm: 12, md: 12 }}
              >
                <Grid container direction="row" justifyContent="space-between" alignItems="flex-start" mt={3} ml={2}>
                  <Grid item xs={9} key={1} sx={{ ml: 2, mt: 2 }}>
                    <Typography sx={{ color: "white", fontFamily: "Poppins" }}>
                      {isAdmin ? `Status: ${deposit.status}` : " "}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} key={1} sx={{ mr: -5, mt: 2 }}>
                    <img width="30rem" height="30rem" src={`${thunderIcon}`} alt="Thunder" />
                  </Grid>
                </Grid>
                <Grid item xs={12} />
                <Grid item xs={12} key={3} sx={{ mt: -3 }}>
                  <center>
                    <Typography color="white" fontFamily="CreditCard" fontSize={18}>
                      ${deposit.depositAmount}
                    </Typography>
                    <Typography sx={{ color: "white", fontFamily: "Poppins", opacity: 0.65 }}>
                      ${Math.ceil(deposit.depositAmount + deposit.depositAmount * (deposit.interest / 100))}
                    </Typography>
                  </center>
                </Grid>
                <Grid item xs={12} key={4} sx={{ ml: 1 }}>
                  <Typography sx={{ color: "white", fontFamily: "Poppins" }}>
                    {isAdmin ? deposit.depositOwner : " "}
                  </Typography>
                </Grid>

                <Grid item xs={12} key={5} sx={{ mt: -2, ml: 1 }}>
                  <Typography sx={{ color: "white", fontFamily: "Poppins" }}>
                    {formatIsoStringToDate(deposit.expireDate, "dd/MM/yyyy HH:mm")}
                  </Typography>
                </Grid>
              </Grid>
            }
          </Paper>
        </Grid>
      </Grid>
      {!isSpectating &&
        (isAdmin ? (
          deposit.status === "Offered" && <AdminDepositButtons deposit={deposit} />
        ) : deposit.status === "Offered" ? (
          <UserDepositButtons deposit={deposit} />
        ) : deposit.status === "Withdrawable" ? (
          <WithdrawDepositButton deposit={deposit} />
        ) : (
          <></>
        ))}
      {/* {!isSpectating && deposit.status === "Offered" && isAdmin && <AdminDepositButtons deposit={deposit} />}
      {!isSpectating && deposit.status === "Offered" && !isAdmin && <UserDepositButtons deposit={deposit} />}
      {!isSpectating && deposit.status === "Withdrawable" && !isAdmin && <WithdrawDepositButton deposit={deposit} />} */}
    </>
  );
};
export default DepositBox;
