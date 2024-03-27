import * as React from "react";
import AuthService from "../../AuthService";
import NavBar from "../../components/navigationBar/navBar";
import { useState, useContext  } from "react";
import { User } from "../../models/user";
import { updateUser } from "../../utils/utils";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { UserContext } from "../../UserProvider";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Modal,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import "./style.css";

const WelcomePage: React.FC = () => {
  const currentUser = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [receivingAccountId, setReceivingAccountId] = useState("");
  const [amount, setAmount] = useState(0);
  const [transferReason, setTransferReason] = useState("");

  const getUserBalance = () => {
    return currentUser ? currentUser.balance : 0;
  };

  const updateBalance = async (user: User, amount: number) => {
    const updatedBalance = user.balance + amount;
    const updatedUser: User = {
      ...user,
      balance: updatedBalance,
    };
    await updateUser(updatedUser);
  };

  const openPaymentModal = () => {
    setPaymentModal(true);
  };

  const closePaymentModal = () => {
    setPaymentModal(false);
    if (isPaymentModalOpen) {
      setReceivingAccountId("");
      setAmount(0);
      setTransferReason("");
    }
  };

  const handleSubmitTransaction = async () => {
    setIsLoading(true);
    const receivingUser = await AuthService.getUserFromStorage(
      receivingAccountId
    );
    if (receivingUser != null) {
      await updateBalance(currentUser as User, -amount);
      await updateBalance(receivingUser as User, amount);
      setIsLoading(false);
      successAlert(`Transfered ${amount}$ to ${receivingUser.firstName}`);
    } else {
      setIsLoading(false);
      errorAlert("Entered ID is WRONG");
    }
    closePaymentModal();
  };
  return (
    <Box mx={30} sx={{ paddingTop: 8 }}>
      <NavBar />
      {isLoading || !currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: 2,
                  width: 250,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#FAFBFF",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
                >
                  Your Balance💰
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    marginTop: 2,
                    fontSize: 18,
                  }}
                >
                  {getUserBalance()}$
                </Typography>
                <Button onClick={openPaymentModal}>Make A Payment💸</Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
      <Modal
        open={isPaymentModalOpen}
        onClose={closePaymentModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ fontFamily: "Poppins" }}
          >
            Create Transaction
          </Typography>
          <TextField
            fullWidth
            label="Account ID"
            variant="outlined"
            value={receivingAccountId}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setReceivingAccountId(e.target.value)}
            sx={{ mt: 2 }}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            type="number"
            label="Amount"
            variant="outlined"
            value={amount}
            onChange={(e: { target: { value: string } }) =>
              setAmount(parseFloat(e.target.value))
            }
            sx={{ mt: 2 }}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Transfer Reason"
            variant="outlined"
            value={transferReason}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setTransferReason(e.target.value)}
            sx={{ mt: 2 }}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={handleSubmitTransaction}
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress /> : "2 3 SHA-GER"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default WelcomePage;
