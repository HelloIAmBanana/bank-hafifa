import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Grid, Box, Container, Typography, Skeleton, Button, Modal } from "@mui/material";
import { UserContext } from "../../../UserProvider";
import CRUDLocalStorage from "../../../CRUDLocalStorage";
import { errorAlert, successAlert } from "../../../utils/swalAlerts";
import { generateUniqueId, getItemInList, getUserFullName, createNewNotification } from "../../../utils/utils";
import { Deposit } from "../../../models/deposit";
import ajvErrors from "ajv-errors";
import Ajv, { JSONSchemaType } from "ajv";
import GenericForm from "../../../components/GenericForm/GenericForm";
import { User } from "../../../models/user";
import DepositBox from "../../../components/Deposit/DepositBox";
import { useFetchContext } from "../../../FetchContext";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const schema: JSONSchemaType<Deposit> = {
  type: "object",
  properties: {
    id: { type: "string" },
    expireDate: { type: "string" },
    depositOwner: { type: "string" },
    accountID: { type: "string" },
    status: { type: "string" },
    depositAmount: { type: "number", minimum: 1 },
    interest: { type: "number", minimum: 1 },
  },
  required: ["depositAmount", "interest"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      depositOwner: "Entered amount is less than 1",
      interest: "Entered interest is less than 1",
    },
  },
};

const fields = [
  {
    id: "accountID",
    type: "text",
    label: "Desired account ID",
  },
  {
    id: "depositAmount",
    type: "number",
    label: "Enter deposit amount",
  },
  {
    id: "interest",
    type: "number",
    label: "Enter deposit interest",
  },
  {
    id: "expireTime",
    type: "time",
    label: "Enter expire time",
  },
];

const validateForm = ajv.compile(schema);

const AdminDepositsPage: React.FC = () => {
  const [currentUser] = useContext(UserContext);
  const [isCreatingNewDeposit, setIsCreatingNewDeposit] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const { fetchUserDeposits, isLoading, deposits } = useFetchContext();

  const closeDepositModal = () => {
    if (isCreatingNewDeposit) return;
    setIsDepositModalOpen(false);
  };

  const openDepositModal = () => {
    setIsDepositModalOpen(true);
  };

  const handleDepositModalSubmit = async (data: any) => {
    setIsCreatingNewDeposit(true);

    const DepositOwner = await getItemInList<User>("users", data.accountID);

    if (!DepositOwner) {
      setIsCreatingNewDeposit(false);

      errorAlert("Entered ID is WRONG");
      closeDepositModal();
      return;
    }

    const newDeposit: Deposit = {
      ...data,
      id: generateUniqueId(),
      status: "Offered",
      depositOwner: getUserFullName(DepositOwner),
    };

    if (!validateForm(newDeposit)) return;

    await CRUDLocalStorage.addItemToList<Deposit>("deposits", newDeposit);
    setIsCreatingNewDeposit(false);
    createNewNotification(data.accountID, "newDepositOffer");
    successAlert("Deposit was offered!");
    closeDepositModal();
    await fetchUserDeposits();
  };

  useEffect(() => {
    fetchUserDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Deposits Management";

  return (
    <Grid container justifyContent="flex-start">
      <Box component="main" sx={{ ml: 17 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                  <Grid item xs={12}>
                    <Typography variant="h3" fontFamily="Poppins">
                      Deposits
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container justifyContent="flex-start">
                    <Button onClick={openDepositModal} type="submit">
                      Create new deposit
                    </Button>
                  </Grid>
                </Grid>

                {isLoading ? (
                  <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                    <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                  </Grid>
                ) : (
                  <Box>
                    {deposits.length > 0 && (
                      <Grid item mt={2}>
                        <Grid container direction="row">
                          {deposits.map((deposit, index) => (
                            <Grid
                              container
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="center"
                              lg={6}
                              md={8}
                              sm={12}
                            >
                              <Grid item key={index} sx={{ marginRight: 2 }}>
                                <DepositBox deposit={deposit}/>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                )}
              </Grid>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Modal
        open={isDepositModalOpen}
        onClose={closeDepositModal}
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
              onSubmit={handleDepositModalSubmit}
              submitButtonLabel={"Offer Deposit"}
              schema={schema}
              isLoading={isCreatingNewDeposit}
            />
          </center>
        </Box>
      </Modal>
    </Grid>
  );
};

export default AdminDepositsPage;
