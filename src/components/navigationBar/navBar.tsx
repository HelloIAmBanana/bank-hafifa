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
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { User } from "../../models/user";
import AuthService from "../../AuthService";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeMessage, setTimeMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User>();

  const icons = [
    <Home />,
    <RequestQuote />,
    <CreditCard />,
    <Receipt />,
    <AccountCircle />,
  ];
  const storeCurrentUser = async () => {
    setCurrentUser(await AuthService.getCurrentUser());
  };
  const currentHour = new Date().getHours();
  useEffect(() => {
    storeCurrentUser();
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
      case 4: {
        setTimeMessage("🌙Good night, ");
        break;
      }
    }
  }, [currentUser, currentHour]);
  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
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
                  {timeMessage} {capitalize((currentUser as User).firstName)}{" "}
                  {capitalize((currentUser as User).lastName)}
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
      </Box>
    </Box>
  );
}
