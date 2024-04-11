import React, { useState } from "react";
import { Loan } from "../../models/loan";
import { Box, Button, Grid, Modal } from "@mui/material";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { successAlert } from "../../utils/swalAlerts";
import GenericForm from "../GenericForm/GenericForm";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

interface PendingLoanButtonsProps {
  fetchLoans?: () => Promise<void>;
  loan: Loan;
}
const schema: JSONSchemaType<Loan> = {
  type: "object",
  properties: {
    id: { type: "string" },
    loanOwner:{type:"string"},
    loanAmount: { type: "number" },
    accountID: { type: "string" },
    interest: { type: "number" },
    paidBack: { type: "number" },
    status: { type: "string" },
    expireDate: { type: "string", minLength: 1 },
    message: { type: "string" },
  },
  required: [],
  additionalProperties: true,
  errorMessage: {
    properties: {
      accountID: "Enter Account ID",
    },
  },
};

const fields = [
  {
    id: "expireDate",
    label: "Exp Time",
    type: "time",
    placeholder: "Enter Loan Expire Time",
  },
  {
    id: "interest",
    label: "Interest",
    type: "number",
    placeholder: "Enter interest",
  },
];

const validateForm = ajv.compile(schema);

const getExpiredDate = (date: string,chosenTime:string) => {
  const currentTime = date.slice(11, 16);
  const DateWithoutTime = date.split(currentTime);
  const expiredDate = `${DateWithoutTime[0]}${chosenTime}${DateWithoutTime[1]}`
  return expiredDate;
};

const PendingLoanButtons: React.FC<PendingLoanButtonsProps> = ({ loan, fetchLoans }) => {
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isLoanApprovalModalOpen, setIsLoanApprovalModalOpen] = useState(false);

  const rejectLoan = async () => {
    setIsRejectLoading(true);

    const newLoan: Loan = {
      ...loan,
      message: "rejected",
      status: "rejected",
    };

    await CRUDLocalStorage.updateItemInList<Loan>("loans", newLoan);
    successAlert("Loan Rejected!");
    await fetchLoans?.();
  };

  const acceptLoanRequest = async (data: any) => {
    const currentDate = new Date().toISOString();

    const newLoan: Loan = {
      ...loan,
      message: "offered",
      status: "offered",
      expireDate: getExpiredDate(currentDate,data.expireDate),
      interest: data.interest,
    };
    if (!validateForm(newLoan)) return;

    setIsAcceptLoading(true);

    await CRUDLocalStorage.updateItemInList<Loan>("loans", newLoan);
    successAlert("Loan Offered!");
    await fetchLoans?.();
  };

  const openLoanApprovalModal = () => {
    setIsLoanApprovalModalOpen(true);
  };
  const closeLoanApprovalModal = () => {
    if(isAcceptLoading) return ;
    setIsLoanApprovalModalOpen(false);
  };
  return (
    <>
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
              mb: 3,
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
            disabled={isRejectLoading}
            onClick={() => rejectLoan()}
          >
            Reject
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
    </>
  );
};

export default PendingLoanButtons;
