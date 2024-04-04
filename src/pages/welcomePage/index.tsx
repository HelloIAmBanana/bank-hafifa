import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import NavBar from "../../components/NavigationBar/NavBar";
import AuthService from "../../AuthService";
import { User } from "../../models/user";
import { generateUniqueId, updateUser } from "../../utils/utils";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { Transaction } from "../../models/transactions";
import { CircularProgress, Modal } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserProvider";
import { TransactionRow } from "../../models/transactionRow";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import Ajv, { JSONSchemaType } from "ajv";
import ajvErrors from "ajv-errors";
import { DateTime } from "luxon";
import GenericForm from "../../components/GenericForm/GenericForm";
import QuickTransaction from "./quickTransaction";
import OverviewPanel from "./overviewPanel";
import TransactionsTable from "../../components/UserTransactionsTable";
import Loader from 'react-loaders'

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
    amount: { type: "string", minLength: 1 },
    senderName: { type: "string" },
    receiverName: { type: "string" },
    date: { type: "string" },
  },
  required: ["receiverID", "amount"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      reason: "",
      receiverID: "Enter ID",
      amount: "Enter Amount",
    },
  },
};
const validateForm = ajv.compile(schema);

export default function Welcome() {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [userOldBalance, setUserOldBalance] = useState<number | undefined>();

  const updateBalance = async (user: User, amount: number) => {
    const updatedBalance = user.balance + amount;
    const updatedUser: User = {
      ...user,
      balance: updatedBalance,
    };
    await updateUser(updatedUser);
    if (user.id === currentUser?.id) {
      setCurrentUser(updatedUser);
    }
  };

  const openPaymentModal = () => {
    setPaymentModal(true);
  };

  const closePaymentModal = async () => {
    if (isButtonLoading) return;
    setPaymentModal(false);
  };

  const createNewTransaction = async (data: any) => {
    const designatedUser = (await AuthService.getUserFromStorage(data.receiverID)) as User;
    const designatedUserName = AuthService.getUserFullName(designatedUser);

    const currentDateTime = new Date();

    const newTransaction = {
      ...data,
      amount: Number(data.amount),
      senderID: currentUser?.id,
      id: generateUniqueId(),
      senderName: AuthService.getUserFullName(currentUser as User),
      receiverName: designatedUserName,
      date: currentDateTime.toISOString(),
    };
    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
  };

  const handleSubmitTransaction = async (data: any) => {
    setUserOldBalance(currentUser!.balance);
    if (!validateForm(data)) return;

    const amount = +data.amount;

    if (amount <= 0) {
      errorAlert("You can't enter a negative transaction amount!");
      closePaymentModal();
      return;
    }

    setIsButtonLoading(true);

    if (data.receiverID === currentUser!.id) {
      errorAlert("You can't enter your own ID!");
      setIsButtonLoading(false);
      closePaymentModal();
      return;
    }

    const receivingUser = await AuthService.getUserFromStorage(data.receiverID);
    if (!receivingUser) {
      errorAlert("Entered ID is WRONG");
      setIsButtonLoading(false);
      closePaymentModal();
      return;
    }
    await createNewTransaction(data);
    await updateBalance(receivingUser, amount);
    await updateBalance(currentUser!, -amount);

    successAlert(`Transferred ${amount}$ to ${receivingUser.firstName}`);

    setIsButtonLoading(false);
    closePaymentModal();
  };

  const fetchUserTransactions = async () => {
    setIsTableLoading(true);
    if (currentUser) {
      try {
        const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");
        const sortedTransactions = fetchedTransactions.sort((a, b) => {
          return DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis();
        });
        setTransactions(sortedTransactions);
        setIsTableLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    fetchUserTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Home";

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      
        <Box
          component="main"
          sx={{
            flexGrow: 0,
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 2 }}>
          {!currentUser ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <center>
                      <Loader type="pacman" active={true} />
                      </center>
                  </Box>
      ) : (
            <Grid container spacing={5}>
              {/* Overview */}
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
                    currentUser={currentUser}
                    openPaymentModal={openPaymentModal}
                  />
                </Paper>
              </Grid>
              {/* Quick Transaction */}
              <Grid item xs={4} md={4} lg={4} order={{ xs: 3, md: 3, lg: 2 }}>
                <Paper
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  elevation={0}
                >
                  <QuickTransaction
                    fields={fields}
                    handleSubmitTransaction={handleSubmitTransaction}
                    schema={schema}
                    isLoading={isButtonLoading && !isPaymentModalOpen}
                  />
                </Paper>
              </Grid>
              {/* Transactions */}
              <Grid item xs={12} md={9} lg={12} order={{ xs: 2, md: 2, lg: 3 }}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }} elevation={0}>
                  <Typography variant="h6" fontWeight={"bold"} fontFamily={"Poppins"}>
                    Transactions
                  </Typography>
                  <TransactionsTable transactions={transactions} isLoading={isTableLoading} userID={currentUser.id} />
                </Paper>
              </Grid>
            </Grid>
        )}  </Container>
        </Box>
      
      <Modal
        open={isPaymentModalOpen}
        onClose={closePaymentModal}
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
            width: 600,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom sx={{ fontFamily: "Poppins" }}>
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
}
