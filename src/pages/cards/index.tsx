import * as React from "react";
import AuthService from "../../AuthService";
import NavBar from "../../components/navigationBar/navBar";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useState, useEffect } from "react";
import { User } from "../../models/user";
import { Card } from "../../models/card";
import { useNotSignedUser } from "../../hooks/useRememberedUser";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import {
  generateUniqueCardNumber,
  generateUniqueCardPin,
} from "../../utils/utils";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid, Modal, CircularProgress, Box } from "@mui/material";
import GenericModal from "../../components/GenericModal/GenericModal";

const modalFields = [
  {
    id: "accountID",
    label: "Account ID",
    type: "text",
    required: true,
    placeholder: "Enter Account ID",
  },
  {
    id: "type",
    label: "Card Type",
    type: "select",
    required: true,
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
    required: true,
    placeholder: "Enter Date Of Expiration",
  },
];

const CardsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [testModal, setTestModal] = useState(false);
  const [approvedCards, setApprovedCards] = useState<Card[]>([]);
  const [rejectedCards, setRejectedCards] = useState<Card[]>([]);

  useEffect(() => {
    storeCurrentUser();
    storeCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const storeCards = async () => {
    const storedCards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
    const userCards = storedCards.filter(
      (card) => card.accountId === currentUser?.id
    );
    const userApprovedCards = userCards.filter(
      (card) => card.status === "appending"
    );
    const userRejectedCards = userCards.filter(
      (card) => card.status === "rejected"
    );
    setApprovedCards(userApprovedCards);
    setRejectedCards(userRejectedCards);
  };
  const storeCurrentUser = async () => {
    setCurrentUser(await AuthService.getCurrentUser());
  };
  const handleCardModal = () => {
    setTestModal(!testModal);
  };

  const handleModalSubmit = async (data: any) => {
    handleCardModal();
    setIsLoading(true);
    const cardOwner = await AuthService.getUserFromStorage(data.accountID);
    if (cardOwner) {
      const newCard: Card = {
        ...data,
        cardNumber: generateUniqueCardNumber(),
        ownerName: cardOwner.firstName + " " + cardOwner.lastName,
        hiddenPin: generateUniqueCardPin(),
        status: "appending",
        rejectedMessage: "",
      };
      const cards = await CRUDLocalStorage.getAsyncData<Card[]>("cards");
      const updatedCards = [...cards, newCard];
      await CRUDLocalStorage.setAsyncData("cards", updatedCards);
      successAlert("Card was created!");
    } else {
      errorAlert("!USER DOES NOT EXIST!");
    }
    setIsLoading(false);
  };

  const columns = [
    { field: "cardNumber", headerName: "Number", width: 200 },
    { field: "ownerName", headerName: "Owner Name", width: 200 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "expireDate", headerName: "Expire Date", width: 150 },
    { field: "hiddenPin", headerName: "Hidden PIN", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  useNotSignedUser();

  return (
    <Box mx={30} sx={{ paddingTop: 8 }}>
      <NavBar />
      {isLoading || !currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Button onClick={handleCardModal}>CREATE NEW CARD (TEST)</Button>
            </Grid>
          </Grid>
          Approved Cards
          <DataGrid
            rows={approvedCards}
            columns={columns}
            autoHeight={true}
            getRowId={(rowData) => rowData.cardNumber}
            disableColumnSorting
            disableColumnMenu
          />
          Rejected Cards
          <DataGrid
            rows={rejectedCards}
            columns={columns}
            autoHeight={true}
            getRowId={(rowData) => rowData.cardNumber}
            disableColumnSorting
            disableColumnMenu
          />
        </Box>
      )}
      <Modal //Card
        id="CardModal"
        open={testModal}
        onClose={handleCardModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GenericModal
          fields={modalFields}
          onSubmit={handleModalSubmit}
          submitButtonLabel="Create Card"
        />
      </Modal>
    </Box>
  );
};

export default CardsPage;
