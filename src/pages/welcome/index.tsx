import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import NavBar from "../../components/navigationBar/navBar";
import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import AuthService from "../../components/AuthService";
import { User } from "../../components/models/user";

const WelcomePage: React.FC = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [currentUser, setCurrentUser] = useState<User>();

  const getCurrentUser = async () => {
    setCurrentUser(
      (await AuthService.getUserFromStorage(AuthService.getUserID()) as User)
    );
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  const onClick = () => {
    setUserBalance(userBalance+50)
    const updatedUser = {
      ...currentUser,
      balance: userBalance
    } as User;
    setCurrentUser(updatedUser)
    alert(currentUser?.firstName);
  };
  return (
    <>
      <Box>
        <NavBar />

        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              marginLeft: "auto",
              height: 240,
              width: 500,
            }}
          >
            <Typography component="p" variant="h4" sx={{ marginLeft: "auto" }}>
              {userBalance}
            </Typography>
          </Paper>
        </Grid>
        <Button onClick={onClick}>fadsj</Button>
      </Box>
    </>
  );
};
export default WelcomePage;
