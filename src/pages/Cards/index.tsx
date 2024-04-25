import React, { Suspense} from "react";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useState, useEffect, useContext } from "react";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { filterArrayByStatus, generateUniqueId, generateUniqueNumber, getUserFullName } from "../../utils/utils";
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
import AuthService from "../../AuthService";
import { Await, useLoaderData, useNavigate, useParams, useRevalidator } from "react-router-dom";
import { User } from "../../models/user";
import { GenericLoaderData } from "../../utils/genericLoader";
import CreditCardsRow from "./CreditCard/CreditCardsRow";


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

  const data = useLoaderData() as GenericLoaderData<Card>;
  const revalidator = useRevalidator();
  const loadingState = revalidator.state;

  const isLoading = Boolean(loadingState === "loading");

  const navigate = useNavigate();
  const { userID } = useParams();

  const handleCardProviderChange = (event: { target: { value: string } }) => {
    setCardProvider(event.target.value);
  };

  const isAdmin = AuthService.isUserAdmin(currentUser!);

  const openCardModal = () => {
    setIsNewCardModalOpen(true);
  };

  const closeCardModal = () => {
    if (isCardCreationLoading) return;
    setIsNewCardModalOpen(false);
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
    revalidator.revalidate();
  };

  const isSpectatedUserReal = async () => {
    if (userID) {
      const spectatedUser = await CRUDLocalStorage.getItemInList<User>("users", userID);
      if (!spectatedUser) {
        errorAlert("ID ISNT REAL");
        navigate("/admin/users");
        return;
      }
    }
  };

  useEffect(() => {
    isSpectatedUserReal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = isAdmin ? "Manage Cards" : "Credit Cards";

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
                    {!isAdmin && !userID && (
                      <Button onClick={openCardModal} type="submit" sx={{ width: "50%", borderRadius: 2 }}>
                        Request New Card
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <Suspense
                  fallback={
                    <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                      <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                    </Grid>
                  }
                >
                  <Await resolve={data.items} errorElement={<p>Error loading cards!</p>}>
                    {(cards) =>
                      isLoading ? (
                        <Box>
                          <Skeleton sx={{ transform: "translate(0,0)" }}>
                            <CreditCardsRow cards={filterArrayByStatus(cards, "approved", userID)} title="Approved" />
                          </Skeleton>
                          <Skeleton sx={{ transform: "translate(0,0)" }}>
                            <CreditCardsRow cards={filterArrayByStatus(cards, "pending", userID)} title="Pending" />
                          </Skeleton>
                          <Skeleton sx={{ transform: "translate(0,0)" }}>
                            <CreditCardsRow cards={filterArrayByStatus(cards, "rejected", userID)} title="Rejected" />
                          </Skeleton>
                        </Box>
                      ) : (
                        <Box>
                          <CreditCardsRow cards={filterArrayByStatus(cards, "approved", userID)} title="Approved" />
                          <CreditCardsRow cards={filterArrayByStatus(cards, "pending", userID)} title="Pending" />
                          <CreditCardsRow cards={filterArrayByStatus(cards, "rejected", userID)} title="Rejected" />
                        </Box>
                      )
                    }
                  </Await>
                </Suspense>
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
