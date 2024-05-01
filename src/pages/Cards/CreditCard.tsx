import React, { useContext, useMemo } from "react";
import Visa from "../../../imgs/icons/Visa.svg";
import AmericanExpress from "../../../imgs/icons/AmericanExpress.svg";
import Mastercard from "../../../imgs/icons/Mastercard.svg";
import ContactlessIcon from "../../../imgs/icons/Contactless.svg";
import thunderIcon from "../../../imgs/icons/Thunder.svg";
import { Grid, Paper, Typography } from "@mui/material";
import { Card } from "../../models/card";
import { formatIsoStringToDate } from "../../utils/utils";
import { UserContext } from "../../UserProvider";
import AuthService from "../../AuthService";
import { useLocation } from "react-router-dom";
import AdminCreditCardButtons from "./AdminButtons";
import RejectedCreditCardButtons from "./RejectedCreditCardButtons";
import ApprovedCreditCardButtons from "./ApprovedCreditCardButtons";

interface CardProps {
  card: Card;
}
const getCardProviderImage = (type: string) => {
  switch (type) {
    case "Visa":
      return Visa;
    case "American Express":
      return AmericanExpress;
    case "Mastercard":
      return Mastercard;
  }
};

const CreditCard: React.FC<CardProps> = ({ card }) => {
  const [currentUser] = useContext(UserContext);
  const location = useLocation();

  const isSpectating = `/admin/user/cards/${card.accountID}` === location.pathname;

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Paper
        sx={{
          width: 350,
          height: "12rem",
          border: "2px solid black",
          borderRadius: 3,
          backgroundColor: "#DF0351",
          backgroundImage: "linear-gradient(135deg, #DF0351, #525A9A)",
        }}
        elevation={16}
      >
        <Grid container justifyContent="space-between" spacing={{ xs: 3, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid container direction="row" justifyContent="space-between" alignItems="flex-start" mt={3} ml={2}>
            <Grid item xs={4} sm={4} md={4} key={1} sx={{ ml: 2, mt: 2 }}>
              <img width="30rem" height="30rem" src={`${thunderIcon}`} alt="Thunder" />
            </Grid>
            <Grid item xs={4} sm={4} md={4} key={1} sx={{ mr: -7, mt: 2 }}>
              <img width="30rem" height="30rem" src={`${ContactlessIcon}`} alt="Contactless" />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} key={2} />
          <Grid item xs={12} sm={12} md={12} key={3} sx={{ mt: -3 }}>
            <center>
              <Typography color="silver" fontFamily="CreditCard" fontSize={16}>
                {card.status !== "approved" && !isAdmin
                  ? "???? ???? ???? ????"
                  : card.cardNumber
                      .toString()
                      .match(/.{1,4}/g)
                      ?.join(" ") || ""}
              </Typography>
            </center>
          </Grid>
          <Grid item xs={2} sm={5} md={8} key={4} sx={{ ml: 1, mt: 2 }}>
            <Typography color="white">{card.ownerName}</Typography>
            <Typography color="white">
              {card.status !== "approved" && !isAdmin ? "??/??" : formatIsoStringToDate(card.expireDate, "MM/yyyy")}
            </Typography>
          </Grid>
          <Grid item xs={2} sm={3} md={4} key={5} sx={{ mr: -2 }}>
            <img width="60rem" height="60rem" src={`${getCardProviderImage(card.type)}`} alt="Card Provider" />
          </Grid>
        </Grid>
      </Paper>
      {!isSpectating && isAdmin && card.status === "pending" && <AdminCreditCardButtons card={card} />}
      {!isSpectating && !isAdmin && card.status === "rejected" && <RejectedCreditCardButtons card={card} />}
      {!isSpectating && !isAdmin && card.status === "approved" && <ApprovedCreditCardButtons card={card} />}
    </Grid>
  );
};

export default CreditCard;
