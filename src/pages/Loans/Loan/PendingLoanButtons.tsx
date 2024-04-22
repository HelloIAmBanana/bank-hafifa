import React, { useState } from "react";
import { Loan } from "../../../models/loan";
import { Box, Button, CircularProgress, Grid, Modal } from "@mui/material";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { successAlert } from "../../../utils/swalAlerts";
import GenericForm from "../../../components/GenericForm/GenericForm";
import { JSONSchemaType } from "ajv";
import { createNewNotification } from "../../../utils/utils";
import { useRevalidator } from "react-router-dom";


interface PendingLoanButtonsProps {
  loan: Loan;
}

const schema: JSONSchemaType<Loan> = {
  type: "object",
  properties: {
    id: { type: "string" },
    loanOwner: { type: "string" },
    loanAmount: { type: "number" },
    accountID: { type: "string" },
    interest: { type: "number", minimum: 1 },
    paidBack: { type: "number" },
    status: { type: "string" },
    expireDate: { type: "string", minLength: 1 },
  },
  required: ["expireDate","interest"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      expireDate: "Please Enter Loan Expire Time.",
      interest: "Please Enter A Number Above 0.",
    },
  },
};

const fields = [
  {
    id: "expireDate",
    label: "Expiry Date",
    type: "datetime-local",
    placeholder: "Enter Loan Expire Date",
  },
  {
    id: "interest",
    label: "Interest",
    type: "number",
    placeholder: "Enter interest",
  },
];


const PendingLoanButtons: React.FC<PendingLoanButtonsProps> = ({ loan }) => {
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isLoanApprovalModalOpen, setIsLoanApprovalModalOpen] = useState(false);
  
  const revalidator = useRevalidator();

  const rejectLoan = async () => {
    setIsRejectLoading(true);

    const newLoan: Loan = {
      ...loan,
      status: "rejected",
    };

    await createNewNotification(loan.accountID,"loanDeclined");

    await CRUDLocalStorage.updateItemInList<Loan>("loans", newLoan);
    revalidator.revalidate()
    successAlert("Loan Rejected!");
  };

  const acceptLoanRequest = async (data: any) => {
    const expiryDate = new Date(`${data.expireDate}`).toISOString();

    const newLoan: Loan = {
      ...loan,
      ...data,
      status: "offered",
      expireDate: expiryDate
    };


    setIsAcceptLoading(true);

    await createNewNotification(loan.accountID,"loanApproved");

    await CRUDLocalStorage.updateItemInList<Loan>("loans", newLoan);
    revalidator.revalidate()
    successAlert("Loan Offered!");
  };

  const openLoanApprovalModal = () => {
    setIsLoanApprovalModalOpen(true);
  };

  const closeLoanApprovalModal = () => {
    if (isAcceptLoading) return;
    setIsLoanApprovalModalOpen(false);
  };
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item>
        <Button
          sx={{
            backgroundColor: "green",
            fontFamily: "Poppins",
            fontSize: 18,
            mb: 3,
            color: "white",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}
          onClick={openLoanApprovalModal}
        >
          Aceept
        </Button>
      </Grid>
      <Grid item>
        <Button
          sx={{
            backgroundColor: "red",
            fontFamily: "Poppins",
            color: "white",
            fontSize: 18,
            height:"43.5px",
            width:"82px",
            mb: 3,
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          disabled={isRejectLoading}
          onClick={() => rejectLoan()}
        >
          {isRejectLoading?<CircularProgress size={25} sx={{color:"white"}}/>:"Reject"}
        </Button>
      </Grid>
      <Modal
        open={isLoanApprovalModalOpen}
        onClose={closeLoanApprovalModal}
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
              onSubmit={acceptLoanRequest}
              submitButtonLabel={"Approve Loan"}
              schema={schema}
              isLoading={isAcceptLoading}
            />
          </center>
        </Box>
      </Modal>
    </Grid>
  );
};

export default PendingLoanButtons;
