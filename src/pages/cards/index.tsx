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
import { User } from "../../models/user";
import { Card } from "../../models/card";
import { PacmanLoader } from "react-spinners";
import CardGenerator from "../../components/CreditCard";
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
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
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
    setIsTableLoading(true);
    if (currentUser) {
      try {
        const fetchedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
        const modifiedCards = await Promise.all(
          fetchedCards
            .filter((filteredCards) => filteredCards.accountID === currentUser.id)
            .map((cards) => {
              return {
                ...cards,
                cardOwnerName: getUserFullName(currentUser),
                expireDate: cards.expireDate.slice(0, 7).replace("-", "/"),
              };
            })
        );
        setCards(modifiedCards);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setIsTableLoading(false);
  };

  const openCardModal = () => {
    setIsNewCardModalOpen(true);
  };

  const closeCardModal = () => {
    setIsNewCardModalOpen(false);
  };

  const updateUserCardsAmount = async (cardOwner: User) => {
    const updatedCardsAmount = cardOwner.cardsAmount + 1;
    const updatedUser: User = {
      ...cardOwner,
      cardsAmount: updatedCardsAmount,
    };
    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    if (cardOwner.id === currentUser?.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleCardModalSubmit = async (data: any) => {
    setIsButtonLoading(true);
    const cardOwner = await AuthService.getUserFromStorage(data.accountID);
    if (cardOwner) {
      const newCard: Card = {
        ...data,
        cardNumber: +generateUniqueNumber(16),
        hiddenPin:+generateUniqueNumber(16).slice(1, 4),
        status: "Appending",
        rejectedMessage: "",
      };
      if (validateForm(newCard)) {
        await CRUDLocalStorage.addItemToList<Card>("cards", newCard);
        await updateUserCardsAmount(cardOwner);
        successAlert("Card was created!");
        closeCardModal();
      }
    } else {
      errorAlert("USER DOES NOT EXIST!");
      closeCardModal();
    }
    setIsButtonLoading(false);
  };

  useEffect(() => {
    fetchUserCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return !currentUser ? (
    <Grid container direction="column" justifyContent="flex-end" alignItems="center" marginTop={45}>
      <PacmanLoader color="#ffe500" size={50} />
    </Grid>
  ) : (
    <Box sx={{ display: "flex", backgroundColor: "white", boxShadow: 16 }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 0, ml: 15 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Grid item>
              <Button onClick={openCardModal}>CREATE NEW CARD (JUST FOR TESTING)</Button>
            </Grid>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" justifyContent="center" alignItems="center" >
                <Grid item xs={12} md={12} xl={12} ml={16}>
                  <Typography variant="h3" fontFamily="Poppins" mt={5}>
                    Owned
                  </Typography>
                </Grid>
                {isTableLoading ? (
                  <Skeleton height={700} width={1400} />
                ) : (
                  cards.map((_, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index} ml={5} mt={5}>
                      <CardGenerator
                        cardOwnerName={getUserFullName(currentUser)}
                        cardNumber={`${_.cardNumber}`}
                        expireDate={_.expireDate}
                        cardType={_.type}
                      />
                    </Grid>
                  ))
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
              isLoading={isButtonLoading}
            ></GenericForm>
          </center>
        </Box>
      </Modal>
    </Box>
  );
};

export default CardsPage;
