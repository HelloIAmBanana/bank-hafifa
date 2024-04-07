import { Box, Drawer, Toolbar, List, Typography, Avatar } from "@mui/material";
import { useContext, useMemo } from "react";
import { User } from "../../models/user";
import { getUserFullName } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserProvider";
import NavBarItem from "./NavBarItem";
import { GiReceiveMoney, GiSwipeCard, GiHouse, GiPiggyBank, GiGears, GiExitDoor } from "react-icons/gi";
export default function NavBar() {
  const navigate = useNavigate();
  const [currentUser] = useContext(UserContext);

  const icons = [<GiHouse />, <GiReceiveMoney />, <GiSwipeCard />, <GiPiggyBank />, <GiGears />];

  function logUserOut() {
    sessionStorage.clear();
    localStorage.removeItem("rememberedAuthToken");
    navigate("/");
  }

  const userName = useMemo(() => {
    return getUserFullName(currentUser as User);
  }, [currentUser]);

  const avatarIMG = useMemo(() => {
    return currentUser?.avatarUrl;
  }, [currentUser]);

  return (
    <Box sx={{ display: "flex" }}>
      {!userName ? (
        <Box></Box>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            borderRight: "2px solid #ca0f50d0",
            [`& .MuiDrawer-paper`]: {
              display: "flex",
              height: "100vh",
              fontFamily: "Poppins",
              borderTopLeftRadius: 16,
              borderLeftRadius: 16,
              position: "relative",
            },
          }}
        >
          <Box sx={{ marginTop: "15px", marginLeft: 1 }}>
            <Avatar
              src={avatarIMG}
              sx={{backgroundColor: "#f50057", width: 35, height: 35 }}
            >
              {userName.split(" ")[0][0]}
              {userName.split(" ")[1][0]}
            </Avatar>
            <Typography
              component="div"
              sx={{ fontFamily: "Poppins", fontSize: "15px", fontWeight: "bold" }}
              marginLeft={6}
              marginTop={-3.5}
              marginRight={1}
            >
              {`Welcome, ${userName}`}
            </Typography>
          </Box>
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["Home", "Loans", "Cards", "Deposits", "Settings"].map((text, index) => (
                <NavBarItem label={text} icon={icons[index]} onClick={() => navigate(`/${text.toLowerCase()} `)} />
              ))}
              <NavBarItem label={"Logout"} icon={<GiExitDoor />} onClick={logUserOut} />
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
