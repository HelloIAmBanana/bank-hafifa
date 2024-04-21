import { Button, CircularProgress, Grid } from "@mui/material";
import React, { useContext, useState } from "react";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { Loan } from "../../../models/loan";
import { successAlert } from "../../../utils/swalAlerts";
import { User } from "../../../models/user";
import { UserContext } from "../../../UserProvider";
import { useFetchLoanContext } from "../../../contexts/fetchLoansContext";
import { Transaction } from "../../../models/transactions";
import { generateUniqueId, getUserFullName } from "../../../utils/utils";

interface LoanOfferButtonsProps {
  loan: Loan;
}

const LoanOfferButtons: React.FC<LoanOfferButtonsProps> = ({ loan }) => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const { fetchLoans } = useFetchLoanContext();

  const rejectLoanOffer = async () => {
    setIsRejectLoading(true);
    await CRUDLocalStorage.deleteItemFromList<Loan>("loans", loan);
    successAlert("Loan Offer Rejected!");
    await fetchLoans();
  };

  const acceptLoanOffer = async () => {
    setIsAcceptLoading(true);
    const updatedBalance = currentUser!.balance + loan.loanAmount;
    const updatedUser: User = {
      ...currentUser!,
      balance: updatedBalance,
    };
    const updatedLoan: Loan = {
      ...loan,
      status: "approved",
    };

    const date = new Date().toISOString();

    const newTransaction: Transaction = {
      senderID: "!bank!",
      date: date,
      amount: loan.loanAmount,
      reason: "Took a loan",
      receiverID: currentUser!.id,
      senderName: "Bank",
      receiverName: getUserFullName(currentUser!),
      id: generateUniqueId(),
    };

    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
    await CRUDLocalStorage.updateItemInList<Loan>("loans", updatedLoan);
    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    setCurrentUser(updatedUser);
    await fetchLoans();
    setIsAcceptLoading(false);
  };
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item>
        <Button
          sx={{
            backgroundColor: "green",
            fontFamily: "Poppins",
            fontSize: 18,
            mb: 3,
            color: "white",
            height: "43.5px",
            width: "83.75px",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}
          disabled={isAcceptLoading}
          onClick={acceptLoanOffer}
        >
          {isAcceptLoading ? <CircularProgress /> : "Aceept"}
        </Button>
      </Grid>
      <Grid item>
        <Button
          sx={{
            backgroundColor: "red",
            fontFamily: "Poppins",
            color: "white",
            fontSize: 18,
            height: "43.5px",
            width: "83.75px",
            mb: 3,
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          disabled={isRejectLoading}
          onClick={rejectLoanOffer}
        >
          {isRejectLoading ? <CircularProgress /> : "Reject"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default LoanOfferButtons;
