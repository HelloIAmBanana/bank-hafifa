import { Button, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { User } from "../../models/user";
import { Fragment } from "react/jsx-runtime";

interface OverviewGridPanel {
  isTableLoading: boolean;
  userOldBalance: number | undefined;
  isButtonLoading: boolean;
  currentUser: User;
  openPaymentModal: () => void;
}

const OverviewPanel: React.FC<OverviewGridPanel> = ({
  isTableLoading,
  userOldBalance,
  isButtonLoading,
  currentUser,
  openPaymentModal,
}) => {
  return (
    <Fragment>
      <Typography variant="h4" fontFamily={"Poppins"} fontWeight={"bold"}>
        Overview
      </Typography>
      <Grid container mt={2} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={4} md={7} lg={6}>
          <Paper
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f7f7ff",
              borderRadius: 5,
              textAlign: "center",
              borderColor: "#F50057",
              borderStyle: "solid",
            }}
          >
            <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
              Your Balance💰
            </Typography>
            {isTableLoading ? (
              <center>
                <Skeleton/>
              </center>
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "bold",
                  fontSize: 36,
                }}
              >
                {!isButtonLoading ? `${currentUser.balance} $` : `${userOldBalance} $`}
              </Typography>
            )}
          </Paper>

          <Button onClick={openPaymentModal} type="submit" sx={{ width: "100%", borderRadius: 2 }}>
            Make A Payment💸
          </Button>
        </Grid>
        <Grid item xs={4} md={7} lg={6}>
          <Paper
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f7f7ff",
              borderRadius: 5,
              textAlign: "center",
              borderColor: "#F50057",
              borderStyle: "solid",
            }}
          >
            <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
              Credit Limit🪙
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Poppins",
                fontWeight: "bold",
                fontSize: 36,
              }}
            >
              123,456 $
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default OverviewPanel;
