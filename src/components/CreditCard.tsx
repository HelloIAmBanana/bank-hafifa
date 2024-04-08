import React from "react";
import AmericanExpress from "../imgs/icons/AmericanExpress.svg";
import Visa from "../imgs/icons/Visa.svg";
import Mastercard from "../imgs/icons/Mastercard.svg";
import ContactlessIcon from "../imgs/icons/Contactless.svg";
import thunderIcon from "../imgs/icons/Thunder.svg";

import { Grid, Paper, Typography } from "@mui/material";

interface Props {
  cardOwnerName: string;
  expireDate: string;
  cardNumber: string;
  cardType: string;
}
const getCardProviderImage = (type: string) => {
  switch (type) {
    case "Visa":
      return Visa;
    case "American Express":
      return AmericanExpress;
    case "Mastercard":
      return Mastercard;
    default:
      return null;
  }
};

const CreditCard: React.FC<Props> = ({ cardOwnerName, cardNumber, expireDate, cardType }) => {
  return (
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
              {cardNumber.match(/.{1,4}/g)?.join(" ") || ""}
            </Typography>
          </center>
        </Grid>
        <Grid item xs={2} sm={5} md={8} key={4} sx={{ ml: 1, mt: 2 }}>
          <Typography color="white">
            {cardOwnerName}
          </Typography>
          <Typography color="white">
            {expireDate}
          </Typography>
        </Grid>
        <Grid item xs={2} sm={3} md={4} key={5} sx={{ mr: -2 }}>
          <img width="60rem" height="60rem" src={`${getCardProviderImage(cardType)}`} alt="Card Provider" />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreditCard;
