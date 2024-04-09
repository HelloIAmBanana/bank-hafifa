import * as React from "react";
import NavBar from "../../components/NavigationBar/NavBar";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useState, useEffect, useContext } from "react";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { deleteLegacyCreditCard, generateUniqueId, generateUniqueNumber, getUserFullName } from "../../utils/utils";
import { Button, Grid, Modal, Box, Container, Typography, Skeleton } from "@mui/material";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import GenericForm from "../../components/GenericForm/GenericForm";
import { UserContext } from "../../UserProvider";
import { Card } from "../../models/card";
import { PacmanLoader } from "react-spinners";
import CreditCard from "../../components/CreditCard";
import { FirstLoadContext } from "../../FirstLoadProvider";
import { useIsUserAdmin } from "../../hooks/useIsUserAdmin";
const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const schema: JSONSchemaType<Card> = {
  type: "object",
  properties: {
    id: { type: "string" },
    cardNumber: { type: "number" },
    accountID: { type: "string" },
    ownerName: { type: "string" },
    type: { type: "string", enum: ["Visa", "Mastercard", "American Express"] },
    expireDate: { type: "string", minLength: 1 },
    hiddenPin: { type: "number" },
    status: { type: "string" },
    rejectedMessage: { type: "string" },
  },
  required: ["type"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      type: "Enter Card Provider",
    },
  },
};

const validateForm = ajv.compile(schema);

const CardsPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const [firstLoad, setFirstLoad] = useContext(FirstLoadContext);
  const [isCardsLoading, setIsCardsLoading] = useState(false);
  const [isCardCreationLoading, setIsCardCreationLoading] = useState(false);
  const [pendingCards, setPendingCards] = useState<Card[]>([]);
  const [approvedCards, setApprovedCards] = useState<Card[]>([]);
  const [rejectedCards, setRejectedCards] = useState<Card[]>([]);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);

  const fields = [
    {
      id: "type",
      label: "Card Provider",
      type: "select",
      placeholder: "Enter Credit Card Provider",
      options: [
        { value: "Visa", label: "Visa" },
        { value: "Mastercard", label: "Mastercard" },
        { value: "American Express", label: "American Express" },
      ],
    },
  ];

  const fetchUserCards = async () => {
    setIsCardsLoading(true);
    if (currentUser) {
      try {
        const fetchedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
        const modifiedCards: Card[] = fetchedCards.filter(
          (filteredCards) => filteredCards.accountID === currentUser.id
        );
        setApprovedCards(modifiedCards.filter((card) => card.status === "approved"));
        setRejectedCards(modifiedCards.filter((card) => card.status === "rejected"));
        setPendingCards(modifiedCards.filter((card) => card.status === "pending"));
        setFirstLoad(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setIsCardsLoading(false);
  };

  const openCardModal = () => {
    setIsNewCardModalOpen(true);
  };

  const closeCardModal = () => {
    setIsNewCardModalOpen(false);
  };

  const cancelCard = async (card: Card) => {
    if (!card.id) {
      errorAlert("Card is outdated! Removing from local storage!");
      await deleteLegacyCreditCard(card);
      await fetchUserCards();
      return;
    }
    await CRUDLocalStorage.deleteItemFromList<Card>("cards", card);
    successAlert("Card Canceled!");
    await fetchUserCards();
  };

  const calculateExpiredDate = (date: string) => {
    const year = Number(date.slice(0, 4));
    const expiredYear = year + 3;
    const expiredDate = `${expiredYear}${date.slice(4)}`;
    return expiredDate;
  };

  const handleCardModalSubmit = async (data: any) => {
    setIsCardCreationLoading(true);
    if (!data.type) {
      setIsCardCreationLoading(false);
      return;
    }
    const currentDateTime = new Date().toISOString();

    const newCard: Card = {
      ...data,
      id: generateUniqueId(),
      accountID: currentUser!.id,
      ownerName: getUserFullName(currentUser!),
      expireDate: calculateExpiredDate(currentDateTime),
      cardNumber: +generateUniqueNumber(16),
      hiddenPin: +generateUniqueNumber(16).slice(1, 4),
      status: "pending",
      rejectedMessage: "",
    };

    if (!validateForm(newCard)) return;

    await CRUDLocalStorage.addItemToList<Card>("cards", newCard);
    successAlert("Card was created!");
    closeCardModal();
    fetchUserCards();
    setIsCardCreationLoading(false);
  };

  useEffect(() => {
    fetchUserCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Credit Cards";
  useIsUserAdmin();
  return !currentUser ? (
    <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : firstLoad ? (
    <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh">
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : (
    <Box sx={{ display: "flex", backgroundColor: "white", boxShadow: 16 }}>
      <NavBar />
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

                {isCardsLoading ? (
                  <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                    <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                  </Grid>
                ) : (
                  <Box>
                    {approvedCards.length > 0 && (
                      <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                        <Typography variant="h5" fontFamily="Poppins">
                          Approved
                        </Typography>
                        <Box
                          sx={{
                            mt: 2,
                            overflowX: "auto",
                            display: "flex",
                            flexDirection: "row",
                            maxWidth: "100vh",
                            width: "auto",
                          }}
                        >
                          {approvedCards.map((card, index) => (
                            <Grid item key={index} sx={{ marginRight: 2 }}>
                              <CreditCard
                                card={card}
                                approveCard={(card) => {
                                  return;
                                }}
                                rejectCard={(card) => {
                                  return;
                                }}
                                isUserAdmin={false}
                                cancelCard={cancelCard}
                              />
                            </Grid>
                          ))}
                        </Box>
                      </Grid>
                    )}
                    {pendingCards.length > 0 && (
                      <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                        <Typography variant="h5" fontFamily="Poppins">
                          Pending
                        </Typography>
                        <Grid
                          sx={{
                            mt: 2,
                            overflowX: "auto",
                            display: "flex",
                            flexDirection: "row",
                            maxWidth: "100vh",
                            width: "auto",
                          }}
                        >
                          {pendingCards.map((card, index) => (
                            <Grid item key={index} sx={{ marginRight: 2 }}>
                              <CreditCard
                                card={card}
                                approveCard={(card) => {
                                  return;
                                }}
                                rejectCard={(card) => {
                                  return;
                                }}
                                isUserAdmin={false}
                                cancelCard={(card) => {
                                  return;
                                }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
                    {rejectedCards.length > 0 && (
                      <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                        <Typography variant="h5" fontFamily="Poppins">
                          Rejected
                        </Typography>
                        <Box
                          sx={{
                            mt: 2,
                            overflowX: "auto",
                            display: "flex",
                            flexDirection: "row",
                            maxWidth: "100vh",
                            width: "auto",
                          }}
                        >
                          {rejectedCards.map((card, index) => (
                            <Grid item key={index} sx={{ marginRight: 2 }}>
                              <CreditCard
                                card={card}
                                approveCard={(card) => {
                                  return;
                                }}
                                rejectCard={(card) => {
                                  return;
                                }}
                                isUserAdmin={false}
                                cancelCard={(card) => {
                                  return;
                                }}
                              />
                            </Grid>
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Box>
                )}
              </Grid>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Modal
        id="CardModal"
        open={isNewCardModalOpen}
        onClose={closeCardModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
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
            <GenericForm
              fields={fields}
              onSubmit={handleCardModalSubmit}
              submitButtonLabel={"Request New Card"}
              schema={schema}
              isLoading={isCardCreationLoading}
            ></GenericForm>
          </center>
        </Box>
      </Modal>
    </Box>
  );
};

export default CardsPage;
