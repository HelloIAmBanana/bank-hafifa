import React, { useState } from "react";
import AmericanExpress from "../imgs/icons/AmericanExpress.svg";
import Visa from "../imgs/icons/Visa.svg";
import Mastercard from "../imgs/icons/Mastercard.svg";
import ContactlessIcon from "../imgs/icons/Contactless.svg";
import thunderIcon from "../imgs/icons/Thunder.svg";
import { Box, Button, CircularProgress, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import { Card } from "../models/card";
import { normalAlert } from "../utils/swalAlerts";
import { formatIsoStringToDate } from "../utils/utils";

interface Props {
  card: Card;
  isUserAdmin: Boolean;
  approveCard: (card: Card) => void;
  rejectCard: (card: Card, data: any) => void;
  cancelCard: (card: Card) => void;
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

const CreditCard: React.FC<Props> = ({ card, isUserAdmin, approveCard, rejectCard, cancelCard }) => {
  const [isCardBeingApproved, setIsCardBeingApproved] = useState(false);
  const [isCardBeingCanceled, setIsCardBeingCanceled] = useState(false);
  const [isCardBeingRejected, setIsCardBeingRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectCardModalOpen, setIsRejectCardModalOpen] = useState(false);
  const [isShowRejectionReasonModalOpen, setIsShowRejectionReasonModalOpen] = useState(false);

  const handleRejectionReasonModalOpen = () => setIsShowRejectionReasonModalOpen(true);
  const handleRejectionReasonModalClose = () => setIsShowRejectionReasonModalOpen(false);

  const approveCardButtonClicked = () => {
    setIsCardBeingApproved(true);
    approveCard(card);
  };

  const cancelCardButtonClicked = () => {
    setIsCardBeingCanceled(true);
    cancelCard(card);
  };

  const rejectCardButtonClicked = () => {
    setIsRejectCardModalOpen(true);
  };

  const handleCardRejection = async () => {
    setIsCardBeingRejected(true);
    rejectCard(card, rejectionReason);
  };

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
                {card.cardNumber
                  .toString()
                  .match(/.{1,4}/g)
                  ?.join(" ") || ""}
              </Typography>
            </center>
          </Grid>
          <Grid item xs={2} sm={5} md={8} key={4} sx={{ ml: 1, mt: 2 }}>
            <Typography color="white">{card.ownerName}</Typography>
            <Typography color="white">{formatIsoStringToDate(card.expireDate, "MM/yyyy")}</Typography>
          </Grid>
          <Grid item xs={2} sm={3} md={4} key={5} sx={{ mr: -2 }}>
            <img width="60rem" height="60rem" src={`${getCardProviderImage(card.type)}`} alt="Card Provider" />
          </Grid>
        </Grid>
      </Paper>
      {!isUserAdmin ? (
        <Box />
      ) : (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <Button
              sx={{
                backgroundColor: "green",
                color: "white",
                width: "73px",
                height: "36px",
                mb: 2,
                fontFamily: "Poppins",
              }}
              onClick={() => approveCardButtonClicked()}
            >
              {isCardBeingApproved ? (
                <CircularProgress size={18} thickness={20} sx={{ fontSize: 30, color: "white" }} />
              ) : (
                "Aceept"
              )}
            </Button>
          </Grid>
          <Grid item>
            <Button
              sx={{
                backgroundColor: "red",
                color: "white",
                width: "73px",
                height: "36px",
                mb: 2,
                fontFamily: "Poppins",
              }}
              disabled={isCardBeingApproved}
              onClick={() => rejectCardButtonClicked()}
            >
              Reject
            </Button>
          </Grid>
        </Grid>
      )}
      {card.status !== "rejected" ? (
        <Box />
      ) : (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <Button
              sx={{
                backgroundColor: "red",
                color: "white",
                width: "100%",
                mb: 2,
                mt: 2,
                borderRadius: 2,
                fontWeight: "Bold",
                fontFamily: "Poppins",
                fontSize: 18,
                "&:hover": {
                  backgroundColor: "darkred",
                },
              }}
              onClick={handleRejectionReasonModalOpen}
            >
              Show Rejection Reason
            </Button>
          </Grid>
        </Grid>
      )}
      {card.status !== "approved" ? (
        <Box />
      ) : (
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item>
            <Button
              sx={{
                backgroundColor: "red",
                color: "white",
                width: "146px",
                height: "43px",
                mb: 2,
                mt: 2,
                borderRadius: 2,
                fontWeight: "Bold",
                fontFamily: "Poppins",
                fontSize: 18,
                "&:hover": {
                  backgroundColor: "darkred",
                },
              }}
              onClick={() => cancelCardButtonClicked()}
            >
              {isCardBeingCanceled ? (
                <CircularProgress size={18} thickness={20} sx={{ fontSize: 30, color: "white" }} />
              ) : (
                "Cancel Card"
              )}
            </Button>
          </Grid>
          <Grid item>
            <Button
              sx={{
                backgroundColor: "gray",
                color: "white",
                width: "100%",
                mb: 2,
                mt: 2,
                borderRadius: 2,
                fontWeight: "Bold",
                fontFamily: "Poppins",
                fontSize: 18,
                "&:hover": {
                  backgroundColor: "darkgray",
                },
              }}
              onClick={() => normalAlert(`Card hidden PIN is: ${card.hiddenPin}`)}
            >
              Reveal hidden PIN
            </Button>
          </Grid>
        </Grid>
      )}
      <Modal
        id="CardModal"
        open={isRejectCardModalOpen}
        onClose={() => setIsRejectCardModalOpen(false)}
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
            <TextField
              fullWidth
              label="Rejection Reason"
              variant="outlined"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              sx={{ mt: 2, fontFamily: "Poppins" }}
            />

            <Button type="submit" onClick={handleCardRejection} disabled={isCardBeingRejected}>
              Reject Card
            </Button>
          </center>
        </Box>
      </Modal>
      <Modal
        open={isShowRejectionReasonModalOpen}
        onClose={handleRejectionReasonModalClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "auto",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <center>
            <Typography fontFamily="Poppins" variant="h3">
              Rejection Reason:
            </Typography>
            <Typography fontFamily="Poppins" variant="h5">
              {card.rejectedMessage}
            </Typography>
          </center>
        </Box>
      </Modal>
    </Grid>
  );
};

export default CreditCard;
