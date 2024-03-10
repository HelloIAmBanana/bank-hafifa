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
import { useEventCallback } from "@mui/material";

function getCurrentUser() {
    const data = sessionStorage.getItem("currentUser");
    return data ? JSON.parse(data) : [];
}
const navigationItems = [
  {
    role: "admin",
  },
];
function getUserName() {

}
const drawerWidth = 240;
export default function NavBar() {
  const [timeGreetings, setTimeGreetings] = useState("");
  const [fullName, setFullName] = useState("");

  const icons = [
    <HomeIcon />,
    <RequestQuoteIcon />,
    <CreditCardIcon />,
    <ReceiptIcon />,
    <AccountCircleIcon />,
  ];
  const time = new Date().getHours();
  useEffect(() => {
    if(time<12&&time>6){
    setTimeGreetings("Good morning, ");
  }
  else if (time<18&&time>12){
    setTimeGreetings("Good afternoon, ");
  }
  else if(time<24&&time>18){
    setTimeGreetings("Good evening, ");
  }
  else if(time<6&&time>24){
    setTimeGreetings("Good night, ");
  }})
  async function getFullName(){
    const user = await AuthService.getUserFromToken(AuthService.getToken()) as User;
    setFullName(user.firstName[0].toUpperCase() +
    user.firstName.substring(1).toLowerCase() +
    " " +
    user.lastName[0].toUpperCase() +
    user.lastName.substring(1).toLowerCase())
  }
  getFullName()
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {timeGreetings} {fullName}
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
                  <ListItemButton>
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
  );
}