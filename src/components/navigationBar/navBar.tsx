import { Box, Drawer, AppBar, Toolbar, List, Typography, Avatar } from "@mui/material";
import { CreditCard, Home, RequestQuote, Receipt, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useState, useEffect, useContext, useMemo } from "react";
import { User } from "../../models/user";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserProvider";
import NavBarItem from "./NavBarItem";
import AuthService from "../../AuthService";

export default function NavBar() {
  const navigate = useNavigate();
  const [timeMessage, setTimeMessage] = useState("");
  const [currentUser] = useContext(UserContext);

  const icons = [<Home />, <RequestQuote />, <CreditCard />, <Receipt />, <AccountCircle />];

  function logUserOut() {
    sessionStorage.clear();
    localStorage.removeItem("rememberedAuthToken");
    navigate("/");
  }

  const currentHour = new Date().getHours();
  const userName = useMemo(() => {
    return AuthService.getUserFullName(currentUser as User);
  }, [currentUser]);

  const avatarIMG = useMemo(() => {
    return currentUser?.avatarUrl;
  }, [currentUser]);

  useEffect(() => {
    switch (Math.floor(currentHour / 6)) {
      default: {
        setTimeMessage("Good morning☀️, ");
        break;
      }
      case 2: {
        setTimeMessage("Good afternoon🌇, ");
        break;
      }
      case 3: {
        setTimeMessage("Good evening🌆, ");
        break;
      }
      case 0: {
        setTimeMessage("Good night🌙, ");
        break;
      }
    }
  }, [currentUser, currentHour]);

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1,
            backgroundColor: "#F50057",
          }}
        >
          <Toolbar>
            {!currentUser ? (
              <Box></Box>
            ) : (
              <>

                <Avatar src={avatarIMG} />
                <Typography variant="h6" component="div" sx={{ fontFamily: "Poppins", marginLeft: 2 }}>

                  {`${timeMessage} ${userName}`}
                </Typography>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              display: "flex",
              boxSizing: "border-box",
              fontFamily: "Poppins",
              marginTop: "64px",
              textShadow: "#f50057",
              borderRightColor:"#ca0f50d0"
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["Home", "Loans", "Cards", "Deposits", "Account"].map((text, index) => (
                <NavBarItem label={text} icon={icons[index]} onClick={() => navigate(`/${text.toLowerCase()} `)} />
              ))}
              <NavBarItem label={"Logout"} icon={<ExitToApp />} onClick={logUserOut} />
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}
