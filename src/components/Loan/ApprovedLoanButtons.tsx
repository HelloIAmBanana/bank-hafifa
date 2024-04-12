import React, { useContext, useState } from "react";
import { Loan } from "../../models/loan";
import { Box, Button, CircularProgress, Grid, Input, Modal, Typography } from "@mui/material";
import { UserContext } from "../../UserProvider";
import { User } from "../../models/user";
import CRUDLocalStorage from "../../CRUDLocalStorage";

interface ApprovedLoansButtonsProps {
  fetchLoans: () => Promise<void>;
  loan: Loan;
}

const ApprovedLoansButtons: React.FC<ApprovedLoansButtonsProps> = ({ loan, fetchLoans }) => {
  const [isDepositing, setIsDepositing] = useState(false);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isLoanApprovalModalOpen, setIsLoanApprovalModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);

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

    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    setCurrentUser(updatedUser);

    if (depositAmount >= neededAmount) {
      await CRUDLocalStorage.deleteItemFromList<Loan>("loans", loan);
    }
    
    await fetchLoans();
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
            <Input
              type="number"
              placeholder="Enter Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(+e.target.value.replace(/[^0-9]/g, ""))}
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
