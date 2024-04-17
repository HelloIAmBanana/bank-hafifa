import React, { useState } from "react";
import { useEffect, useMemo } from "react";
import { Box, Grid, Modal, Skeleton, Typography } from "@mui/material";
import LoansRow from "../Loan/LoansRow";
import { Loan } from "../../models/loan";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { User } from "../../models/user";
import { getUserFullName } from "../../utils/utils";

interface UserLoansModalProps {
  isOpen: boolean;
  closeModal: () => void;
  user: User;
}

const UserLoansModal: React.FC<UserLoansModalProps> = ({ isOpen, closeModal, user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const fetchedLoans = await CRUDLocalStorage.getAsyncData<Loan[]>("loans");
      const currentLoans = fetchedLoans.filter((currentLoan) => currentLoan.accountID === user.id);

      setLoans(currentLoans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const pendingLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "pending" && loan.accountID === user.id);
  }, [loans]);

  const approvedLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "approved" && loan.accountID === user.id);
  }, [loans]);

  const offeredLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "offered" && loan.accountID === user.id);
  }, [loans]);

  const rejectedLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === "rejected" && loan.accountID === user.id);
  }, [loans]);


  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container justifyContent="center">
      <Modal
        open={isOpen}
        onClose={closeModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          borderRadius: 5,
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 5,
          }}
        >
          <Grid container justifyContent="flex-start">
            <Box component="main">
              {isLoading ? (
                <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                  <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                </Grid>
              ) : loans.length < 1 ? (
                <Typography fontFamily={"Poppins"} variant="h3">
                  {getUserFullName(user)} doesn't have any loans
                </Typography>
              ) : (
                <Box mt={15}>
                  <Typography fontFamily={"Poppins"} variant="h3">
                    {getUserFullName(user)} Loans
                  </Typography>
                  <LoansRow loans={approvedLoans} title="Approved" />
                  <LoansRow loans={offeredLoans} title="Offered" />
                  <LoansRow loans={pendingLoans} title="Pending" />
                  <LoansRow loans={rejectedLoans} title="Rejected" />
                </Box>
              )}
            </Box>
          </Grid>
        </Box>
      </Modal>
    </Grid>
  );
};

export default UserLoansModal;
