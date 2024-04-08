import * as React from "react";
import AuthService from "../../AuthService";
import NavBar from "../../components/NavigationBar/NavBar";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useState, useEffect, useContext, useMemo } from "react";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { generateUniqueNumber, getUserFullName } from "../../utils/utils";
import { Button, Grid, Modal, Box, Container, Typography, Skeleton } from "@mui/material";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import GenericForm from "../../components/GenericForm/GenericForm";
import { UserContext } from "../../UserProvider";
import { Card } from "../../models/card";
import { PacmanLoader } from "react-spinners";
import CreditCard from "../../components/CreditCard";
import { FirstLoadContext } from "../../FirstLoanProvider";
const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const schema: JSONSchemaType<Card> = {
  type: "object",
  properties: {
    cardNumber: { type: "number" },
    accountID: { type: "string" },
    type: { type: "string", enum: ["Visa", "Mastercard", "American Express"] },
    expireDate: { type: "string", minLength: 1 },
    hiddenPin: { type: "number" },
    status: { type: "string" },
    rejectedMessage: { type: "string" },
  },
  required: ["accountID", "type", "expireDate"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      accountID: "Enter Account ID",
      type: "Enter Card Provider",
      expireDate: "Please Enter Expiration Date",
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

  const fields = useMemo(() => {
    return [
      {
        id: "accountID",
        label: "Account ID",
        type: "text",
        placeholder: "Enter Account ID",
        initValue: `${currentUser?.id}`,
      },
      {
        id: "type",
        label: "Card Type",
        type: "select",
        placeholder: "Enter Credit Card Provider",
        options: [
          { value: "Visa", label: "Visa" },
          { value: "Mastercard", label: "Mastercard" },
          { value: "American Express", label: "American Express" },
        ],
      },
      {
        id: "expireDate",
        label: "Date Of Expiry",
        type: "date",
        placeholder: "Enter Date Of Expiration",
      },
    ];
  }, [currentUser]);

  const fetchUserCards = async () => {
    setIsCardsLoading(true);
    if (currentUser) {
      try {
        const fetchedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
        const modifiedCards = fetchedCards
          .filter((filteredCards) => filteredCards.accountID === currentUser.id)
          .map((cards) => {
            return {
              ...cards,
              cardOwnerName: getUserFullName(currentUser),
              expireDate: cards.expireDate.slice(0, 7).replace("-", "/"),
            };
          });
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

  const handleCardModalSubmit = async (data: any) => {
    setIsCardCreationLoading(true);
    const cardOwner = await AuthService.getUserFromStorage(data.accountID);

    if (!cardOwner) {
      errorAlert("USER DOES NOT EXIST!");
      closeCardModal();
      setIsCardCreationLoading(false);
      return;
    }

    const newCard: Card = {
      ...data,
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
                  <Skeleton height={"12rem"} width={window.innerWidth / 2} /></Grid>
                ) : (
                  <Box>
                    {approvedCards.length > 0 && (
                      <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                        <Typography variant="h5" fontFamily="Poppins">
                          Approved
                        </Typography>
                        <Box
                          sx={{ mt: 2, overflowX: "auto", display: "flex", flexDirection: "row",maxWidth: "100vh", width:"auto" }}
                        >
                          {approvedCards.map((card, index) => (
                            <Grid item key={index} sx={{ marginRight: 2 }}>
                              <CreditCard
                                cardOwnerName={getUserFullName(currentUser)}
                                cardNumber={`${card.cardNumber}`}
                                expireDate={card.expireDate}
                                cardType={card.type}
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
                          sx={{ mt: 2, overflowX: "auto", display: "flex", flexDirection: "row", maxWidth: "100vh", width:"auto" }}
                        >
                          {pendingCards.map((card, index) => (
                            <Grid item key={index} sx={{ marginRight: 2 }}>
                              <CreditCard
                                cardOwnerName={getUserFullName(currentUser)}
                                cardNumber={`${card.cardNumber}`}
                                expireDate={card.expireDate}
                                cardType={card.type}
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
                          sx={{ mt: 2, overflowX: "auto", display: "flex", flexDirection: "row", maxWidth: "100vh", width:"auto" }}
                        >
                          {rejectedCards.map((card, index) => (
                            <Grid item key={index} sx={{ marginRight: 2 }}>
                              <CreditCard
                                cardOwnerName={getUserFullName(currentUser)}
                                cardNumber={`${card.cardNumber}`}
                                expireDate={card.expireDate}
                                cardType={card.type}
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
              submitButtonLabel={"Create Card"}
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
