import { ListItem, ListItemButton, Typography } from "@mui/material";
import { FunctionComponent} from "react";
import { useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import AuthService from "../../AuthService";
import userStore from "../../UserStore";
import { observer } from "mobx-react-lite";

interface NavBarItemProps {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}

const NavBarItem: FunctionComponent<NavBarItemProps> = observer(({ label, icon, onClick }) => {
  const location = useLocation();
  let currentUser = userStore.currentUser;

  const isAdmin = AuthService.isUserAdmin(currentUser);

  return (
    <ListItem
      key={label}
      disablePadding
      sx={{
        mb: 2,
        color:
          location.pathname === "/" + label.toLowerCase() ||
          location.pathname === "/admin/" + label.toLowerCase().split(" ")[0]
            ? "#ca0f50d0"
            : "#999999",
      }}
    >
      <ListItemButton onClick={onClick}>
        <IconContext.Provider
          value={{
            color:
              location.pathname === "/" + label.toLowerCase() ||
              location.pathname === "/admin/" + label.toLowerCase().split(" ")[0]
                ? "#ca0f50d0"
                : "#999999",
            size: isAdmin ? "1.5rem" : "2.5rem",
          }}
        >
          {icon}
        </IconContext.Provider>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: isAdmin ? "1rem" : "1.5rem",
            marginLeft: "32px",
          }}
        >
          {label}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
});

export default NavBarItem;
