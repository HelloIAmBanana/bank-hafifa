import { useContext } from "react";
import { UserContext } from "../../UserProvider";
import NavBar from "../../components/NavigationBar/NavBar";
import { Box, Container, Grid } from "@mui/material";
import { getUserFullName } from "../../utils/utils";
import { PacmanLoader } from "react-spinners";

const DepositsPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);

  document.title = "Deposits";

  return !currentUser ? (
    <Grid container direction="column" justifyContent="flex-end" alignItems="center" marginTop={45}>
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : (
    <Box sx={{ display: "flex", backgroundColor: "white", boxShadow: 16 }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 0 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Grid item>{getUserFullName(currentUser)} Deposits</Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DepositsPage;
