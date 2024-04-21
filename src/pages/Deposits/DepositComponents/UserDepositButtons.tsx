import React, { useContext, useState } from "react";
import { Deposit } from "../../../models/deposit";
import { Button, CircularProgress, Grid } from "@mui/material";
import { successAlert } from "../../../utils/swalAlerts";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { User } from "../../../models/user";
import { UserContext } from "../../../UserProvider";
import { Transaction } from "../../../models/transactions";
import { generateUniqueId, getUserFullName } from "../../../utils/utils";

interface UserDepositButtonsProps {
  deposit: Deposit;
}

const UserDepositButtons: React.FC<UserDepositButtonsProps> = ({ deposit }) => {
  const [isRejectingDeposit, setIsRejectingDeposit] = useState(false);
  const [currentUser, setCurrentUser] = useContext(UserContext);

  const [isAcceptingDeposit, setIsAcceptingDeposit] = useState(false);

  const rejectDeposit = async () => {
    setIsRejectingDeposit(true);
    await CRUDLocalStorage.deleteItemFromList<Deposit>("deposits", deposit);
    successAlert("Deposit was rejected!");
  };

  const acceptDeposit = async () => {
    setIsAcceptingDeposit(true);

    const acceptedDeposit: Deposit = {
      ...deposit,
      status: "Active",
    };

    const updatedUser: User = {
      ...currentUser!,
      balance: currentUser!.balance - deposit.depositAmount,
    };

    const date = new Date().toISOString();

    const newTransaction: Transaction = {
      senderID: currentUser!.id,
      date: date,
      amount: -deposit.depositAmount,
      reason: "Created a deposit",
      receiverID: "!bank!",
      senderName: getUserFullName(currentUser!),
      receiverName: "Bank",
      id: generateUniqueId(),
    };

    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    setCurrentUser(updatedUser);
    await CRUDLocalStorage.updateItemInList<Deposit>("deposits", acceptedDeposit);
    successAlert("Deposit was accepted!");
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
            width: "88.5px",
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
            width: "88.5px",
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
