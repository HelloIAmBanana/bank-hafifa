import React, { useState } from "react";
import { useEffect, useMemo } from "react";
import { Box, Grid, Modal, Skeleton, Typography } from "@mui/material";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { User } from "../../models/user";
import { getUserFullName } from "../../utils/utils";
import { Card } from "../../models/card";
import CreditCardsRow from "../CreditCard/CreditCardsRow";

interface UserCardsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  user: User;
}

const UserCardsModal: React.FC<UserCardsModalProps> = ({ isOpen, closeModal, user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const fetchedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
      const currentCards = fetchedCards.filter((card) => card.accountID === user.id);
      setCards(currentCards);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
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

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: 5,
        }}
      >
        <Grid container justifyContent="flex-start">
          <Box component="main" sx={{ flexGrow: 0 }}>
            {isLoading ? (
              <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                <Skeleton height={"12rem"} width={window.innerWidth / 2} />
              </Grid>
            ) : cards.length < 1 ? (
              <Typography fontFamily={"Poppins"} variant="h3">
                {getUserFullName(user)} doesn't have any cards
              </Typography>
            ) : (
              <Box>
                <Typography fontFamily={"Poppins"} variant="h3">
                  {getUserFullName(user)} Cards
                </Typography>
                <CreditCardsRow cards={approvedCards} title="Approved" />
                <CreditCardsRow cards={pendingCards} title="Pending" />
                <CreditCardsRow cards={rejectedCards} title="Rejected" />
              </Box>
            )}
          </Box>
        </Grid>
      </Box>
    </Modal>
  );
};

export default UserCardsModal;
