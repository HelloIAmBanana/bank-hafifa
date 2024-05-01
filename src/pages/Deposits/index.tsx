import { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Grid, Modal, Skeleton, Typography } from "@mui/material";
import DepositRows from "./DepositRows";
import { useFetchDepositsContext } from "../../contexts/fetchDepositsContext";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { Deposit } from "../../models/deposit";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../models/user";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import GenericForm from "../../components/GenericForm/GenericForm";
import { createNewNotification, generateUniqueId, getUserFullName } from "../../utils/utils";
import AuthService from "../../AuthService";
import { UserContext } from "../../UserProvider";
import { JSONSchemaType } from "ajv";

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
  const { isLoading, deposits } = useFetchDepositsContext();
  const [isCreatingNewDeposit, setIsCreatingNewDeposit] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [currentUser] = useContext(UserContext);

  const navigate = useNavigate();
  const { userID } = useParams();
  const isAdmin = AuthService.isUserAdmin(currentUser);

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

  const activeDeposits = useMemo(() => {
    const activeDeposits = deposits.filter((deposit) => deposit.status === "Active");
    return userID ? activeDeposits.filter((deposit) => deposit.accountID === userID) : activeDeposits;
  }, [deposits]);

  const offeredDeposits = useMemo(() => {
    const offeredDeposits = deposits.filter((deposit) => deposit.status === "Offered");
    return userID ? offeredDeposits.filter((deposit) => deposit.accountID === userID) : offeredDeposits;
  }, [deposits]);

  const withdrawableDeposits = useMemo(() => {
    const withdrawableDeposits = deposits.filter((deposit) => deposit.status === "Withdrawable");
    return userID ? withdrawableDeposits.filter((deposit) => deposit.accountID === userID) : withdrawableDeposits;
  }, [deposits]);

  document.title = "Deposits";

  useEffect(() => {
    updateExpiredDeposits();
    isSpectatedUserReal();
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

                {isLoading ? (
                  <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                    <Skeleton height={"12rem"} width={window.innerWidth / 2} />
                  </Grid>
                ) : (
                  <Box>
                    <DepositRows deposits={activeDeposits} title="Active" />
                    {(!isAdmin || userID) && <DepositRows deposits={offeredDeposits} title="Offered" />}
                    {(!isAdmin || userID) && <DepositRows deposits={withdrawableDeposits} title="Withdrawable" />}
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

export default DepositsPage;