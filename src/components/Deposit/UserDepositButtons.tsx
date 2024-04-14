import React, { useState } from "react";
import { Deposit } from "../../models/deposit";
import { Button, CircularProgress, Grid } from "@mui/material";
import { successAlert } from "../../utils/swalAlerts";
import CRUDLocalStorage from "../../CRUDLocalStorage";

interface UserDepositButtonsProps {
  deposit: Deposit;
  fetchDeposits: () => Promise<void>;
}

const UserDepositButtons: React.FC<UserDepositButtonsProps> = ({ deposit, fetchDeposits }) => {
  const [isRejectingDeposit, setIsRejectingDeposit] = useState(false);
  const [isAcceptingDeposit, setIsAcceptingDeposit] = useState(false);

  const rejectDeposit = async () => {
    setIsRejectingDeposit(true);
    await CRUDLocalStorage.deleteItemFromList<Deposit>("deposits", deposit);
    successAlert("Deposit was rejected!");
    await fetchDeposits();
  };
  
  const acceptDeposit = async () => {
    setIsAcceptingDeposit(true);

    const acceptedDeposit:Deposit={
        ...deposit,
        status:"Active",
    }

    await CRUDLocalStorage.updateItemInList<Deposit>("deposits",acceptedDeposit)
    successAlert("Deposit was accepted!");
    await fetchDeposits();
  };

  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item>
        <Button
          sx={{
            backgroundColor: "red",
            fontFamily: "Poppins",
            fontSize: 18,
            borderRadius: 2,
            mb: 3,
            width:"88.5px",
            height: "43.5px",
            color: "white",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          disabled={isRejectingDeposit || isAcceptingDeposit}
          onClick={rejectDeposit}
        >
          {isRejectingDeposit ? <CircularProgress size={30} sx={{ fontSize: 30, color: "white" }} /> : "Reject"}
        </Button>
      </Grid>
      <Grid item>
        <Button
          sx={{
            backgroundColor: "green",
            fontFamily: "Poppins",
            fontSize: 18,
            borderRadius: 2,
            mb: 3,
            width:"88.5px",
            height: "43.5px",
            color: "white",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}
          disabled={isAcceptingDeposit || isRejectingDeposit}
          onClick={acceptDeposit}
        >
          {isAcceptingDeposit ? <CircularProgress size={30} sx={{ fontSize: 30, color: "white" }} /> : "Accept"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default UserDepositButtons;
