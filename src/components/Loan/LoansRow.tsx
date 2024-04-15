import { Grid, Typography, useTheme } from "@mui/material";
import { Loan } from "../../models/loan";
import LoanBox from "./LoanBox";

interface LoanRowsProps {
  loans: Loan[];
  title: string;
}

const LoansRow: React.FC<LoanRowsProps> = ({ loans, title }) => {
  const theme = useTheme();

  if (loans.length <= 0) return null;

  return (
    <Grid container>
      <Grid item xs={12} mt={2}>
        <Typography variant="h5" fontFamily="Poppins">
          {title}
        </Typography>
      </Grid>
      <Grid
        item
        xl={10}
        lg={7}
        md={5}
        sm={3}
        xs={2}
        sx={{
          mt: 2,
          overflowX: "auto",
          display: "flex",
          flexDirection: "row",
          maxWidth: {
            xs: `calc(100% - ${theme.spacing(2)})`,
            sm: `calc(100% - ${theme.spacing(3)})`,
            md: `calc(100% - ${theme.spacing(5)})`,
            lg: `calc(100% - ${theme.spacing(7)})`,
            xl: `calc(100% - ${theme.spacing(10)})`,
          },
        }}
      >
        {loans.map((loan, index) => (
          <Grid item key={index} mr={2}>
            <LoanBox loan={loan} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default LoansRow;
