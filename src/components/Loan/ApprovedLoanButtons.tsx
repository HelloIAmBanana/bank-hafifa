import React, { useContext, useState } from "react";
import { Loan } from "../../models/loan";
import { Box, Button, CircularProgress, Grid, Modal, TextField, Typography } from "@mui/material";
import { UserContext } from "../../UserProvider";
import { useFetchLoansContext } from "./FetchLoansContext";
import { User } from "../../models/user";
import CRUDLocalStorage from "../../CRUDLocalStorage";

interface ApprovedLoansButtonsProps {
  loan: Loan;
}

const ApprovedLoansButtons: React.FC<ApprovedLoansButtonsProps> = ({ loan}) => {
  const [isDepositing, setIsDepositing] = useState(false);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isLoanApprovalModalOpen, setIsLoanApprovalModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const { fetchUserLoans } = useFetchLoansContext();

  const openLoanApprovalModal = () => {
    setIsLoanApprovalModalOpen(true);
  };
  const closeLoanApprovalModal = () => {
    if (isDepositing) return;
    setIsLoanApprovalModalOpen(false);
  };

  const handlePayBackLoan = async () => {
    if (!currentUser || currentUser.balance < depositAmount) return;

    const totalLoanAmount = loan.loanAmount + loan.loanAmount * (loan.interest / 100);
    const neededAmount = Math.ceil(totalLoanAmount - loan.paidBack);
    setIsDepositing(true);

    const amountToDeduct = depositAmount >= neededAmount ? neededAmount : depositAmount;
    const updatedUser: User = {
      ...currentUser,
      balance: currentUser.balance - amountToDeduct,
    };
    const updatedLoan: Loan = {
      ...loan,
      paidBack: loan.paidBack + depositAmount,
    };

    if (depositAmount >= neededAmount) {
      await CRUDLocalStorage.deleteItemFromList<Loan>("loans", loan);
    }

    await CRUDLocalStorage.updateItemInList<Loan>("loans", updatedLoan);
    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    setCurrentUser(updatedUser);

    await fetchUserLoans();
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
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}
          onClick={openLoanApprovalModal}
        >
          Pay Back
        </Button>
      </Grid>
      <Modal
        open={isLoanApprovalModalOpen}
        onClose={closeLoanApprovalModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <center>
            <Typography variant="h5" sx={{ fontFamily: "Poppins" }}>
              Enter amount
            </Typography>
            <TextField
              type="number"
              placeholder="Enter Amount"
              value={depositAmount}
              InputProps={{
                inputProps: { 
                    max: Math.ceil((loan.loanAmount + loan.loanAmount * (loan.interest / 100))-loan.paidBack), min: 1 
                }
            }}
              onChange={(e) => setDepositAmount(+e.target.value)}
              sx={{ mt: 2, width: "100%", fontFamily: "Poppins" }}
            />

            <Button type="submit" onClick={handlePayBackLoan} disabled={isDepositing} sx={{ width: "227.5px" }}>
              {isDepositing ? (
                <CircularProgress size={18} thickness={20} sx={{ fontSize: 30, color: "white" }} />
              ) : (
                "Pay Loan"
              )}
            </Button>
          </center>
        </Box>
      </Modal>
    </Grid>
  );
};

export default ApprovedLoansButtons;
