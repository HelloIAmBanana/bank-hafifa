import { Grid, Typography } from "@mui/material";
import { Deposit } from "../../models/deposit";
import DepositBox from "./DepositBox";

interface DepositRowsProps {
  deposits: Deposit[];
  title: string;
}

const DepositRows: React.FC<DepositRowsProps> = ({ deposits, title}) => {
  if (deposits.length <= 0) return null;
  
  return (
    <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
      <Typography variant="h5" fontFamily="Poppins">
        {title}
      </Typography>
      <Grid
        sx={{
          mt: 2,
          overflowX: deposits.length > 2 ? "auto" : "visible",
          display: "flex",
          flexDirection: "row",
          maxWidth: "100vh",
          width: "auto",
        }}
      >
        {deposits.map((deposit, index) => (
          <Grid item key={index} mr={2}>
            <DepositBox deposit={deposit}/>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default DepositRows;
