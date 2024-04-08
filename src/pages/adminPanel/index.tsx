import { Grid, Typography } from "@mui/material";
import { UserContext } from "../../UserProvider";
import { useContext, useEffect } from "react";
import { getUserFullName } from "../../utils/utils";
import { PacmanLoader } from "react-spinners";
import { FirstLoadContext } from "../../FirstLoanProvider";

const AdminPanel: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const [firstLoad, setFirstLoad] = useContext(FirstLoadContext);
  useEffect(() => {
    setFirstLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  
  return !currentUser ? (
    <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : firstLoad ? (
    <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : (
    <Typography>Welcome {getUserFullName(currentUser)}</Typography>
  );
};
export default AdminPanel;
