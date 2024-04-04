import { Box, Drawer, Toolbar, List, Typography, Avatar } from "@mui/material";
import { CreditCard, Home, RequestQuote, Receipt, AccountCircle, ExitToApp } from "@mui/icons-material";
import { useContext, useMemo } from "react";
import { User } from "../../models/user";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserProvider";
import NavBarItem from "./NavBarItem";
import AuthService from "../../AuthService";

export default function NavBar() {
  const navigate = useNavigate();
  const [currentUser] = useContext(UserContext);

  const icons = [<Home />, <RequestQuote />, <CreditCard />, <Receipt />, <AccountCircle />];

  function logUserOut() {
    sessionStorage.clear();
    localStorage.removeItem("rememberedAuthToken");
    navigate("/");
  }

  const userName = useMemo(() => {
    return AuthService.getUserFullName(currentUser as User);
  }, [currentUser]);

  const avatarIMG = useMemo(() => {
    return currentUser?.avatarUrl;
  }, [currentUser]);

  return (
      <Box sx={{ display: "flex" }}>
        {!currentUser ? (
          <Box></Box>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              flexShrink: 0,
              borderRight: "2px solid #ca0f50d0",
              [`& .MuiDrawer-paper`]: {
                display: "flex",
                height:"100vh",
                fontFamily: "Poppins",
                textShadow: "#f50057",
                position: 'relative',
              },
            }}
          >
            <Box sx={{ marginTop: "15px", marginLeft: 2 }}>
              <Avatar src={avatarIMG} sx={{ width: 35, height: 35 }} />
              <Typography
                component="div"
                noWrap
                sx={{ fontFamily: "Poppins", fontSize: "15px" }}
                marginLeft={6}
                marginTop={-3.5}
              >
                {`Welcome, ${userName}`}
              </Typography>
            </Box>
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
        )}
      </Box>
  );
}
