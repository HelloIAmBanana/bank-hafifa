import { useContext } from "react";
import { UserContext } from "../../UserProvider";
import NavBar from "../../components/NavigationBar/NavBar";
import { Box, CircularProgress } from "@mui/material";
import AuthService from "../../AuthService";

const DepositsPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  
  document.title = "Deposits";

  return (
    <Box mx={30} sx={{ paddingTop: 8 }}>
      <NavBar />
      {!currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
        <center>
        <Box>
          {AuthService.getUserFullName(currentUser)} Deposits
        </Box>
        </center>
      )}
    </Box>
  );
};

export default DepositsPage;
