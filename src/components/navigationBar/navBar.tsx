import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
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
import { useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
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
  async function greetingsMessage() {
    const user = (await AuthService.getUserFromStorage(
      AuthService.getCurrentUserID()
    )) as User;
       if (await !user){
        navigate("/signin");
      }
    const capitalize = (word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    storeUserProfileImage();
    await setFullName(` ${capitalize(user.firstName)} ${capitalize(user.lastName)}`);
  }

  const time = new Date().getHours();

  useEffect(() => {
    if (time < 12 && time >= 6) {
      setTimeMessage("Good morning☀️, ");
    } else if (time < 18 && time >= 12) {
      setTimeMessage("Good afternoon🌇, ");
    } else if (time < 24 && time >= 18) {
      setTimeMessage("Good evening🌆, ");
    } else if (time < 6 && time >= 24) {
      setTimeMessage("Good night🌙, ");
    }
    storeUserProfileImage();
    greetingsMessage();
  }, [time]);

  async function storeUserProfileImage() {
    // const user = (await AuthService.getUserFromStorage(
    //   AuthService.getCurrentUserID()
    // )) as User;
    setProfilePicture(
      "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
    );
  }

  return (
    <Box sx={{ display: "flex", fontFamily: "Poppins" }}>
      <CssBaseline />
      {fullName && (
        <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ backgroundColor: "#f50057" }}>
          
            <>
              <Avatar src={profilePicture} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ fontFamily: "Poppins" }}
              >
                {timeMessage} {fullName}
              </Typography>
            </>
          
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            display: "flex",
            boxSizing: "border-box",
            fontFamily: "Poppins",
            marginTop: "64px",
            boxShadow: 15,
            border: "hidden",
            textShadow: "#f50057",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Home", "Loans", "Cards", "Deposits", "Account"].map(
              (text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{
                    mb: 6,
                    boxShadow: 5,
                    backgroundColor:
                      location.pathname === "/" + text.toLowerCase()
                        ? "#ca0f50d0"
                        : "",
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      navigate(`/${text.toLowerCase()} `);
                    }}
                  >
                    <ListItemIcon sx={{ color: "#f50057", fontSize: "50px" }}>
                      {icons[index]}
                    </ListItemIcon>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "1.2rem",
                        marginRight: "64px",
                      }}
                    >
                      {text}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
      </>)}
    </Box>
  );
}
