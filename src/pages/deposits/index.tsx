import { useContext } from "react";
import { UserContext } from "../../UserProvider";
import { Box, Container, Grid } from "@mui/material";
import { getUserFullName } from "../../utils/utils";

const DepositsPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);

  document.title = "Deposits";

  return (
    <Box>
      <Box component="main" sx={{ flexGrow: 0 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Grid item>{getUserFullName(currentUser!)} Deposits</Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DepositsPage;
