import React, { useContext} from "react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { UserContext } from "../../UserProvider";

const GamblingPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  document.title = "Gambler";

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      marginTop={5}
      sx={{ overflowX: "hidden" }}
    >
      <Box ml={15}>
        <Card sx={{ maxWidth: 345, mb: 5, borderRadius: 5, width: 345 }} elevation={12}>
          <CardMedia
            component="img"
            alt="article image"
            height="240"
            image="https://cdn.dribbble.com/users/2140475/screenshots/18078541/media/053aada5ccc9ac23fc284d6e583146ac.jpg?resize=400x0"
          />
          <CardContent>
            <Typography variant="h5" component="div" fontFamily={"Poppins"}>
              Random Riddle
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary" fontFamily={"Poppins"}>
              Cost: 100$
            </Typography>
            <Typography variant="body2" fontFamily={"Poppins"}>
              Receive a random riddle, if you answer right, you will receive 200$, if you answer wrong, you will lose
              your 100$
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">
              <Typography variant="body2" fontFamily={"Poppins"}>
                Give me a riddle!
              </Typography>
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Grid>
  );
};

export default GamblingPage;
