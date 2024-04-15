import { useContext, useEffect, useMemo } from "react";
import { UserContext } from "../../UserProvider";
import { Box, Container, Grid, Skeleton, Typography } from "@mui/material";
import DepositRows from "../../components/Deposit/DepositRows";
import { useFetchDepositsContext } from "../../contexts/fetchDepositsContext";

const DepositsPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const { fetchDeposits, isLoading, deposits } = useFetchDepositsContext();

  const activeDeposits = useMemo(() => {
    return deposits.filter((deposit) => deposit.status === "Active");
  }, [deposits]);

  const offeredDeposits = useMemo(() => {
    return deposits.filter((deposit) => deposit.status === "Offered");
  }, [deposits]);

  const withdrawnDeposits = useMemo(() => {
    return deposits.filter((deposit) => deposit.status === "Withdrawn");
  }, [deposits]);

  document.title = "Deposits";

  useEffect(() => {
    fetchDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <Grid container justifyContent="flex-start">
      <Box component="main" sx={{ flexGrow: 0, ml: 15 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                  <Grid item xs={12} justifyContent="flex-start">
                    <Typography variant="h3" fontFamily="Poppins">
                      Deposits
                    </Typography>
                  </Grid>
                </Grid>

                {isLoading ? (
                  <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                    <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                  </Grid>
                ) : (
                  <Box>
                    <DepositRows deposits={activeDeposits} title="Active" />
                    <DepositRows deposits={offeredDeposits} title="Offered" />
                    <DepositRows deposits={withdrawnDeposits} title="Withdrawn" />
                  </Box>
                )}
              </Grid>
            </Box>
          </Grid>
        </Container>
      </Box>
    </Grid>
  );
};

export default DepositsPage;
