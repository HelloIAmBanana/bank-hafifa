import { User } from "../../models/user";
import { Button, Grid, Typography } from "@mui/material";
import { getUserFullName } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

interface AdminHomePageLayoutProps {
  currentUser: User;
}

const AdminHomePageLayout: React.FC<AdminHomePageLayoutProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh" mt={-10}>
      <Grid container direction="column" justifyContent="center" alignItems="center" ml={1}>
        <Grid item>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
            Welcome Back Admin {getUserFullName(currentUser!)}
          </Typography>
        </Grid>
        <Grid item>
          <Button type="submit" onClick={() => navigate("/admin/loans")}>
            Loan Control
          </Button>
        </Grid>
        <Grid item>
          <Button type="submit" onClick={() => navigate("/admin/cards")}>
            Card Control
          </Button>
        </Grid>
        <Grid item>
          <Button type="submit" onClick={() => navigate("/admin/deposits")}>
            Deposit Control
          </Button>
        </Grid>
        <Grid item>
          <Button type="submit" onClick={() => navigate("/admin/users")}>
            User Control
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminHomePageLayout;
