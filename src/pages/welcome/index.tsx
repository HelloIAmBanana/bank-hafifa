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
import { Button, Grid, Paper, Typography, Modal, CircularProgress, Box, Skeleton } from "@mui/material";
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
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPaymentModalOpen, setPaymentModal] = useState(false);
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [userOldBalance, setUserOldBalance] = useState<number>();
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
    setUserOldBalance(currentUser?.balance);
    setPaymentModal(true);
  };

  const closePaymentModal = async () => {
    if (isButtonLoading) return;
    setPaymentModal(false);
    setUserOldBalance(currentUser?.balance);
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
          await createNewTransaction(data);

          await updateBalance(receivingUser, +data.amount);
          await updateBalance(currentUser, -data.amount);
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
    setIsTableLoading(true);
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
      setIsTableLoading(false);
      setIsFirstTimeLoading(false);
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
        <center>
          <Box>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    padding: 2,
                    width: 500,
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
                      fontSize: 36,
                    }}
                  >
                    {!isFirstTimeLoading ? (
                      currentUser && !isButtonLoading && !isTableLoading && !isPaymentModalOpen ? (
                        `${currentUser.balance} $`
                      ) : (
                        `${userOldBalance} $`
                      )
                    ) : (
                      <Skeleton width={150} height={100}/>
                    )}
                  </Typography>
                  <Button onClick={openPaymentModal}>Make A Payment💸</Button>
                </Paper>
              </Grid>
            </Grid>
            <Box padding={0.5}>
              <Typography variant="h3" fontFamily={"Poppins"}>
                Recent Transaction
              </Typography>
              <UserTransactionsTable rows={transactions} isLoading={isTableLoading} currentUserID={currentUser.id} />
            </Box>
          </Box>
        </center>
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
