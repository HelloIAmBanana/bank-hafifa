import { Grid, Typography } from "@mui/material";
import { Loan } from "../../../models/loan";
import LoanBox from "./LoanBox";

interface LoanRowsProps {
  loans: Loan[];
  title: string;
}

const LoansRow: React.FC<LoanRowsProps> = ({ loans, title }) => {
  return (
    <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
      <Typography variant="h5" fontFamily="Poppins">
        {title}
      </Typography>
      <Grid
        sx={{
          mt: 2,
          overflowX: loans.length > 2 ? "auto" : "visible",
          display: "flex",
          flexDirection: "row",
          maxWidth: "100vh",
          width: "auto",
        }}
      >
        {loans.length > 0 ? (
          loans.map((loan, index) => (
            <Grid item key={index} mr={2}>
              <LoanBox loan={loan} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" fontFamily="Poppins" gutterBottom mb={5}>
            There Aren't Any {title} Loans
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default LoansRow;
