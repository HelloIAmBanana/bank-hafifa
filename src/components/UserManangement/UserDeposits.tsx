import React, { useState } from "react";
import { useEffect, useMemo } from "react";
import { Box, Grid, Modal, Skeleton, Typography } from "@mui/material";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { User } from "../../models/user";
import { getUserFullName } from "../../utils/utils";
import { Deposit } from "../../models/deposit";
import DepositRows from "../Deposit/DepositRows";

interface UserDepositsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  user: User;
}

const UserDepositsModal: React.FC<UserDepositsModalProps> = ({ isOpen, closeModal, user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const fetchedDeposits = await CRUDLocalStorage.getAsyncData<Deposit[]>("deposits");
      const currentDeposits = fetchedDeposits.filter((deposit) => deposit.accountID === user!.id);

      setDeposits(currentDeposits);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };
  const activeDeposits = useMemo(() => {
    return deposits.filter((deposit) => deposit.status === "Active");
  }, [deposits]);

  const offeredDeposits = useMemo(() => {
    return deposits.filter((deposit) => deposit.status === "Offered");
  }, [deposits]);

  const WithdrawableDeposits = useMemo(() => {
    return deposits.filter((deposit) => deposit.status === "Withdrawable");
  }, [deposits]);

  useEffect(() => {
    fetchDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: 5,
        }}
      >
        <Grid container justifyContent="flex-start">
          <Box component="main" sx={{ flexGrow: 0 }}>
            {isLoading ? (
              <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                <Skeleton height={"12rem"} width={window.innerWidth / 2} />
              </Grid>
            ) : deposits.length < 1 ? (
              <Typography fontFamily={"Poppins"} variant="h3">
                {getUserFullName(user)} doesn't have any deposits
              </Typography>
            ) : (
              <Box>
                <Typography fontFamily={"Poppins"} variant="h3">
                  {getUserFullName(user)} Deposits
                </Typography>
                <DepositRows deposits={activeDeposits} title="Active" />
                <DepositRows deposits={offeredDeposits} title="Offered" />
                <DepositRows deposits={WithdrawableDeposits} title="Withdrawable" />
              </Box>
            )}
          </Box>
        </Grid>
      </Box>
    </Modal>
  );
};

export default UserDepositsModal;
