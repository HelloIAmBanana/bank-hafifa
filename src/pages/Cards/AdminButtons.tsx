import { Box, Button, CircularProgress, Grid, Modal, TextField } from "@mui/material";
import { Card } from "../../models/card";
import { useState } from "react";
import { createNewNotification } from "../../utils/utils";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { successAlert } from "../../utils/swalAlerts";
import { useFetchCardsContext } from "../../contexts/fetchCardsContext";

interface AdminCreditCardButtonsProps {
  card: Card;
}

const AdminCreditCardButtons: React.FC<AdminCreditCardButtonsProps> = ({ card }) => {
  const [isCardBeingApproved, setIsCardBeingApproved] = useState(false);
  const { fetchCards } = useFetchCardsContext();
  const [isCardBeingRejected, setIsCardBeingRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectCardModalOpen, setIsRejectCardModalOpen] = useState(false);

  const rejectCard = async (card: Card, rejectionReason: string) => {
    const newCard: Card = {
      ...card,
      status: "rejected",
      rejectedMessage: rejectionReason,
    };

    await createNewNotification(card.accountID, "cardDeclined");

    await CRUDLocalStorage.updateItemInList<Card>("cards", newCard);
    successAlert("Card rejected!");
    await fetchCards();
  };

  const approveCard = async (card: Card) => {
    const newCard: Card = {
      ...card,
      status: "approved",
    };

    await createNewNotification(card.accountID, "cardApproved");
    await CRUDLocalStorage.updateItemInList<Card>("cards", newCard);
    successAlert("Card approved!");
    await fetchCards();
  };

  const approveCardButtonClicked = () => {
    setIsCardBeingApproved(true);
    approveCard(card);
  };

  const handleCardRejection = async () => {
    setIsCardBeingRejected(true);
    rejectCard(card, rejectionReason);
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item>
        <Button
          sx={{
            backgroundColor: "green",
            color: "white",
            width: "73px",
            height: "36px",
            mb: 2,
            fontFamily: "Poppins",
          }}
          onClick={() => approveCardButtonClicked()}
        >
          {isCardBeingApproved ? (
            <CircularProgress size={18} thickness={20} sx={{ fontSize: 30, color: "white" }} />
          ) : (
            "Aceept"
          )}
        </Button>
      </Grid>
      <Grid item>
        <Button
          sx={{
            backgroundColor: "red",
            color: "white",
            width: "73px",
            height: "36px",
            mb: 2,
            fontFamily: "Poppins",
          }}
          disabled={isCardBeingApproved}
          onClick={() => setIsRejectCardModalOpen(true)}
        >
          Reject
        </Button>
      </Grid>
      <Modal
        open={isRejectCardModalOpen}
        onClose={() => setIsRejectCardModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <center>
            <TextField
              fullWidth
              label="Rejection Reason"
              variant="outlined"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              sx={{ mt: 2, fontFamily: "Poppins" }}
            />

            <Button
              type="submit"
              onClick={handleCardRejection}
              disabled={isCardBeingRejected}
              sx={{ width: "227.5px" }}
            >
              {isCardBeingRejected ? (
                <CircularProgress size={18} thickness={20} sx={{ fontSize: 30, color: "white" }} />
              ) : (
                "Reject Request"
              )}
            </Button>
          </center>
        </Box>
      </Modal>
    </Grid>
  );
};

export default AdminCreditCardButtons;
