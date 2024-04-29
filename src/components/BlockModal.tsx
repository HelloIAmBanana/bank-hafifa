import { Grid, Modal, Typography } from "@mui/material";
import React from "react";

const BlockModal: React.FC = () => {
  return (
    <Modal open={true} sx={{ backgroundColor: "white" }}>
      <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh" mr={5}>
        <Typography fontFamily="Poppins" variant="h2">
          Your account was blocky blocky!
        </Typography>
        <Typography fontFamily="Poppins" variant="h4">
          Please don't contact us.
        </Typography>
      </Grid>
    </Modal>
  );
};

export default BlockModal;
