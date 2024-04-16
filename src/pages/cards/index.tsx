import * as React from "react";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useState, useEffect, useContext, useMemo } from "react";
import { successAlert } from "../../utils/swalAlerts";
import { generateUniqueId, generateUniqueNumber, getUserFullName } from "../../utils/utils";
import {
  Button,
  Grid,
  Modal,
  Box,
  Container,
  Typography,
  Skeleton,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../../UserProvider";
import { Card } from "../../models/card";
import CreditCardsRow from "../../components/CreditCard/CreditCardsRow";
import { useFetchCardsContext } from "../../contexts/fetchCardsContext";

const calculateExpiredDate = (date: string) => {
  const year = Number(date.slice(0, 4));
  const expiredYear = year + 3;
  const expiredDate = `${expiredYear}${date.slice(4)}`;
  return expiredDate;
};

const CardsPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const [isCardCreationLoading, setIsCardCreationLoading] = useState(false);
  const [cardProvider, setCardProvider] = useState("Visa");
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const { fetchCards, isLoading, cards } = useFetchCardsContext();

  const handleCardProviderChange = (event: { target: { value: string } }) => {
    setCardProvider(event.target.value);
  };

  const pendingCards = useMemo(() => {
    return cards.filter((card) => card.status === "pending");
  }, [cards]);

  const approvedCards = useMemo(() => {
    return cards.filter((card) => card.status === "approved");
  }, [cards]);

  const rejectedCards = useMemo(() => {
    return cards.filter((card) => card.status === "rejected");
  }, [cards]);

  const openCardModal = () => {
    setIsNewCardModalOpen(true);
  };

  const closeCardModal = () => {
    if (isCardCreationLoading) return;
    setIsNewCardModalOpen(false);
  };

  const cancelCard = async (card: Card) => {
    await CRUDLocalStorage.deleteItemFromList<Card>("cards", card);
    successAlert("Card Canceled!");
    await fetchCards();
  };

  const handleCardModalSubmit = async () => {
    setIsCardCreationLoading(true);

    const currentDateTime = new Date().toISOString();

    const newCard: Card = {
      type: cardProvider,
      id: generateUniqueId(),
      accountID: currentUser!.id,
      ownerName: getUserFullName(currentUser!),
      expireDate: calculateExpiredDate(currentDateTime),
      cardNumber: generateUniqueNumber(16),
      hiddenPin: generateUniqueNumber(3),
      status: "pending",
      rejectedMessage: "",
    };

    await CRUDLocalStorage.addItemToList<Card>("cards", newCard);
    successAlert("New Card Request Was Created!");
    setIsCardCreationLoading(false);
    closeCardModal();
    await fetchCards();
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Credit Cards";

  return (
    <Grid container justifyContent="flex-start">
      <Box component="main" sx={{ flexGrow: 0, ml: 15 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                  <Grid item xs={6}>
                    <Typography variant="h3" fontFamily="Poppins">
                      Credit Cards
                    </Typography>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end">
                    <Button onClick={openCardModal} type="submit" sx={{ width: "50%", borderRadius: 2 }}>
                      Request New Card
                    </Button>
                  </Grid>
                </Grid>

                {isLoading ? (
                  <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                    <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                  </Grid>
                ) : (
                  <Box>
                    <CreditCardsRow cards={approvedCards} title="Approved" cancelAction={cancelCard} />
                    <CreditCardsRow cards={pendingCards} title="Pending" />
                    <CreditCardsRow cards={rejectedCards} title="Rejected" />
                  </Box>
                )}
              </Grid>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Modal
        open={isNewCardModalOpen}
        onClose={closeCardModal}
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
            <Typography variant="h6" sx={{ fontFamily: "Poppins" }}>
              Select Card Provider
            </Typography>
            <Select
              value={cardProvider}
              onChange={handleCardProviderChange}
              sx={{ mt: 2, fontFamily: "Poppins", width: "100%" }}
            >
              <MenuItem value={"Visa"}>Visa</MenuItem>
              <MenuItem value={"Mastercard"}>Mastercard</MenuItem>
              <MenuItem value={"American Express"}>American Express</MenuItem>
            </Select>
            <Button type="submit" onClick={handleCardModalSubmit} disabled={isCardCreationLoading} sx={{ width: 301 }}>
              {isCardCreationLoading ? (
                <CircularProgress size={18} thickness={20} sx={{ fontSize: 30, color: "white" }} />
              ) : (
                "Create Card Request"
              )}
            </Button>
          </center>
        </Box>
      </Modal>
    </Grid>
  );
};

export default CardsPage;
