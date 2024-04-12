import { Grid, Paper, Typography } from "@mui/material";
import { Loan } from "../../models/loan";
import thunderIcon from "../../imgs/Icons/Thunder.svg";
import LoanOfferButtons from "./LoanOfferButtons";
import PendingLoanButtons from "./PendingLoanButtons";
import ApprovedLoansButtons from "./ApprovedLoanButtons";

interface LoansProps {
  loan: Loan;
  isUserAdmin?: boolean;
  fetchLoans: () => Promise<void>;
}

const Loans: React.FC<LoansProps> = ({ loan, fetchLoans, isUserAdmin }) => {
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
            marginBottom: 2,
          }}
          elevation={16}
        >
          <Grid container justifyContent="space-between" spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start" mt={3} ml={2}>
              <Grid item xs={4} sm={4} md={6} key={1} sx={{ ml: 2, mt: 2 }}>
                {loan.status === "approved" && (
                  <Typography sx={{ color: "white", fontFamily: "Poppins", opacity: 0.65 }}>
                    Left to pay: $
                    {Math.ceil(loan.loanAmount + loan.loanAmount * (loan.interest / 100) - loan.paidBack)}
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
                  ${loan.loanAmount}
                </Typography>
              </center>
            </Grid>
            {isUserAdmin && loan.status === "pending" && (
              <Grid item xs={8} sm={8} md={8} key={4} sx={{ ml: 1, mt: 8 }}>
                <Typography sx={{ color: "white", fontFamily: "Poppins", opacity: 0.65 }}>{loan.loanOwner}</Typography>
              </Grid>
            )}
            {loan.status !== "pending" && (
              <>
                <Grid item xs={8} sm={8} md={8} key={4} sx={{ ml: 1, mt: 1 }}>
                  <Typography sx={{ color: "white", fontFamily: "Poppins", opacity: 0.65 }}>Interest Rate</Typography>
                  <Typography sx={{ color: "white", fontFamily: "Poppins", opacity: 0.65 }}>
                    {loan.interest}%
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={8} key={5} sx={{ ml: 1, mt: -1 }}>
                  <Typography sx={{ color: "white", fontFamily: "Poppins", opacity: 0.65 }}>
                    Exp: {loan.expireDate}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
        {/* Loan Buttons */}
        {loan.status === "approved" && <ApprovedLoansButtons loan={loan} fetchLoans={fetchLoans} />}
        {loan.status === "offered" && !isUserAdmin && <LoanOfferButtons loan={loan} fetchLoans={fetchLoans} />}
        {loan.status === "pending" && isUserAdmin && <PendingLoanButtons loan={loan} fetchLoans={fetchLoans} />}
      </Grid>
    </Grid>
  );
};

export default Loans;
