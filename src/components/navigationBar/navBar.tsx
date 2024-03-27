import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import {
  CreditCard,
  Home,
  RequestQuote,
  Receipt,
  AccountCircle,
  ExitToApp,
} from "@mui/icons-material";
import { useState, useEffect,useContext } from "react";
import { User } from "../../models/user";
import { useNavigate, useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/utils";
import { UserContext } from "../../UserProvider";


export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeMessage, setTimeMessage] = useState("");
  const currentUser = useContext(UserContext);

  const icons = [
    <Home />,
    <RequestQuote />,
    <CreditCard />,
    <Receipt />,
    <AccountCircle />,
    <ExitToApp />,
  ];



  function logUserOut(){
    sessionStorage.clear()
    localStorage.removeItem("rememberedAuthToken")
    navigate("/signin")
  }

  const currentHour = new Date().getHours();

  useEffect(() => {
    switch (Math.floor(currentHour / 6)) {
      default: {
        setTimeMessage("☀️Good morning, ");
        break;
      }
      case 2: {
        setTimeMessage("🌇Good afternoon, ");
        break;
      }
      case 3: {
        setTimeMessage("🌆Good evening, ");
        break;
      }
      case 0: {
        setTimeMessage("🌙Good night, ");
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
            zIndex: (theme: { zIndex: { drawer: number } }) =>
              theme.zIndex.drawer + 1,
            backgroundColor: "#F50057",
          }}
        >
          <Toolbar>
            {!currentUser ? (
              <Box></Box>
            ) : (
              <>
                <Avatar src={(currentUser as User).avatarUrl} />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ fontFamily: "Poppins" }}
                >
                  {`${timeMessage} ${capitalizeFirstLetter(
                    currentUser.firstName
                  )} ${capitalizeFirstLetter(currentUser.lastName)}`}
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
              boxShadow: 15,
              textShadow: "#f50057",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["Home", "Loans", "Cards", "Deposits", "Account", "Logout"].map(
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
                        text === "Logout"
                          ? logUserOut()
                          : navigate(`/${text.toLowerCase()} `);
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
      </Box>
    </Box>
  );
}
