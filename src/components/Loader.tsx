import { Grid } from "@mui/material";
import { PacmanLoader } from "react-spinners";

const LoadingScreen = () => {
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  );
};

export default LoadingScreen;
