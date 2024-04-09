import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Grid, Box, Container, Typography, Skeleton } from "@mui/material";
import { Card } from "../../../models/card";
import { UserContext } from "../../../UserProvider";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import {  successAlert } from "../../../utils/swalAlerts";
import CreditCard from "../../../components/CreditCard";

const AdminCardsPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const [isCardsLoading, setIsCardsLoading] = useState(false);
  const [pendingCards, setPendingCards] = useState<Card[]>([]);

  const approveCard = async (card: Card) => {
    const newCard: Card = {
      ...card,
      status: "approved",
    };
    await CRUDLocalStorage.updateItemInList<Card>("cards", newCard);
    successAlert("Card approved!");
    await fetchCards();
  };

  const rejectCard = async (card: Card, rejectionReason: string) => {
    const newCard: Card = {
      ...card,
      status: "rejected",
      rejectedMessage: rejectionReason,
    };
    await CRUDLocalStorage.updateItemInList<Card>("cards", newCard);
    successAlert("Card rejected!");
    await fetchCards();
  };

  const fetchCards = async () => {
    setIsCardsLoading(true);
    if (currentUser) {
      try {
        const fetchedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
        const modifiedCards: Card[] = fetchedCards.filter((filteredCards) => filteredCards.status === "pending");
        setPendingCards(modifiedCards);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setIsCardsLoading(false);
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Credit Cards";

  return (
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
              </Grid>

              {isCardsLoading ? (
                <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                  <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                </Grid>
              ) : (
                <Box>
                  {pendingCards.length > 0 && (
                    <Grid item mt={2}>
                      <Typography variant="h5" fontFamily="Poppins">
                        Card Requests
                      </Typography>
                      <Grid container direction="row">
                        {pendingCards.map((card, index) => (
                          <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            xl={4}
                            lg={6}
                            md={8}
                            sm={12}
                          >
                            <Grid item key={index} sx={{ marginRight: 2 }}>
                              <CreditCard
                                card={card}
                                approveCard={approveCard}
                                rejectCard={rejectCard}
                                isUserAdmin={true}
                                cancelCard={(card) => {
                                  return;
                                }}
                              />
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}
            </Grid>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminCardsPage;
