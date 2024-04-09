import { useContext } from "react";
import { UserContext } from "../../UserProvider";
import { Box, Container, Grid } from "@mui/material";
import { getUserFullName } from "../../utils/utils";

const LoansPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);

  document.title = "Loans";

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 0 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Grid item>{getUserFullName(currentUser!)} Loans</Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LoansPage;
