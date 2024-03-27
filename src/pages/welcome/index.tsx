import * as React from "react";
import AuthService from "../../AuthService";
import NavBar from "../../components/navigationBar/navBar";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useState, useEffect } from "react";
import { User } from "../../models/user";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
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
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [PaymentModal, setPaymentModal] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>();
  const [receivingAccountId, setReceivingAccountId] = useState("");
  const [amount, setAmount] = useState(0);
  const [transferReason, setTransferReason] = useState("");
  useEffect(() => {
    storeCurrentUser();
  }, [currentBalance, currentUser]);

  const storeCurrentUser = async () => {
    setCurrentUser(await AuthService.getCurrentUser());
  };
  const getUserBalance = () => {
    return currentUser ? currentUser.balance : 0;
  };
  async function updateUser(user: User) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
    const updatedUsers = users.filter((userItem) => userItem.id !== user.id);
    updatedUsers.push(user);
    await CRUDLocalStorage.setAsyncData("users", updatedUsers);
  }
  const updateBalance = async (user: User, amount: number) => {
    if (user) {
      const updatedBalance = user.balance + amount;
      setCurrentBalance(updatedBalance);
      const updatedUser: User = {
        ...user,
        balance: updatedBalance,
      };
      await updateUser(updatedUser);
    }
  };
  const handlePaymentModal = () => {
    setPaymentModal(!PaymentModal);
    if (PaymentModal) {
      setReceivingAccountId("");
      setAmount(0);
      setTransferReason("");
    }
  };
  const handleSubmitTransaction = async () => {
    handlePaymentModal();
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
    console.log("Account ID:", receivingAccountId);
    console.log("Amount:", amount);
    console.log("Transfer Reason:", transferReason);
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
                <Button onClick={handlePaymentModal}>Make A Payment💸</Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
      <Modal
        open={PaymentModal}
        onClose={handlePaymentModal}
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
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setReceivingAccountId(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Amount"
            variant="outlined"
            value={amount}
            onChange={(e: { target: { value: string; }; }) => setAmount(parseFloat(e.target.value))}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Transfer Reason"
            variant="outlined"
            value={transferReason}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setTransferReason(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmitTransaction}
            sx={{ mt: 2 }}
          >
            2 3 SHA-GER
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default WelcomePage;
