import * as React from "react";
import AuthService from "../../AuthService";
import { useState, useContext, useEffect } from "react";
import { User } from "../../models/user";
import { Transaction } from "../../models/transactions";
import { generateUniqueId, updateUser } from "../../utils/utils";
import { errorAlert, successAlert } from "../../utils/swalAlerts";
import { UserContext } from "../../UserProvider";
import UserTransactionsTable from "../../components/UserTransactionsTable";
import { DateTime } from "luxon";
import { Button, Grid, Paper, Typography, Modal, CircularProgress, Box } from "@mui/material";
import ajvErrors from "ajv-errors";
import Ajv, { JSONSchemaType } from "ajv";
import GenericForm from "../../components/GenericForm/GenericForm";
import CRUDLocalStorage from "../../CRUDLocalStorage";
import { TransactionRow } from "../../models/transactionRow";
import NavBar from "../../components/NavigationBar/NavBar";

const ajv = new Ajv({ allErrors: true, $data: true });
ajvErrors(ajv);

const fields = [
  {
    id: "receiverID",
    label: "Receiver ID",
    type: "text",
    placeholder: "Enter the desired account ID",
  },
  {
    id: "amount",
    label: "Amount",
    type: "number",
    placeholder: "Enter transaction amount",
  },
  {
    id: "reason",
    label: "Transaction Reason",
    type: "text",
    placeholder: "Enter transaction reason",
  },
];

const schema: JSONSchemaType<Transaction> = {
  type: "object",
  properties: {
    id: { type: "string" },
    senderID: { type: "string" },
    receiverID: { type: "string", minLength: 1 },
    reason: { type: "string", minLength: 1 },
    amount: { type: "number" },
    senderName: { type: "string" },
    receiverName: { type: "string" },
    date: { type: "string" },
  },
  required: ["receiverID", "amount"],
  additionalProperties: true,
  errorMessage: {
    properties: {
      reason: "",
      receiverID: "",
      amount: "",
    },
  },
};

const WelcomePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isTableReady, setIsTableReady] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [userBalance, setUserBalance] = useState<number | undefined>(undefined);

  const updateBalance = async (user: User, amount: number) => {
    const updatedBalance = user.balance + amount;
    const updatedUser: User = {
      ...user,
      balance: updatedBalance,
    };
    await updateUser(updatedUser);
    if (user.id === currentUser?.id) {
      setUserBalance(updatedBalance);
      setCurrentUser(updatedUser);
    }
  };

  const openPaymentModal = () => {
    setPaymentModal(true);
  };

  const closePaymentModal = () => {
    if (isButtonLoading) return;
    setPaymentModal(false);
  };
  const createNewTransaction = async (data: any) => {
    const designatedUser = (await AuthService.getUserFromStorage(data.receiverID)) as User;
    const designatedUserName = AuthService.getUserFullName(designatedUser);

    const currentDateTime = new Date();

    const newTransaction = {
      ...data,
      senderID: currentUser?.id,
      id: generateUniqueId(),
      senderName: AuthService.getUserFullName(currentUser as User),
      receiverName: designatedUserName,
      date: currentDateTime.toISOString(),
    };
    await CRUDLocalStorage.addItemToList<Transaction>("transactions", newTransaction);
  };

  const handleSubmitTransaction = async (data: any) => {
    setIsButtonLoading(true);
    if (currentUser) {
      if (data.receiverID !== currentUser.id) {
        const receivingUser = await AuthService.getUserFromStorage(data.receiverID);
        if (receivingUser != null) {
          await updateBalance(currentUser, -data.amount);
          await updateBalance(receivingUser, +data.amount);
          await createNewTransaction(data);
          await fetchUserTransactions();
          successAlert(`Transfered ${data.amount}$ to ${receivingUser.firstName}`);
        } else {
          errorAlert("Entered ID is WRONG");
        }
      } else {
        errorAlert("You can't enter your own ID!");
      }
    }
    setIsButtonLoading(false);
    closePaymentModal();
  };

  const styleAmount = (userID: string, amount: number) => {
    return userID === currentUser?.id ? `-${amount}$` : `+${amount}$`;
  };

  const fetchUserTransactions = async () => {
    setIsTableReady(false);
    if (currentUser) {
      try {
        const fetchedTransactions = await CRUDLocalStorage.getAsyncData<Transaction[]>("transactions");
        const modifiedTransactions = await Promise.all(
          fetchedTransactions.map((transaction) => {
            const styledAmount = styleAmount(transaction.senderID, transaction.amount);
            const styledDate = DateTime.fromISO(transaction.date, {
              zone: "Asia/Jerusalem",
            }).toFormat("dd/MM/yyyy HH:mm");
            return {
              ...transaction,
              amount: styledAmount,
              date: styledDate,
            };
          })
        );
        setTransactions(modifiedTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsTableReady(true);
    }
  };

  useEffect(() => {
    fetchUserTransactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  document.title = "Home";

  return (
    <Box mx={30} sx={{ paddingTop: 8 }}>
      <NavBar />
      {!currentUser ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: 2,
                  width: 250,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#FAFBFF",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                  Your Balance💰
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: "bold",
                    marginTop: 2,
                    fontSize: 18,
                  }}
                >
                  {currentUser ? userBalance ? userBalance : currentUser.balance : <CircularProgress />}
                </Typography>
                <Button onClick={openPaymentModal}>Make A Payment💸</Button>
              </Paper>
            </Grid>
          </Grid>
          <Box padding={0.5}>
            <Typography variant="h3" fontFamily={"Poppins"}>
              Recent Transaction
            </Typography>
            <UserTransactionsTable rows={transactions} isLoading={!isTableReady} currentUserID={currentUser.id} />
          </Box>
        </Box>
      )}
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
            Create Transaction
          </Typography>
          <Grid item mx="auto" textAlign="center">
            <GenericForm
              fields={fields}
              onSubmit={handleSubmitTransaction}
              submitButtonLabel={isButtonLoading ? <CircularProgress /> : "2 3 SHA-GER"}
              schema={schema}
            />
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default WelcomePage;
