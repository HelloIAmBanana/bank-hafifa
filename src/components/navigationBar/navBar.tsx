import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HomeIcon from "@mui/icons-material/Home";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";
import { User } from "../../components/models/user";
import AuthService from "../../components/AuthService";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function NavBar() {
  const navigate = useNavigate();
  const [timeMessage, setTimeMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const icons = [
    <HomeIcon />,
    <RequestQuoteIcon />,
    <CreditCardIcon />,
    <ReceiptIcon />,
    <AccountCircleIcon />,
  ];
  const time = new Date().getHours();

  useEffect(() => {
    if (time < 12 && time >= 6) {
      setTimeMessage("Good morning, ");
    } else if (time < 18 && time >= 12) {
      setTimeMessage("Good afternoon, ");
    } else if (time < 24 && time >= 18) {
      setTimeMessage("Good evening, ");
    } else if (time < 6 && time >= 24) {
      setTimeMessage("Good night, ");
    }
    greetingsMessage();
    storeUserProfileImage();
  }, [fullName]);

  async function greetingsMessage() {
    const user = (await AuthService.getUserFromStorage(
      AuthService.getCurrentUserID()
    )) as User;
    const capitalize = (word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    storeUserProfileImage();
    setFullName(
      ` ${timeMessage} ${capitalize(user.firstName)} ${capitalize(
        user.lastName
      )}`
    );
  }

  async function storeUserProfileImage() {
    const user = (await AuthService.getUserFromStorage(
      AuthService.getCurrentUserID()
    )) as User;
    setProfilePicture(
      "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
    );
  }

  function onClick(route: string) {
    navigate(`/${(route as string).toLowerCase()} `);
    return true;
  }
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Avatar src={profilePicture} />
            <Typography variant="h6" noWrap component="div">
              {fullName}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["Home", "Loans", "Cards", "Deposits", "Account"].map(
                (text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton onClick={() => {onClick((text as string))}}>
                      <ListItemIcon>{icons[index]}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>
            <Divider />
          </Box>
        </Drawer>
      </Box>
      <div>
        <h1>fdsaasd</h1>
      </div>
    </>
  );
}
