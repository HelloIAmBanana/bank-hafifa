import * as React from "react";
import AuthService from "../../AuthService";
import NavBar from "../../components/NavigationBar/NavBar";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useState, useEffect, useContext, useMemo } from "react";
import { Card } from "../../models/card"
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { generateUniqueNumber, updateUser } from "../../utils/utils"
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid, Modal, CircularProgress, Box, Typography } from "@mui/material";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import GenericForm from "../../components/GenericForm/GenericForm";
import { UserContext } from "../../UserProvider";
import { User } from "../../models/user";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const schema: JSONSchemaType<Card> = {
  type: "object",
  properties: {
    cardNumber: { type: "number" },
    accountID: { type: "string" },
    type: { type: "string", enum: ["Visa", "Mastercard", "American Express"] },
    expireDate: { type: "string", minLength:1},
    hiddenPin: { type: "number" },
    status: { type: "string" },
    rejectedMessage: { type: "string" },
  },
  required: ["accountID","type","expireDate"],
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

  const columns = [
    { field: "cardNumber", headerName: "Number", width: 200 },
    { field: "cardOwnerName", headerName: "Owner Name", width: 200 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "expireDate", headerName: "Expire Date", width: 150 },
    { field: "hiddenPin", headerName: "Hidden PIN", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  const fields = useMemo(() => {
    return [
      {
        id: "accountID",
        label: "Account ID",
        type: "text",
        placeholder: "Enter Account ID",
        initValue: `${currentUser?.id}`
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
                cardOwnerName: AuthService.getUserFullName(currentUser),
                expireDate: cards.expireDate.slice(0,7).replace("-","/"),
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
    await updateUser(updatedUser);
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
        cardNumber: Number(generateUniqueNumber(16)),
        hiddenPin: Number(generateUniqueNumber(16).slice(1,4)),
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
  }, [currentUser]);

  return (
    <Box mx={30} sx={{ paddingTop: 8 }}>
      <NavBar />
      {!currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Button onClick={openCardModal}>CREATE NEW CARD (TEST)</Button>
            </Grid>
          </Grid>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom sx={{ fontFamily: "Poppins" }}>
            Create Transaction
          </Typography>
          <DataGrid
            rows={cards}
            columns={columns}
            autoHeight={true}
            getRowId={(rowData) => rowData.cardNumber}
            disableColumnSorting
            disableColumnMenu
            loading={isTableLoading}
          />
        </Box>
      )}
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
