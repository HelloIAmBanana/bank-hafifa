import { Suspense, useContext, useEffect, useState } from "react";
import { Box, Button, Container, Grid, Modal, Skeleton, Typography } from "@mui/material";
import DepositRows from "./Deposit/DepositRows";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { Deposit } from "../../models/deposit";
import { Await, useLoaderData, useNavigate, useParams, useRevalidator } from "react-router-dom";
import { User } from "../../models/user";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import GenericForm from "../../components/GenericForm/GenericForm";
import { createNewNotification, filterArrayByStatus, generateUniqueId, getUserFullName } from "../../utils/utils";
import AuthService from "../../AuthService";
import { UserContext } from "../../UserProvider";
import { JSONSchemaType } from "ajv";
import { GenericLoaderData } from "../../utils/genericLoader";

const schema: JSONSchemaType<Deposit> = {
  type: "object",
  properties: {
    id: { type: "string" },
    expireDate: { type: "string", minLength: 1 },
    depositOwner: { type: "string" },
    accountID: { type: "string", minLength: 1 },
    status: { type: "string" },
    depositAmount: { type: "number", minimum: 1 },
    interest: { type: "number", minimum: 1 },
  },
  required: ["accountID", "depositAmount", "interest", "expireDate"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      depositAmount: "Entered amount is less than 1",
      interest: "Entered interest is less than 1",
      accountID: "Enter account ID",
      expireDate: "Enter expire date",
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
    id: "expireDate",
    type: "datetime-local",
    label: "Enter expire date",
  },
];

const DepositsPage: React.FC = () => {
  const [isCreatingNewDeposit, setIsCreatingNewDeposit] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [currentUser] = useContext(UserContext);

  const navigate = useNavigate();
  const { userID } = useParams();
  const isAdmin = AuthService.isUserAdmin(currentUser);

  const data = useLoaderData() as GenericLoaderData<Deposit>;
  const revalidator = useRevalidator();
  const loadingState = revalidator.state;

  const isLoading = Boolean(loadingState === "loading");

  const closeDepositModal = () => {
    if (isCreatingNewDeposit) return;
    setIsDepositModalOpen(false);
  };

  const openDepositModal = () => {
    setIsDepositModalOpen(true);
  };

  const handleDepositModalSubmit = async (data: any) => {
    setIsCreatingNewDeposit(true);

    const depositOwner = await CRUDLocalStorage.getItemInList<User>("users", data.accountID);

    if (!depositOwner) {
      setIsCreatingNewDeposit(false);

      errorAlert("Entered ID is WRONG");
      closeDepositModal();
      return;
    }

    const newDeposit: Deposit = {
      ...data,
      id: generateUniqueId(),
      status: "Offered",
      depositOwner: getUserFullName(depositOwner),
    };

    await CRUDLocalStorage.addItemToList<Deposit>("deposits", newDeposit);
    setIsCreatingNewDeposit(false);
    createNewNotification(data.accountID, "newDepositOffer");
    successAlert("Deposit was offered!");
    closeDepositModal();
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

  const updateExpiredDeposits = async () => {
    const currentDate = new Date().toISOString();
    const deposits = await CRUDLocalStorage.getAsyncData<Deposit[]>("deposits");

    const expiredDeposits = deposits.filter((deposit) => deposit.expireDate < currentDate);

    for (const deposit of expiredDeposits) {
      if (deposit.status === "Active") {
        const updatedDeposit: Deposit = {
          ...deposit,
          status: "Withdrawable",
        };
        await CRUDLocalStorage.updateItemInList<Deposit>("deposits", updatedDeposit);
      }
      if (deposit.status === "Offered") {
        await CRUDLocalStorage.deleteItemFromList<Deposit>("deposits", deposit);
      }
    }
  };

  document.title = isAdmin ? "Manage Deposits" : "Deposits";

  useEffect(() => {
    updateExpiredDeposits();
    isSpectatedUserReal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container justifyContent="flex-start">
      <Box component="main" sx={{ flexGrow: 0, ml: 15 }}>
        <Container sx={{ mt: 2 }}>
          <Grid container spacing={5}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                  <Grid item xs={12} justifyContent="flex-start">
                    <Typography variant="h3" fontFamily="Poppins">
                      Deposits
                    </Typography>
                    {isAdmin && !userID && (
                      <Button onClick={openDepositModal} type="submit">
                        Create new deposit
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
                  <Await resolve={data.items} errorElement={<p>Error loading package location!</p>}>
                    {(deposits) =>
                      isLoading ? (
                        <Box>
                          <Skeleton sx={{ transform: "translate(0,0)" }}>
                            <DepositRows deposits={filterArrayByStatus(deposits, "Offered", userID)} title="Offered" />
                          </Skeleton>
                          {(!isAdmin || userID) && (
                            <Box>
                              <Skeleton sx={{ transform: "translate(0,0)" }}>
                                <DepositRows
                                  deposits={filterArrayByStatus(deposits, "Active", userID)}
                                  title="Active"
                                />
                              </Skeleton>
                              <Skeleton sx={{ transform: "translate(0,0)" }}>
                                <DepositRows
                                  deposits={filterArrayByStatus(deposits, "Withdrawable", userID)}
                                  title="Withdrawable"
                                />
                              </Skeleton>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box>
                          <DepositRows deposits={filterArrayByStatus(deposits, "Offered", userID)} title="Offered" />
                          {(!isAdmin || userID) && (
                            <Box>
                              <DepositRows deposits={filterArrayByStatus(deposits, "Active", userID)} title="Active" />
                              <DepositRows
                                deposits={filterArrayByStatus(deposits, "Withdrawable", userID)}
                                title="Withdrawable"
                              />
                            </Box>
                          )}
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

export default DepositsPage;
