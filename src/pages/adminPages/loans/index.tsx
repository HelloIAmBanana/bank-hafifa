import * as React from "react";
import { useEffect, useContext } from "react";
import { Grid, Box, Container, Typography, Skeleton } from "@mui/material";
import { UserContext } from "../../../UserProvider";
import LoanBox from "../../../components/Loan/LoanBox";
import { useFetchLoansContext } from "../../../components/Loan/FetchLoansContext";

const AdminLoansPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const { fetchUserLoans, isLoansLoading, loans } = useFetchLoansContext();

  const pendingLoans = React.useMemo(() => {
    return loans.filter((loan) => loan.status === "pending");
  }, [loans]);

  useEffect(() => {
    fetchUserLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Loans Management";

  return (
    <Grid container justifyContent="flex-start">
      <Box component="main" sx={{ ml: 20 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                  <Grid item xs={12}>
                    <Typography variant="h3" fontFamily="Poppins">
                      Loans
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container justifyContent="flex-start">
                    <Typography variant="h5" fontFamily="Poppins">
                      Pending Loan Requests
                    </Typography>
                  </Grid>
                </Grid>

                {isLoansLoading ? (
                  <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                    <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                  </Grid>
                ) : (
                    <Grid container mt={2}>
                      {pendingLoans.map((loan, index) => (
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          xl={4}
                          md={6}
                          sm={12}
                        >
                          <Grid item key={index}>
                            <LoanBox loan={loan}/>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Container>
      </Box>
    </Grid>
  );
};

export default AdminLoansPage;
