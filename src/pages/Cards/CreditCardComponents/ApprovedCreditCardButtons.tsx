import { Button, CircularProgress, Grid } from "@mui/material";
import { Card } from "../../../models/card";
import { normalAlert, successAlert } from "../../../utils/swalAlerts";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { useFetchCardsContext } from "../../../contexts/fetchCardsContext";
import { useState } from "react";

interface ApprovedCreditCardButtonsProps {
  card: Card;
}

const ApprovedCreditCardButtons: React.FC<ApprovedCreditCardButtonsProps> = ({ card }) => {
  const { fetchCards } = useFetchCardsContext();
  const [isCardBeingCanceled, setIsCardBeingCanceled] = useState(false);

  const cancelCardButtonClicked = () => {
    setIsCardBeingCanceled(true);
    cancelCard(card);
  };

  const cancelCard = async (card: Card) => {
    await CRUDLocalStorage.deleteItemFromList<Card>("cards", card);
    successAlert("Card Canceled!");
    await fetchCards();
  };
  
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item>
        <Button
          sx={{
            backgroundColor: "red",
            color: "white",
            width: "146px",
            height: "43px",
            mb: 2,
            mt: 2,
            borderRadius: 2,
            fontWeight: "Bold",
            fontFamily: "Poppins",
            fontSize: 18,
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          onClick={() => cancelCardButtonClicked()}
        >
          {isCardBeingCanceled ? (
            <CircularProgress size={18} thickness={20} sx={{ fontSize: 30, color: "white" }} />
          ) : (
            "Cancel Card"
          )}
        </Button>
      </Grid>
      <Grid item>
        <Button
          sx={{
            backgroundColor: "gray",
            color: "white",
            width: "100%",
            mb: 2,
            mt: 2,
            borderRadius: 2,
            fontWeight: "Bold",
            fontFamily: "Poppins",
            fontSize: 18,
            "&:hover": {
              backgroundColor: "darkgray",
            },
          }}
          onClick={() => normalAlert(`Card hidden PIN is: ${card.hiddenPin}`)}
        >
          Reveal hidden PIN
        </Button>
      </Grid>
    </Grid>
  );
};

export default ApprovedCreditCardButtons;
