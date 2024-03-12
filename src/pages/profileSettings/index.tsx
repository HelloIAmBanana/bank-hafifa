import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import NavBar from "../../components/navigationBar/navBar";
import {
  Button,
  Grid,
  Typography,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import AuthService from "../../components/AuthService";
import { User } from "../../components/models/user";
import CRUDLocalStorage from "../../components/CRUDLocalStorage";
import { useNavigate } from "react-router-dom";

const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [transferReason, setTransferReason] = useState("");

  const storeCurrentUser = async () => {
    setCurrentUser(
      (await AuthService.getUserFromStorage(
        AuthService.getCurrentUserID()
      )) as User
    );
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

  const handleNameModal = () => {
    setNameModal(!nameModal);
    if (nameModal) {
      setFirstName(currentUser?.firstName as string);
      setLastName(currentUser?.lastName as string);
    }
  };

  const handleSubmitTransaction = async () => {
    handleNameModal();
    setIsLoading(true);
    const updatedUser: User = {
      ...(currentUser as User),
      firstName: firstName as string,
      lastName: lastName as string,
    };
    await updateUser(updatedUser);
    navigate("/home")
  };
  return (
    <>
      <NavBar />
      <Box mx={30} sx={{ paddingTop: 8 }}>
        {isLoading || !currentUser ? ( // Render CircularProgress if isLoading is true
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Button
                onClick={handleNameModal}
                sx={{
                  width: 250,
                  fontWeight: "bold",
                  marginTop: 2,
                  fontSize: 18,
                }}
              >
                Change Name
              </Button>
            </Grid>
          </Grid>
        )}
        <Modal
          open={nameModal}
          onClose={handleNameModal}
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
              Change Name
            </Typography>
            <TextField
            required
              fullWidth
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              required
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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

export default ProfileSettingsPage;
