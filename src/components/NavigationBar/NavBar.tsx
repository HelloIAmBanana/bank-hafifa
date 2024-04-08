import { Box, Drawer, Toolbar, List, Typography, Avatar } from "@mui/material";
import { useContext, useMemo } from "react";
import { User } from "../../models/user";
import { getUserFullName } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserProvider";
import NavBarItem from "./NavBarItem";
import { GiPayMoney, GiSwipeCard, GiHouse, GiPiggyBank, GiGears, GiExitDoor } from "react-icons/gi";
import { GrUserSettings } from "react-icons/gr";

import AuthService from "../../AuthService";

const getNavBarIcon = (item: string) => {
  switch (item) {
    case "Home":
      return <GiHouse />;
    case "Loans":
    case "Loans Managment":
      return <GiPayMoney />;
    case "Cards":
    case "Cards Managment":
      return <GiSwipeCard />;
    case "Deposits":
    case "Deposits Managment":
      return <GiPiggyBank />;
    case "User Managment":
      return <GrUserSettings />;
    case "Settings":
      return <GiGears />;
    default:
      return <GiExitDoor />;
  }
};

export default function NavBar() {
  const navigate = useNavigate();
  const [currentUser] = useContext(UserContext);

  function logUserOut() {
    sessionStorage.clear();
    localStorage.removeItem("rememberedAuthToken");
    navigate("/");
  }

  const getRoutePath = (item: string) => {
    switch (item) {
      case "Loans Managment":
        return navigate(`/loansmanagment`);
      case "Cards Managment":
        return navigate(`/cardsmanagment`);
      case "Deposits Managment":
        return navigate(`/depositsmanagment`);
      case "User Managment":
        return navigate(`/usersmanagment`);
      default:
        return navigate(`/${item.toLowerCase()} `);
    }
  };

  const userName = useMemo(() => {
    return getUserFullName(currentUser as User);
  }, [currentUser]);

  const avatarIMG = useMemo(() => {
    return currentUser?.avatarUrl;
  }, [currentUser]);

  const userRoutes = useMemo(() => {
    if (currentUser) {
      const isAdmin = AuthService.isUserAdmin(currentUser);
      if (isAdmin) return ["Loans Managment", "Cards Managment", "Deposits Managment", "User Managment", "Settings"];
    }
    return ["Home", "Loans", "Cards", "Deposits", "Settings"];
  }, [currentUser]);

  return (
    <Box sx={{ display: "flex" }}>
      {!userName ? (
        <Box />
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
            <Avatar src={avatarIMG} sx={{ backgroundColor: "#f50057", width: 35, height: 35 }}>
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
              {userRoutes.map((text) => (
                <NavBarItem
                  label={text}
                  icon={getNavBarIcon(text)}
                  onClick={()=>getRoutePath(text)}
                />
              ))}
              <NavBarItem label={"Logout"} icon={<GiExitDoor />} onClick={logUserOut} />
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
