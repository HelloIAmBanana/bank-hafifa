import { Box, Typography, Container, Grid, Paper, Modal, Skeleton, Button } from "@mui/material";
import AuthService from "../../AuthService";
import { User } from "../../models/user";
import { Transaction } from "../../models/transactions";
import { createNewNotification, generateUniqueId, getItemInList, getUserFullName } from "../../utils/utils";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../UserProvider";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import { DateTime } from "luxon";
import GenericForm from "../../components/GenericForm/GenericForm";
import OverviewPanel from "./overviewPanel";
import TransactionsTable from "../../components/UserTransactionsTable";
import { useNavigate } from "react-router-dom";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

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
const validateForm = ajv.compile(schema);

const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userOldBalance, setUserOldBalance] = useState<number | undefined>();
  const navigate = useNavigate();

  const isAdmin = useMemo(() => {
    return AuthService.isUserAdmin(currentUser);
  }, [currentUser]);

  const updateBalance = async (user: User, amount: number) => {
    const updatedBalance = user.balance + amount;
    const updatedUser: User = {
      ...user,
      balance: updatedBalance,
    };

    await CRUDLocalStorage.updateItemInList<User>("users", updatedUser);
    if (user.id === currentUser!.id) {
      setCurrentUser(updatedUser);
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
    const designatedUser = await getItemInList<User>("users", data.receiverID)
    const designatedUserName = getUserFullName(designatedUser!);

    const currentDateTime = new Date().toISOString();

    const newTransaction = {
      ...data,
      senderID: currentUser!.id,
      id: generateUniqueId(),
      senderName: getUserFullName(currentUser!),
      receiverName: designatedUserName,
      date: currentDateTime,
    };

    await createNewNotification(data.receiverID, "newTransaction");
    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
  };

  const handleSubmitTransaction = async (data: any) => {
    if (!validateForm(data)) return;

    setUserOldBalance(currentUser!.balance);

    const amount = data.amount;

    if (data.receiverID === currentUser!.id) {
      errorAlert("You can't enter your own ID!");
      closePaymentModal();
      return;
    }

    setIsButtonLoading(true);

    const receivingUser = await getItemInList<User>("users", data.receiverID);

    if (!receivingUser) {
      errorAlert("Entered ID is WRONG");
      setIsButtonLoading(false);
      closePaymentModal();
      return;
    }

    await createNewTransaction(data);
    await updateBalance(receivingUser, amount);
    await updateBalance(currentUser!, -amount);

    successAlert(`Transferred $${amount} to ${receivingUser.firstName}`);

    setIsButtonLoading(false);
    closePaymentModal();
  };

  const fetchUserTransactions = async () => {
    setIsTableLoading(true);
    try {
      const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");
      const sortedTransactions = fetchedTransactions.sort((a, b) => {
        return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
      });
      const userTransactions = sortedTransactions.filter(
        (transaction) => transaction.senderID === currentUser!.id || transaction.receiverID === currentUser!.id
      );
      setTransactions(userTransactions);
      setIsTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchUserTransactions();
    // eslint-disable-next-line
  }, [currentUser]);

  document.title = "Home";

  return (
    <Box sx={{ display: "flex", backgroundColor: "white" }}>
      <Container sx={{ mt: 3 }}>
        {isAdmin ? (
          <Grid container direction="column" justifyContent="center" alignItems="center" minHeight="100vh">
            <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
              Welcome Back Admin {getUserFullName(currentUser!)}
            </Typography>
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center" spacing={1}>
              <Grid item>
                <Button type="submit" onClick={() => navigate("/admin/loans")}>
                  Loans Management
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit" onClick={() => navigate("/admin/cards")}>
                  Cards Management
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit">Users Management</Button>
              </Grid>
              <Grid item>
                <Button type="submit">Deposits Management</Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={20}>
            {/* Overview Panel */}
            <Grid item xs={12} md={9} lg={8}>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
                elevation={0}
              >
                <OverviewPanel
                  isTableLoading={isTableLoading}
                  userOldBalance={userOldBalance}
                  isButtonLoading={isButtonLoading}
                  currentUser={currentUser!}
                  openPaymentModal={openPaymentModal}
                />
              </Paper>
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
                {isTableLoading ? (
                  <Skeleton height={350} />
                ) : (
                  <TransactionsTable transactions={transactions} userID={currentUser!.id} />
                )}
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
};
export default Home;
