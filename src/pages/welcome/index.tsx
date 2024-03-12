import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect, useCallback } from "react";
import NavBar from "../../components/navigationBar/navBar";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import AuthService from "../../components/AuthService";
import { User } from "../../components/models/user";
import CRUDLocalStorage from "../../components/CRUDLocalStorage";

const WelcomePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>();
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState(0);
  const [transferReason, setTransferReason] = useState("");

  const storeCurrentUser = async () => {
    setCurrentUser(
      (await AuthService.getUserFromStorage(
        AuthService.getCurrentUserID()
      )) as User
    );
  };
  const getUserBalance = () => {
    return currentUser ? currentUser.balance : 0;
  };
  useEffect(() => {
    storeCurrentUser();
  }, [currentBalance, currentUser]);

  async function updateUser(user: User) {
    const users = await CRUDLocalStorage.getAsyncData<User[]>("users");
    const updatedUsers = users.filter((userItem) => userItem.id !== user.id);
    updatedUsers.push(user as User);
    await CRUDLocalStorage.setAsyncData("users", updatedUsers);
  }

  const updateBalance = async (user: User, amount: number) => {
    console.log(user);
    if (user) {
      const balance = user.balance;
      const updatedBalance = balance + amount;
      setCurrentBalance(updatedBalance);
      const updatedUser: User = {
        ...user,
        balance: updatedBalance,
      };
      await updateUser(updatedUser);
    }
  };

  const onClick = () => {
    updateBalance(currentUser as User, 50);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitTransaction = async () => {
    handleCloseModal();
    setIsLoading(true);
    const receivingUser = await AuthService.getUserFromStorage(accountId);
    if (receivingUser != null) {
      await updateBalance(receivingUser as User, amount);
      await updateBalance(currentUser as User, -amount);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      alert("ID WRONG");
    }
    console.log("Account ID:", accountId);
    console.log("Amount:", amount);
    console.log("Transfer Reason:", transferReason);
  };
  return (
    <>
      <NavBar />
      <Box mx={30} sx={{ paddingTop: 8 }}>
        {isLoading ? ( // Render CircularProgress if isLoading is true
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
                  component="h2"
                  gutterBottom
                  sx={{ fontFamily: "Poppins", fontSize: 18 }}
                >
                  Your Balance
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
                  {getUserBalance()} $
                </Typography>
              </Paper>
              <Button
                onClick={handleOpenModal}
                sx={{
                  width: 250,
                  fontWeight: "bold",
                  marginTop: 2,
                  fontSize: 18,
                }}
              >
                Make A Payment
              </Button>
            </Grid>
          </Grid>
        )}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
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
            >
              Create Transaction
            </Typography>
            <TextField
              fullWidth
              label="Account ID"
              variant="outlined"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Amount"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Transfer Reason"
              variant="outlined"
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSubmitTransaction}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default WelcomePage;
