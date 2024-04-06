import { ListItem, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";
import { IconContext } from "react-icons";

interface NavBarItemProps {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
}

const NavBarItem: FunctionComponent<NavBarItemProps> = ({ label, icon, onClick }) => {
  const location = useLocation();

  return (
    <ListItem
      key={label}
      disablePadding
      sx={{
        mb: 2,
        color: location.pathname === "/" + label.toLowerCase() ? "#ca0f50d0" : "#999999",
      }}
    >
      <ListItemButton onClick={onClick}>
        <IconContext.Provider
          value={{ color: location.pathname === "/" + label.toLowerCase() ? "#ca0f50d0" : "#999999", size: "2.5rem" }}>
            {icon}
        </IconContext.Provider>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "1.5rem",
            marginLeft:"64px"
          }}
        >
          {label}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
};

export default NavBarItem;
