import { Box, Typography, Container, Grid, Paper, Modal, Skeleton } from "@mui/material";
import AuthService from "../../AuthService";
import { User } from "../../models/user";
import { Transaction } from "../../models/transactions";
import { convertCurrency, createNewNotification, generateUniqueId, getUserFullName } from "../../utils/utils";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { Suspense, useState } from "react";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { JSONSchemaType } from "ajv";
import GenericForm from "../../components/GenericForm/GenericForm";
import OverviewPanel from "./overviewPanel";
import TransactionsTable from "./UserTransactionsTable";
import { Await, useLoaderData, useRevalidator } from "react-router-dom";
import { TransactionsLoaderData } from "./transactionsLoader";
import AdminHomePageLayout from "./adminLayout";
import { observer } from "mobx-react-lite";
import userStore from "../../UserStore";

const fields = [
  {
    id: "receiverID",
    type: "text",
    placeholder: "Account ID",
  },
  {
    id: "amount",
    type: "number",
    placeholder: "Amount",
  },
  {
    id: "reason",
    type: "text",
    placeholder: "Reason",
  },
];

const schema: JSONSchemaType<Transaction> = {
  type: "object",
  properties: {
    id: { type: "string" },
    senderID: { type: "string" },
    receiverID: { type: "string", minLength: 1 },
    reason: { type: "string" },
    amount: { type: "number", minimum: 1 },
    senderName: { type: "string" },
    receiverName: { type: "string" },
    date: { type: "string" },
  },
  required: ["receiverID", "amount"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      receiverID: "Please enter ID",
      amount: "Please enter an amount larger than 0",
    },
  },
};

const Home: React.FC = observer(() => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [userOldBalance, setUserOldBalance] = useState<number | undefined>();

  const data = useLoaderData() as TransactionsLoaderData;
  const revalidator = useRevalidator();
  const loadingState = revalidator.state;

  const isLoading = Boolean(loadingState === "loading");

  const isAdmin = AuthService.isUserAdmin(userStore.currentUser);

  let currentUser = userStore.currentUser!;

  const updateBalance = async (user: User, amount: number) => {
    const updatedBalance = user.balance + amount;
    const updatedUser: User = {
      ...user,
      balance: updatedBalance,
    };

    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    if (user.id === currentUser!.id) {
      currentUser = updatedUser;
    }
  };

  const openPaymentModal = () => {
    if (isButtonLoading) return;
    setPaymentModal(true);
  };

  const closePaymentModal = async () => {
    if (isButtonLoading) return;
    setPaymentModal(false);
  };

  const createNewTransaction = async (data: any) => {
    const designatedUser = await CRUDLocalStorage.getItemInList<User>("users", data.receiverID);
    const designatedUserName = getUserFullName(designatedUser!);

    const currentDateTime = new Date().toISOString();

    const newTransaction = {
      ...data,
      senderID: currentUser!.id,
      id: generateUniqueId(),
      senderName: getUserFullName(currentUser!),
      receiverName: designatedUserName,
      date: currentDateTime,
      amount: convertCurrency(currentUser.currency,data.amount)
    };

    await createNewNotification(data.receiverID, "newTransaction");
    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
  };

  const handleSubmitTransaction = async (data: any) => {
    setUserOldBalance(currentUser!.balance);

    const amount = data.amount;

    if (data.receiverID === currentUser!.id) {
      errorAlert("You can't enter your own ID!");
      closePaymentModal();
      return;
    }

    setIsButtonLoading(true);

    const receivingUser = await CRUDLocalStorage.getItemInList<User>("users", data.receiverID);

    if (!receivingUser) {
      errorAlert("Entered ID is WRONG");
      setIsButtonLoading(false);
      closePaymentModal();
      return;
    }

    await createNewTransaction(data);
    await updateBalance(receivingUser, amount);
    await updateBalance(currentUser!, -amount);
    revalidator.revalidate();

    successAlert(`Transferred $${amount} to ${receivingUser.firstName}`);

    setIsButtonLoading(false);
    closePaymentModal();
  };

  document.title = "Home";
  return (
    <Box sx={{ display: "flex" }}>
      <Container sx={{ mt: 3 }}>
        {isAdmin ? (
          <AdminHomePageLayout currentUser={currentUser!} />
        ) : (
          <Grid container spacing={20}>
            {/* Overview Panel */}
            <Grid item xs={12} md={9} lg={8}>
              <OverviewPanel
                isTableLoading={isLoading}
                userOldBalance={userOldBalance}
                isButtonLoading={isButtonLoading}
                openPaymentModal={openPaymentModal}
              />
            </Grid>
            {/* Quick Transaction */}
            <Grid item xs={4} md={4} lg={4} order={{ xs: 3, md: 3, lg: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                Quick Transaction
              </Typography>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 5,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#D3E1F5",
                    borderRadius: 5,
                    height: "150",
                    borderColor: "#808080",
                  }}
                >
                  <GenericForm
                    fields={fields}
                    onSubmit={handleSubmitTransaction}
                    schema={schema}
                    isLoading={isButtonLoading && !isPaymentModalOpen}
                    submitButtonLabel="Send Money"
                  />
                </Box>
              </Paper>
            </Grid>
            {/* Transactions Table*/}
            <Grid item xs={12} md={9} lg={12} order={{ xs: 2, md: 2, lg: 3 }} mt={-20}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }} elevation={0}>
                <Typography variant="h4" gutterBottom fontWeight={"bold"} fontFamily={"Poppins"}>
                  Transactions
                </Typography>
                <Suspense
                  fallback={
                    <Grid item xs={2} sm={4} md={8} xl={12} mt={2}>
                      <Skeleton height={350} />
                    </Grid>
                  }
                >
                  <Await resolve={data.transactions} errorElement={<p>Error loading transactions!</p>}>
                    {(transactions) =>
                      isLoading ? (
                        <Skeleton sx={{ transform: "translate(0,0)", height: "387px", width: "1120px" }} />
                      ) : (
                        <Box>
                          <TransactionsTable transactions={transactions} user={currentUser} />
                        </Box>
                      )
                    }
                  </Await>
                </Suspense>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      <Modal
        open={isPaymentModalOpen}
        onClose={closePaymentModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 360,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 5,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "Poppins" }}>
            New Transaction
          </Typography>
          <Grid item mx="auto">
            <GenericForm
              fields={fields}
              onSubmit={handleSubmitTransaction}
              schema={schema}
              isLoading={isButtonLoading && isPaymentModalOpen}
              submitButtonLabel={"2 3 SHA-GER"}
            />
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
});

export default Home;
