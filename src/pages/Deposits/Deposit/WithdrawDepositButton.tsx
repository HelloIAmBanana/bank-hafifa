import React, { useContext, useState } from "react";
import { Deposit } from "../../../models/deposit";
import { Button, CircularProgress, Grid } from "@mui/material";
import { successAlert } from "../../../utils/swalAlerts";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { User } from "../../../models/user";
import { UserContext } from "../../../UserProvider";
import { Transaction } from "../../../models/transactions";
import { generateUniqueId, getUserFullName } from "../../../utils/utils";
import { useRevalidator } from "react-router-dom";

interface WithdrawDepositButtonProps {
  deposit: Deposit;
}

const WithdrawDepositButton: React.FC<WithdrawDepositButtonProps> = ({ deposit }) => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const revalidator = useRevalidator();


  const withdrawDeposit = async () => {
    setIsWithdrawing(true);
    const currentDate = new Date().toISOString();

    const totalDepositAmount = deposit.depositAmount + deposit.depositAmount * (deposit.interest / 100);

    const updatedUser: User = {
      ...currentUser!,
      balance: currentUser!.balance + totalDepositAmount,
    };

    const newTransaction: Transaction = {
      senderID: "!bank!",
      date: currentDate,
      amount: totalDepositAmount,
      reason: "Deposit Withdrawn!",
      receiverID: currentUser!.id,
      senderName: "Bank",
      receiverName: getUserFullName(currentUser!),
      id: generateUniqueId(),
    };

    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
    await CRUDLocalStorage.deleteItemFromList<Deposit>("deposits", deposit);
    setCurrentUser(updatedUser);
    setIsWithdrawing(false);
    revalidator.revalidate()
    successAlert("Withdrew Deposit!");
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item>
        <Button
          sx={{
            backgroundColor: "green",
            fontFamily: "Poppins",
            fontSize: 18,
            borderRadius: 2,
            mb: 3,
            height:"43.5px",
            width:"118px",
            color: "white",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}
          disabled={isWithdrawing}
          onClick={withdrawDeposit}
        >
          {isWithdrawing ? <CircularProgress size={30} sx={{ fontSize: 30, color: "white" }} /> : "Withdraw"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default WithdrawDepositButton;
