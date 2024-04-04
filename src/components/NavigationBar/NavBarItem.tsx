import { ListItem, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";

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
        color: location.pathname === "/" + label.toLowerCase() ? "#ca0f50d0" : "",
      }}
    >
      <ListItemButton onClick={onClick}>
        <ListItemIcon sx={{ color: location.pathname === "/" + label.toLowerCase() ? "#ca0f50d0" : "", fontSize: "50px" }}>{icon}</ListItemIcon>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "1.2rem",
            marginRight: "64px",
          }}
        >
          {label}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
};

export default NavBarItem;
