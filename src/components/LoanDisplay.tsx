import { Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { Loan } from "../models/loan";
import thunderIcon from "../imgs/icons/Thunder.svg";
import { useContext, useState } from "react";
import { UserContext } from "../UserProvider";
import { User } from "../models/user";
import CRUDLocalStorage from "../CRUDLocalStorage";

interface LoansDisplayProps {
  loan: Loan;
}

const LoansDisplay: React.FC<LoansDisplayProps> = (loan) => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isLoanButtonLoading, setIsLoanButtonLoading]=useState(false)

  const acceptLoan = async () => {
    setIsLoanButtonLoading(true)
    const updatedBalance = currentUser!.balance + +loan.loan.loanAmount;
    const updatedUser: User = {
      ...currentUser!,
      balance: updatedBalance,
    };
    const updatedLoan:Loan={
        ...loan.loan,
        status:"Accepted",
    }
    await CRUDLocalStorage.updateItemInList<Loan>("loans", updatedLoan);
    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    setCurrentUser(updatedUser);
    setIsLoanButtonLoading(false)
  };
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Grid item>
        <Paper
          sx={{
            width: "14rem",
            height: 250,
            border: "3px solid black",
            borderRadius: 3,
            backgroundColor: "#2C2E7A",
            backgroundImage: "linear-gradient(-90deg, #2C2E7A, #512549)",
            marginBottom:2
          }}

          elevation={16}
        >
          <Grid container justifyContent="space-between" spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start" mt={3} ml={2}>
              <Grid item xs={4} sm={4} md={6} key={1} sx={{ ml: 2, mt: 2 }}>
                {loan.loan.status === "Accepted" && (
                  <Typography sx={{color:"white",fontFamily:"Poppins",opacity:0.65}}>
                    Left to pay: $
                    {Math.floor(
                      +loan.loan.loanAmount + +loan.loan.loanAmount * (+loan.loan.interest / 100) - +loan.loan.paidBack
                    )}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={4} sm={4} md={4} key={1} sx={{ mr: -5, mt: 2 }}>
                <img width="30rem" height="30rem" src={`${thunderIcon}`} alt="Thunder" />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} key={2} />
            <Grid item xs={12} sm={12} md={12} key={3} sx={{ mt: -3 }}>
              <center>
                <Typography color="white" fontFamily="CreditCard" fontSize={18}>
                  ${loan.loan.loanAmount}
                </Typography>
              </center>
            </Grid>
            <Grid item xs={8} sm={8} md={8} key={4} sx={{ ml: 1, mt: 1 }}>
              <Typography sx={{color:"white",fontFamily:"Poppins",opacity:0.65}}>
                Interest Rate
              </Typography>
              <Typography sx={{color:"white",fontFamily:"Poppins",opacity:0.65}}>
                {loan.loan.interest}%
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={8} key={5} sx={{ ml: 1, mt: -1 }}>
              <Typography sx={{color:"white",fontFamily:"Poppins",opacity:0.65}}>
                Exp: {loan.loan.expireDate}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      {loan.loan.status === "Appending" && (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          
          <Grid item>
            <Button sx={{ backgroundColor: "green", color: "white"}} disabled={isLoanButtonLoading} onClick={acceptLoan}>{isLoanButtonLoading?<CircularProgress/>:"Aceept"}</Button>
          </Grid>
          <Grid item>
            <Button sx={{ backgroundColor: "red", color: "white" }} disabled={isLoanButtonLoading}>Reject</Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default LoansDisplay;
