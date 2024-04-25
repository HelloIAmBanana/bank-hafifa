import { Box, Drawer, Toolbar, List, Typography, Avatar } from "@mui/material";
import { useContext, useMemo } from "react";
import { getUserFullName } from "../../utils/utils";
import { useNavigate, useRevalidator } from "react-router-dom";
import { UserContext } from "../../UserProvider";
import NavBarItem from "./NavBarItem";
import { GiPayMoney, GiSwipeCard, GiHouse, GiPiggyBank, GiGears, GiExitDoor, GiSmart } from "react-icons/gi";

import AuthService from "../../AuthService";

const getNavBarIcon = (item: string) => {
  switch (item) {
    case "Home":
      return <GiHouse />;
    case "Loans":
    case "Loans Management":
      return <GiPayMoney />;
    case "Cards":
    case "Cards Management":
      return <GiSwipeCard />;
    case "Deposits":
    case "Deposits Management":
      return <GiPiggyBank />;
    case "Users Management":
      return <GiSmart />;
    case "Settings":
      return <GiGears />;
    default:
      return <GiExitDoor />;
  }
};

export default function NavBar() {
  const navigate = useNavigate();
  const [currentUser] = useContext(UserContext);
  const revalidator = useRevalidator();


  function logUserOut() {
    sessionStorage.clear();
    localStorage.removeItem("rememberedAuthToken");
    navigate("/");
  }

  const getRoutePath = (item: string) => {
    switch (item) {
      case "Loans Management":
        return navigate(`/admin/loans`);
      case "Cards Management":
        return navigate(`/admin/cards`);
      case "Deposits Management":
        return navigate(`/admin/deposits`);
      case "Users Management":
        return navigate(`/admin/users`);
      default:
        return navigate(`/${item.toLowerCase()}`);
    }
  };

  const userName = useMemo(() => {
    return getUserFullName(currentUser!);
  }, [currentUser]);

  const avatarIMG = useMemo(() => {
    return currentUser!.avatarUrl;
  }, [currentUser]);

  const userRoutes = useMemo(() => {
    const isAdmin = AuthService.isUserAdmin(currentUser);
    if (isAdmin) {
      return ["Home", "Loans Management", "Cards Management", "Deposits Management", "Users Management", "Settings"];
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
              maxWidth:"240px",
              fontFamily: "Poppins",
              borderTopLeftRadius: 16,
              borderLeftRadius: 16,
              position: "relative",
              borderRight: "2px solid #ca0f50d0",
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
                <NavBarItem label={text} icon={getNavBarIcon(text)} onClick={() => getRoutePath(text)} />
              ))}
              <NavBarItem label={"Logout"} icon={<GiExitDoor />} onClick={logUserOut} />
              <NavBarItem label= "Reload" icon={<GiPayMoney/>} onClick={()=>revalidator.revalidate()}/>
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
