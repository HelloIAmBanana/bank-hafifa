import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Grid, Box, Container, Typography, Skeleton } from "@mui/material";
import { UserContext } from "../../../UserProvider";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import Loans from "../../../components/Loan/Loan";
import { Loan } from "../../../models/loan";

const AdminLoansPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const [isLoansLoading, setIsLoansLoading] = useState(false);
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);

  const fetchLoans = async () => {
    setIsLoansLoading(true);
    if (currentUser) {
      try {
        const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
        const filteredLoaned: Loan[] = fetchedLoans.filter((filteredCards) => filteredCards.status === "pending");
        setPendingLoans(filteredLoaned);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setIsLoansLoading(false);
  };

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Loans Management";

  return (
    <Grid container justifyContent="flex-start">
      <Box component="main" sx={{ flexGrow: 0, ml: 15 }}>
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
                  <Box ml={12}>
                    {pendingLoans.length > 0 && (
                      <Grid item mt={2}>
                        <Grid container direction="row">
                          {pendingLoans.map((loan, index) => (
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              lg={6}
                              md={8}
                              sm={12}
                            >
                              <Grid item key={index} sx={{ marginRight: 2 }}>
                                <Loans loan={loan} fetchLoans={fetchLoans} isUserAdmin={true} />
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
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

export default AdminLoansPage;
