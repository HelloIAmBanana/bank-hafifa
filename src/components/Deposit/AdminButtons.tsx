import { useState } from "react";
import { Deposit } from "../../models/deposit";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { successAlert } from "../../utils/swalAlerts";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useFetchDepositsContext } from "../../contexts/fetchDepositsContext";


interface AdminDepositButtonsProps {
  deposit: Deposit;
}

const AdminDepositButtons: React.FC<AdminDepositButtonsProps> = ({ deposit}) => {
  const [isCancelingDeposit, setIsCancelingDeposit] = useState(false);

  const cancelDeposit = async () => {
    setIsCancelingDeposit(true);
    await CRUDLocalStorage.deleteItemFromList<Deposit>("deposits", deposit);
    successAlert("Deposit was canceled!");
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Button
        sx={{
          backgroundColor: "red",
          fontFamily: "Poppins",
          fontSize: 18,
          borderRadius: 2,
          mb: 3,
          width: "169px",
          height: "43.5px",
          color: "white",
          "&:hover": {
            backgroundColor: "darkred",
          },
        }}
        disabled={isCancelingDeposit}
        onClick={cancelDeposit}
      >
        {isCancelingDeposit ? <CircularProgress size={30} sx={{ fontSize: 30, color: "white" }} /> : "Cancel Deposit"}
      </Button>
    </Grid>
  );
};

export default AdminDepositButtons;
