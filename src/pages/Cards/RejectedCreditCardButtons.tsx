import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { Card } from "../../models/card";
import { useState } from "react";

interface RejectedCreditCardButtonsProps {
  card: Card;
}

const RejectedCreditCardButtons: React.FC<RejectedCreditCardButtonsProps> = ({ card }) => {
  const [isShowRejectionReasonModalOpen, setIsShowRejectionReasonModalOpen] = useState(false);

  const handleRejectionReasonModalOpen = () => setIsShowRejectionReasonModalOpen(true);
  const handleRejectionReasonModalClose = () => setIsShowRejectionReasonModalOpen(false);

  return (
    <Grid>
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

export default RejectedCreditCardButtons;
